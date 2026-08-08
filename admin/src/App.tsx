import React, { useState } from 'react';
import PaymentsDashboard from './pages/PaymentsDashboard';

export default function App() {
  const [token, setToken] = useState('');

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1>Jaro Admin</h1>
      <div style={{ marginBottom: 12 }}>
        <label>Admin JWT Token: </label>
        <input style={{ width: '80%' }} value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste admin JWT here" />
      </div>
      <PaymentsDashboard token={token} />
    </div>
  );
}
