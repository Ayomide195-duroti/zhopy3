import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' },
  card: { maxWidth: 340, textAlign: 'center' },
  icon: { fontSize: 36, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: 800, marginBottom: 6 },
  sub: { fontSize: 13, color: 'rgba(34,22,11,0.55)' },
};

export default function Messages() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>💬</div>
        <p style={styles.title}>Messages coming soon</p>
        <p style={styles.sub}>Buyer-to-seller chat is on the way. For now, use the contact details on a seller's listing.</p>
      </div>
    </div>
  );
}
