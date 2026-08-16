import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

type Role = 'buyer' | 'seller' | 'admin';
type View = 'login' | 'signup' | 'admin' | 'chooseRole' | 'pickRole';

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
  googleBtn: { width: '100%', background: '#fff', color: '#22160B', fontSize: 13, fontWeight: 700, padding: '11px', borderRadius: 8, border: '1px solid rgba(34,22,11,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 },
  dividerRow: { display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 16px' },
  dividerLine: { flex: 1, height: 1, background: 'rgba(34,22,11,0.15)' },
  dividerText: { fontSize: 11, color: 'rgba(34,22,11,0.4)', fontWeight: 600 },
  roleChoiceBtn: { width: '100%', textAlign: 'left', padding: '16px', borderRadius: 8, border: '1.5px solid rgba(34,22,11,0.18)', background: '#fff', cursor: 'pointer', marginBottom: 12, fontSize: 14, fontWeight: 700 },
  roleChoiceSub: { fontSize: 12, fontWeight: 400, color: 'rgba(34,22,11,0.5)', marginTop: 2 },
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

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 7.1 29.6 5 24 5c-7.6 0-14.1 4.3-17.7 10.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5c-2 1.5-4.6 2.4-7.6 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.8 39.6 16.4 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C40.7 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
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
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  function rolesFromDoc(data: any): Role[] {
    if (Array.isArray(data?.roles) && data.roles.length > 0) return data.roles;
    if (data?.role) return [data.role];
    return ['buyer'];
  }

  async function handleGoogleAuth() {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const uid = cred.user.uid;
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const roles = rolesFromDoc(snap.data());
        if (roles.length > 1) {
          setAvailableRoles(roles);
          setView('pickRole');
        } else {
          onComplete(roles[0]);
        }
      } else {
        setView('chooseRole');
      }
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function finishGoogleRoleChoice(role: Role) {
    setLoading(true);
    try {
      const uid = auth.currentUser!.uid;
      await setDoc(doc(db, 'users', uid), {
        name: auth.currentUser?.displayName || 'Zhopy user',
        email: auth.currentUser?.email || '',
        roles: [role],
        createdAt: new Date().toISOString(),
      });
      onComplete(role);
    } catch (err: any) {
      setError('Something went wrong finishing sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  }

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
      const roles = snap.exists() ? rolesFromDoc(snap.data()) : ['buyer'] as Role[];
      if (roles.length > 1) {
        setAvailableRoles(roles);
        setView('pickRole');
      } else {
        onComplete(roles[0]);
      }
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
        roles: [signupRole],
        createdAt: new Date().toISOString(),
      });
      onComplete(signupRole);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          const ref = doc(db, 'users', cred.user.uid);
          const snap = await getDoc(ref);
          const existingRoles = snap.exists() ? rolesFromDoc(snap.data()) : [];
          if (existingRoles.includes(signupRole)) {
            setError(`You already have a ${signupRole} account with this email. Please log in instead.`);
          } else {
            const updatedRoles = [...existingRoles, signupRole];
            await setDoc(ref, { roles: updatedRoles }, { merge: true });
            onComplete(signupRole);
          }
        } catch {
          setError('This email is already registered. Enter the matching password to add a new role, or log in instead.');
        }
      } else {
        setError(err.message?.replace('Firebase: ', '') || 'Sign up failed. Please try again.');
      }
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

            <button style={styles.googleBtn} onClick={handleGoogleAuth} disabled={loading} type="button">
              <GoogleIcon /> Continue with Google
            </button>
            <div style={styles.dividerRow}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>OR</span>
              <div style={styles.dividerLine} />
            </div>

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

            <button style={styles.googleBtn} onClick={handleGoogleAuth} disabled={loading} type="button">
              <GoogleIcon /> Continue with Google
            </button>
            <div style={styles.dividerRow}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>OR</span>
              <div style={styles.dividerLine} />
            </div>

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

        {view === 'chooseRole' && (
          <>
            <p style={styles.formTitle}>Almost done</p>
            <p style={styles.formSub}>How do you want to use Zhopy?</p>

            {error && <p style={styles.errorText}>{error}</p>}

            <button
              style={styles.roleChoiceBtn}
              onClick={() => finishGoogleRoleChoice('buyer')}
              disabled={loading}
              type="button"
            >
              Buyer
              <div style={styles.roleChoiceSub}>Shop products from sellers</div>
            </button>
            <button
              style={styles.roleChoiceBtn}
              onClick={() => finishGoogleRoleChoice('seller')}
              disabled={loading}
              type="button"
            >
              Seller
              <div style={styles.roleChoiceSub}>List and sell your products</div>
            </button>
          </>
        )}

        {view === 'pickRole' && (
          <>
            <p style={styles.formTitle}>Welcome back</p>
            <p style={styles.formSub}>This email has more than one account type. Which one do you want to use?</p>

            {error && <p style={styles.errorText}>{error}</p>}

            {availableRoles.map((r) => (
              <button
                key={r}
                style={styles.roleChoiceBtn}
                onClick={() => onComplete(r)}
                type="button"
              >
                {r === 'buyer' ? 'Buyer' : 'Seller'}
                <div style={styles.roleChoiceSub}>
                  {r === 'buyer' ? 'Shop products from sellers' : 'List and sell your products'}
                </div>
              </button>
            ))}
          </>
        )}
      </div>

      {(view === 'login' || view === 'signup') && (
        <span style={styles.adminLink} onClick={() => { setView('admin'); setError(''); }}>·</span>
      )}
    </div>
  );
      }
