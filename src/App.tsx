import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Auth from './Auth';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';
import AdminDashboard from './AdminDashboard';
import Nav from './Nav';
import BecomeSeller from './BecomeSeller';
import Messages from './Messages';
import Profile from './Profile';
import Explore from './Explore';

type Role = 'buyer' | 'seller' | 'admin';

const loadingStyle: React.CSSProperties = {
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
    let settled = false;
    const timeoutId = setTimeout(() => {
      if (!settled) setCheckingSession(false);
    }, 20000);

    let unsub = () => {};
    try {
      unsub = onAuthStateChanged(
        auth,
        async (user) => {
          settled = true;
          clearTimeout(timeoutId);
          try {
            if (user) {
              const snap = await getDoc(doc(db, 'users', user.uid));
              if (snap.exists()) {
                const data = snap.data();
                const roles: Role[] = Array.isArray(data.roles) && data.roles.length > 0
                  ? data.roles
                  : data.role
                  ? [data.role]
                  : [];
                setRole(roles.length > 0 ? roles[0] : null);
              } else {
                setRole(null);
              }
            } else {
              setRole(null);
            }
          } catch {
            setRole(null);
          } finally {
            setCheckingSession(false);
          }
        },
        () => {
          settled = true;
          clearTimeout(timeoutId);
          setCheckingSession(false);
        }
      );
    } catch {
      settled = true;
      clearTimeout(timeoutId);
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
    return <div style={loadingStyle}>Loading Zhopy...</div>;
  }

  if (!role) {
    return <Auth onComplete={(r) => setRole(r)} />;
  }

  if (role === 'admin') {
    return <AdminDashboard onSignOut={handleSignOut} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={role === 'seller' ? <SellerDashboard onSignOut={handleSignOut} /> : <BuyerDashboard onSignOut={handleSignOut} />}
        />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/sell"
          element={role === 'seller' ? <SellerDashboard onSignOut={handleSignOut} /> : <BecomeSeller onBecomeSeller={() => setRole('seller')} />}
        />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile role={role} onSignOut={handleSignOut} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Nav role={role} />
    </BrowserRouter>
  );
        }
