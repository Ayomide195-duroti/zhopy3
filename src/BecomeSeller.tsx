import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
  card: { maxWidth: 380, textAlign: 'center', background: '#fff', borderRadius: 12, border: '1px solid rgba(34,22,11,0.1)', padding: 32 },
  icon: { fontSize: 36, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 800, marginBottom: 8 },
  sub: { fontSize: 13, color: 'rgba(34,22,11,0.6)', marginBottom: 24, lineHeight: 1.5 },
  btn: { background: '#D6A419', color: '#22160B', fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  errorText: { fontSize: 12, color: '#B23A2F', marginTop: 12, fontWeight: 600 },
};

export default function BecomeSeller({ onBecomeSeller }: { onBecomeSeller: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpgrade() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setLoading(true);
    setError('');
    try {
      await updateDoc(doc(db, 'users', uid), { role: 'seller' });
      onBecomeSeller();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>🛍️</div>
        <p style={styles.title}>Become a Seller</p>
        <p style={styles.sub}>
          Start listing your own products on Zhopy and reach buyers across Nigeria. It only takes a minute to switch.
        </p>
        <button
          style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
          onClick={handleUpgrade}
          disabled={loading}
        >
          {loading ? 'Switching...' : 'Start Selling'}
        </button>
        {error && <p style={styles.errorText}>{error}</p>}
      </div>
    </div>
  );
}
