import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { initiatePayment, verifyWebhookSignature } from '../services/flutterwave';
import { authMiddleware } from '../middleware/auth';

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
        // persist provider response
        await prisma.payment.update({ where: { reference }, data: { providerResponse: providerResponse } as any });
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

// Public status endpoint clients can poll
router.get('/status/:reference', async (req, res) => {
  const { reference } = req.params;
  if (!reference) return res.status(400).json({ error: 'reference required' });
  try {
    const payment = await prisma.payment.findUnique({ where: { reference } });
    if (!payment) return res.status(404).json({ error: 'payment not found' });
    const user = await prisma.user.findUnique({ where: { id: payment.userId } });
    return res.json({ reference: payment.reference, status: payment.status, user: { id: user?.id, email: user?.email, isPremium: user?.isPremium } });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// Admin: list recent payments
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'admin required' });
    const payments = await prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
    return res.json(payments);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// Admin: get payment by reference
router.get('/:reference', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'admin required' });
    const { reference } = req.params;
    const payment = await prisma.payment.findUnique({ where: { reference } });
    if (!payment) return res.status(404).json({ error: 'not found' });
    return res.json(payment);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
});

// Admin: rollback activation (set payment failed, remove subscription, un-premium user)
router.post('/rollback', authMiddleware, async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'admin required' });
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ error: 'reference required' });
    const payment = await prisma.payment.findUnique({ where: { reference } });
    if (!payment) return res.status(404).json({ error: 'payment not found' });

    // update payment
    await prisma.payment.update({ where: { reference }, data: { status: 'failed' } });

    // remove subscription(s) for this user
    await prisma.subscription.updateMany({ where: { userId: payment.userId }, data: { status: 'cancelled' } });

    // set user isPremium false
    await prisma.user.update({ where: { id: payment.userId }, data: { isPremium: false } });

    return res.json({ ok: true });
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
