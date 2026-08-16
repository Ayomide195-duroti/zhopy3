import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Auth from './Auth';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';
import AdminDashboard from './AdminDashboard';

type Role = 'buyer' | 'seller' | 'admin';

const styles: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F6F0E1',
  color: '#22160B',
  fontFamily: "'Manrope', sans-serif",
  fontSize: 14,
};

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [debugMsg, setDebugMsg] = useState('');

  useEffect(() => {
    let settled = false;
    const startedAt = Date.now();

    const timeoutId = setTimeout(() => {
      if (!settled) {
        const secs = Math.round((Date.now() - startedAt) / 1000);
        setDebugMsg(`Timed out after ${secs}s waiting for Firebase to respond. Likely a slow/unstable connection, or an authDomain mismatch.`);
        setCheckingSession(false);
      }
    }, 20000);

    let unsub = () => {};
    try {
      unsub = onAuthStateChanged(
        auth,
        async (user) => {
          settled = true;
          clearTimeout(timeoutId);
          const secs = ((Date.now() - startedAt) / 1000).toFixed(1);
          try {
            if (user) {
              const snap = await getDoc(doc(db, 'users', user.uid));
              if (snap.exists() && snap.data().role) {
                setRole(snap.data().role as Role);
              } else {
                setRole(null);
              }
              setDebugMsg('Resolved in ' + secs + 's (logged in)');
            } else {
              setRole(null);
              setDebugMsg('Resolved in ' + secs + 's (no user)');
            }
          } catch (err: any) {
            setDebugMsg('Firestore lookup failed after ' + secs + 's: ' + (err?.message || String(err)));
            setRole(null);
          } finally {
            setCheckingSession(false);
          }
        },
        (err) => {
          settled = true;
          clearTimeout(timeoutId);
          setDebugMsg('Auth listener error: ' + (err?.message || String(err)));
          setCheckingSession(false);
        }
      );
    } catch (err: any) {
      settled = true;
      clearTimeout(timeoutId);
      setDebugMsg('Failed to start auth listener: ' + (err?.message || String(err)));
      setCheckingSession(false);
    }

    return () => {
      clearTimeout(timeoutId);
      unsub();
    };
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    setRole(null);
  }

  if (checkingSession) {
    return <div style={styles}>Loading Zhopy...</div>;
  }

  let screen: React.ReactNode;
  if (!role) {
    screen = <Auth onComplete={(r) => setRole(r)} />;
  } else if (role === 'seller') {
    screen = <SellerDashboard onSignOut={handleSignOut} />;
  } else if (role === 'admin') {
    screen = <AdminDashboard onSignOut={handleSignOut} />;
  } else {
    screen = <BuyerDashboard onSignOut={handleSignOut} />;
  }

  return (
    <>
      {screen}
      {debugMsg && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#B23A2F', color: '#fff', fontSize: 11, padding: 8, wordBreak: 'break-word', zIndex: 9999 }}>
          DEBUG: {debugMsg}
        </div>
      )}
    </>
  );
}
