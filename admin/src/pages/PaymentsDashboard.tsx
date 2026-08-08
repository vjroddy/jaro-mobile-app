import React, { useEffect, useState } from 'react';

export default function PaymentsDashboard({ token }: { token: string }) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetchPayments();
  }, [token]);

  async function fetchPayments() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/payments', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch payments');
      const data = await res.json();
      setPayments(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function rollback(reference: string) {
    if (!confirm(`Rollback activation for ${reference}?`)) return;
    try {
      const res = await fetch('http://localhost:4000/payments/rollback', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ reference }) });
      if (!res.ok) throw new Error('Rollback failed');
      alert('Rolled back');
      fetchPayments();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div>
      <h2>Payments</h2>
      {error ? <div style={{ color: 'red' }}>{error}</div> : null}
      {loading ? <div>Loading...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Reference</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>UserId</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Amount</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>CreatedAt</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.reference}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{p.reference}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{p.userId}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{p.amount}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{p.status}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{new Date(p.createdAt).toLocaleString()}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  <button onClick={() => rollback(p.reference)}>Rollback</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
