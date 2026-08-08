import axios from 'axios';

const FLW_BASE = process.env.FLUTTERWAVE_API || 'https://api.flutterwave.com/v3';
const FLW_SECRET = process.env.FLUTTERWAVE_SECRET || '';

export async function initiatePayment({ amount, currency = 'UGX', phone, reference }: { amount: number; currency?: string; phone?: string | null; reference: string }) {
  // Build a payload for Flutterwave v3 payments endpoint (sandbox)
  const payload: any = {
    tx_ref: reference,
    amount: String(amount),
    currency: currency,
    redirect_url: '',
    payment_options: 'mobilemoneyuganda',
    customer: {
      phone: phone || null,
      email: 'user@example.com',
      name: 'Jaro User'
    }
  };

  try {
    const resp = await axios.post(`${FLW_BASE}/payments`, payload, {
      headers: {
        Authorization: `Bearer ${FLW_SECRET}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    return resp.data;
  } catch (e: any) {
    console.error('Flutterwave initiate error', e?.response?.data || e.message);
    throw e;
  }
}

export function verifyWebhookSignature(headers: any, body: any) {
  // Flutterwave sends a 'verif-hash' header matching your webhook secret.
  const verif = headers['verif-hash'] || headers['x-flutterwave-signature'] || headers['flw-signature'];
  if (!verif) return false;
  // In many setups the provider will set verif-hash to the webhook secret directly for verification
  return verif === FLW_SECRET;
}
