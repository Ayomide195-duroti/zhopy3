import React, { useState } from 'react';

type Role = 'buyer' | 'seller' | 'admin';
type Mode = 'login' | 'signup';

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px' },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 },
  tagline: { fontSize: 13, color: 'rgba(34,22,11,0.55)', marginBottom: 32 },
  card: { width: '100%', maxWidth: 380, background: '#fff', borderRadius: 10, border: '1px solid rgba(34,22,11,0.1)', padding: 24 },
  stepLabel: { fontSize: 11, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', color: 'rgba(34,22,11,0.45)', marginBottom: 14 },
  roleGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  roleBtn: (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', borderRadius: 8, cursor: 'pointer',
    border: active ? '2px solid #22160B' : '1px solid rgba(34,22,11,0.15)',
    background: active ? '#22160B' : '#fff',
    color: active ? '#F6F0E1' : '#22160B',
  }),
  roleTitle: { fontSize: 14, fontWeight: 700 },
  roleDesc: { fontSize: 11, marginTop: 2, opacity: 0.65 },
  formTitle: { fontSize: 17, fontWeight: 800, marginBottom: 4 },
  formSub: { fontSize: 12, color: 'rgba(34,22,11,0.5)', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '11px 14px', borderRadius: 7, border: '1px solid rgba(34,22,11,0.18)', fontSize: 14, marginBottom: 14, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1' },
  submitBtn: { width: '100%', background: '#22160B', color: '#F6F0E1', fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer', marginTop: 6 },
  backLink: { fontSize: 12, color: 'rgba(34,22,11,0.55)', marginTop: 14, textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' },
  switchRow: { fontSize: 12, textAlign: 'center', marginTop: 18, color: 'rgba(34,22,11,0.6)' },
  switchLink: { fontWeight: 700, color: '#22160B', cursor: 'pointer', textDecoration: 'underline' },
  roleBadge: { display: 'inline-block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', background: '#D6A419', color: '#22160B', padding: '3px 9px', borderRadius: 999, marginBottom: 16 },
};

const ROLES: { id: Role; title: string; desc: string }[] = [
  { id: 'buyer', title: 'Buyer', desc: 'Shop products from verified sellers' },
  { id: 'seller', title: 'Seller', desc: 'List and sell your own products' },
  { id: 'admin', title: 'Admin', desc: 'Manage sellers, products & orders' },
];

export default function Auth({ onComplete }: { onComplete: () => void }) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [mode, setMode] = useState<Mode>('signup');

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      <span style={styles.logo}>ZHOPY</span>
      <span style={styles.tagline}>Buy and sell with confidence.</span>

      <div style={styles.card}>
        {!selectedRole ? (
          <>
            <p style={styles.stepLabel}>Continue as</p>
            <div style={styles.roleGrid}>
              {ROLES.map((r) => (
                <div key={r.id} style={styles.roleBtn(false)} onClick={() => setSelectedRole(r.id)}>
                  <div>
                    <div style={styles.roleTitle}>{r.title}</div>
                    <div style={styles.roleDesc}>{r.desc}</div>
                  </div>
                  <span>→</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <span style={styles.roleBadge}>{selectedRole}</span>
            <p style={styles.formTitle}>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</p>
            <p style={styles.formSub}>
              {mode === 'signup' ? 'Fill in your details to get started.' : 'Log in to continue to Zhopy.'}
            </p>

            {mode === 'signup' && (
              <>
                <label style={styles.label}>Full name</label>
                <input style={styles.input} placeholder="e.g. Ayomide Duroti" />
              </>
            )}

            <label style={styles.label}>Email</label>
            <input style={styles.input} placeholder="you@example.com" type="email" />

            <label style={styles.label}>Password</label>
            <input style={styles.input} placeholder="••••••••" type="password" />

            <button style={styles.submitBtn} onClick={onComplete}>
              {mode === 'signup' ? `Create ${selectedRole} account` : 'Log in'}
            </button>

            <p style={styles.switchRow}>
              {mode === 'signup' ? (
                <>Already have an account? <span style={styles.switchLink} onClick={() => setMode('login')}>Log in</span></>
              ) : (
                <>New to Zhopy? <span style={styles.switchLink} onClick={() => setMode('signup')}>Sign up</span></>
              )}
            </p>

            <p style={styles.backLink} onClick={() => setSelectedRole(null)}>← Choose a different role</p>
          </>
        )}
      </div>
    </div>
  );
}
