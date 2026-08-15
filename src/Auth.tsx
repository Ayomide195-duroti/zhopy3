import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

type Role = 'buyer' | 'seller' | 'admin';
type View = 'login' | 'signup' | 'admin';

const ADMIN_CODE = 'zhopy-admin-2026';

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px' },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 },
  tagline: { fontSize: 13, color: 'rgba(34,22,11,0.55)', marginBottom: 32 },
  card: { width: '100%', maxWidth: 380, background: '#fff', borderRadius: 10, border: '1px solid rgba(34,22,11,0.1)', padding: 24 },
  formTitle: { fontSize: 17, fontWeight: 800, marginBottom: 4 },
  formSub: { fontSize: 12, color: 'rgba(34,22,11,0.5)', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '11px 14px', borderRadius: 7, border: '1px solid rgba(34,22,11,0.18)', fontSize: 14, marginBottom: 14, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1' },
  roleRow: { display: 'flex', gap: 8, marginBottom: 14 },
  submitBtn: { width: '100%', background: '#22160B', color: '#F6F0E1', fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer', marginTop: 6 },
  submitBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  switchRow: { fontSize: 12, textAlign: 'center', marginTop: 18, color: 'rgba(34,22,11,0.6)' },
  switchLink: { fontWeight: 700, color: '#22160B', cursor: 'pointer', textDecoration: 'underline' },
  errorText: { fontSize: 12, color: '#B23A2F', marginBottom: 12, fontWeight: 600 },
  adminLink: { fontSize: 10, color: 'rgba(34,22,11,0.25)', marginTop: 28, cursor: 'pointer' },
  backLink: { fontSize: 12, color: 'rgba(34,22,11,0.55)', marginTop: 14, textAlign: 'center', cursor: 'pointer', textDecoration: 'underline' },
};

function roleBtnStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    textAlign: 'center',
    padding: '11px 0',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    border: active ? '2px solid #22160B' : '1px solid rgba(34,22,11,0.18)',
    background: active ? '#22160B' : '#fff',
    color: active ? '#F6F0E1' : '#22160B',
  };
}

export default function Auth({ onComplete }: { onComplete: (role: Role) => void }) {
  const [view, setView] = useState<View>('login');
  const [signupRole, setSignupRole] = useState<Role>('buyer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      const role = (snap.exists() ? snap.data().role : 'buyer') as Role;
      onComplete(role);
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: fullName || 'Zhopy user',
        email,
        role: signupRole,
        createdAt: new Date().toISOString(),
      });
      onComplete(signupRole);
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminLogin() {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    if (adminCode !== ADMIN_CODE) {
      setError('Incorrect admin access code.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onComplete('admin');
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      <span style={styles.logo}>ZHOPY</span>
      <span style={styles.tagline}>Buy and sell with confidence.</span>

      <div style={styles.card}>
        {view === 'login' && (
          <>
            <p style={styles.formTitle}>Welcome back</p>
            <p style={styles.formSub}>Log in to continue to Zhopy.</p>

            {error && <p style={styles.errorText}>{error}</p>}

            <label style={styles.label}>Email</label>
            <input style={styles.input} placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label style={styles.label}>Password</label>
            <input style={styles.input} placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button
              style={loading ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Log in'}
            </button>

            <p style={styles.switchRow}>
              New to Zhopy? <span style={styles.switchLink} onClick={() => { setView('signup'); setError(''); }}>Sign up</span>
            </p>
          </>
        )}

        {view === 'signup' && (
          <>
            <p style={styles.formTitle}>Create your account</p>
            <p style={styles.formSub}>Choose how you want to use Zhopy.</p>

            {error && <p style={styles.errorText}>{error}</p>}

            <div style={styles.roleRow}>
              <div style={roleBtnStyle(signupRole === 'buyer')} onClick={() => setSignupRole('buyer')}>Buyer</div>
              <div style={roleBtnStyle(signupRole === 'seller')} onClick={() => setSignupRole('seller')}>Seller</div>
            </div>

            <label style={styles.label}>Full name</label>
            <input style={styles.input} placeholder="e.g. Ayomide Duroti" value={fullName} onChange={(e) => setFullName(e.target.value)} />

            <label style={styles.label}>Email</label>
            <input style={styles.input} placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label style={styles.label}>Password</label>
            <input style={styles.input} placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <button
              style={loading ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? 'Please wait...' : `Create ${signupRole} account`}
            </button>

            <p style={styles.switchRow}>
              Already have an account? <span style={styles.switchLink} onClick={() => { setView('login'); setError(''); }}>Log in</span>
            </p>
          </>
        )}

        {view === 'admin' && (
          <>
            <p style={styles.formTitle}>Admin access</p>
            <p style={styles.formSub}>Enter your details and the admin access code.</p>

            {error && <p style={styles.errorText}>{error}</p>}

            <label style={styles.label}>Email</label>
            <input style={styles.input} placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label style={styles.label}>Password</label>
            <input style={styles.input} placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <label style={styles.label}>Admin access code</label>
            <input style={styles.input} placeholder="Enter admin code" type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />

            <button
              style={loading ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
              onClick={handleAdminLogin}
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Enter Admin Dashboard'}
            </button>

            <p style={styles.backLink} onClick={() => { setView('login'); setError(''); setAdminCode(''); }}>← Back to login</p>
          </>
        )}
      </div>

      {view !== 'admin' && (
        <span style={styles.adminLink} onClick={() => { setView('admin'); setError(''); }}>·</span>
      )}
    </div>
  );
            }
