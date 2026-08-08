import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { initiatePayment, verifyWebhookSignature } from '../services/flutterwave';

const prisma = new PrismaClient();
const router = Router();
const DEFAULT_PHONE = process.env.DEFAULT_MOBILE_NUMBER || '+256709665041';

// Initiate a mobile-money payment (integrated with provider when configured)
router.post('/initiate', async (req, res) => {
  const { userId, plan, amount, phone } = req.body;
  if (!userId || !plan || !amount) return res.status(400).json({ error: 'userId, plan and amount required' });

  // Create payment record in DB with status pending
  const reference = `mm_${uuidv4()}`;
  try {
    const payment = await prisma.payment.create({
      data: { reference, amount: Number(amount), userId: Number(userId), status: 'pending' }
    });

    // Use provided phone or default number
    const targetPhone = phone || DEFAULT_PHONE;

    let providerResponse = null;
    if (process.env.MOBILE_MONEY_PROVIDER === 'flutterwave' && process.env.FLUTTERWAVE_SECRET) {
      try {
        providerResponse = await initiatePayment({ amount: Number(amount), phone: targetPhone, reference });
      } catch (e: any) {
        console.error('Provider initiation error', e?.response?.data || e.message || e);
        // keep providerResponse null and allow client to poll or wait for webhook
      }
    }

    return res.json({ reference: payment.reference, status: payment.status, provider: process.env.MOBILE_MONEY_PROVIDER || 'mobile_money', phone: targetPhone, providerResponse });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// Webhook endpoint for mobile-money provider to call when payment completes
router.post('/webhook', async (req, res) => {
  // Provider should POST JSON with reference, status, amount, phone, and optionally signature
  const { reference, status, amount, userId } = req.body;

  try {
    if (process.env.MOBILE_MONEY_PROVIDER === 'flutterwave' && process.env.FLUTTERWAVE_SECRET) {
      const ok = verifyWebhookSignature(req.headers, req.body);
      if (!ok) {
        console.warn('Invalid webhook signature');
        return res.status(400).json({ error: 'invalid signature' });
      }
    }

    if (!reference) return res.status(400).json({ error: 'reference required' });

    const payment = await prisma.payment.findUnique({ where: { reference } });
    if (!payment) {
      console.warn('payment not found for reference', reference);
      return res.status(404).json({ error: 'payment not found' });
    }

    // Idempotency: if already processed, return success
    if (payment.status === 'success') return res.json({ ok: true });

    // Update payment status
    const updated = await prisma.payment.update({ where: { reference }, data: { status: status || 'unknown' } });

    if ((status || '').toLowerCase() === 'success') {
      // Mark user premium and create a subscription record
      const uid = userId || payment.userId;
      await prisma.user.update({ where: { id: Number(uid) }, data: { isPremium: true } });
      await prisma.subscription.create({ data: { userId: Number(uid), plan: 'mobile_money', status: 'active' } });
    }

    return res.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
