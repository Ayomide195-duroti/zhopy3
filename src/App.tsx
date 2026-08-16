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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists() && snap.data().role) {
            setRole(snap.data().role as Role);
          } else {
            setRole(null);
          }
        } else {
          setRole(null);
        }
      } catch (err) {
        setRole(null);
      } finally {
        setCheckingSession(false);
      }
    });
    return () => unsub();
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    setRole(null);
  }

  if (checkingSession) {
    return <div style={styles}>Loading Zhopy...</div>;
  }

  if (!role) {
    return <Auth onComplete={(r) => setRole(r)} />;
  }

  if (role === 'seller') {
    return <SellerDashboard onSignOut={handleSignOut} />;
  }

  if (role === 'admin') {
    return <AdminDashboard onSignOut={handleSignOut} />;
  }

  return <BuyerDashboard onSignOut={handleSignOut} />;
}
