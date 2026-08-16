import React from 'react';
import { auth } from './firebase';

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B', padding: '32px 20px' },
  card: { maxWidth: 420, margin: '0 auto', background: '#fff', borderRadius: 12, border: '1px solid rgba(34,22,11,0.1)', padding: 24 },
  title: { fontSize: 18, fontWeight: 800, marginBottom: 20 },
  row: { marginBottom: 16 },
  label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', color: 'rgba(34,22,11,0.45)', marginBottom: 4 },
  value: { fontSize: 14, fontWeight: 600 },
  signOutBtn: { width: '100%', marginTop: 12, background: '#22160B', color: '#F6F0E1', fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer' },
};

export default function Profile({ role, onSignOut }: { role: string; onSignOut: () => void }) {
  const user = auth.currentUser;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.title}>Your Profile</p>

        <div style={styles.row}>
          <p style={styles.label}>Email</p>
          <p style={styles.value}>{user?.email || '—'}</p>
        </div>

        <div style={styles.row}>
          <p style={styles.label}>Account type</p>
          <p style={styles.value}>{role.charAt(0).toUpperCase() + role.slice(1)}</p>
        </div>

        <button style={styles.signOutBtn} onClick={onSignOut}>Sign out</button>
      </div>
    </div>
  );
}
