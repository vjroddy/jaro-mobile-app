import React, { useState } from 'react';

export default function SubscriptionScreen({ navigation }: any) {
  const [userId, setUserId] = useState('1');
  const [amount, setAmount] = useState('5000');
  const [plan, setPlan] = useState('monthly');
  const [status, setStatus] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function initiate() {
    setStatus('initiating');
    try {
      const res = await fetch('http://localhost:4000/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(userId), plan, amount: Number(amount) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'initiate failed');
      setReference(data.reference);
      setStatus('pending');
      // start polling
      pollStatus(data.reference);
    } catch (e: any) {
      setStatus('error: ' + e.message);
    }
  }

  async function pollStatus(ref: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:4000/payments/status/${ref}`);
        const data = await res.json();
        if (data.status === 'success') {
          setStatus('success');
          clearInterval(interval);
        }
      } catch (e) {
        console.log('poll error', e);
      }
    }, 3000);
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Subscribe</Text>
      <Text>Test UserId (DB id):</Text>
      <TextInput value={userId} onChangeText={setUserId} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <Text>Plan:</Text>
      <TextInput value={plan} onChangeText={setPlan} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <Text>Amount (UGX):</Text>
      <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <Button title="Start Payment" onPress={initiate} />
      <Text style={{ marginTop: 12 }}>Status: {status}</Text>
      <Text>Reference: {reference}</Text>
    </View>
  );
}
