import React, { useState } from 'react';
import Auth from './Auth';
import Home from './Home';
import SellerDashboard from './SellerDashboard';

type Role = 'buyer' | 'seller' | 'admin';

export default function App() {
  const [role, setRole] = useState<Role | null>(null);

  function handleSignOut() {
    setRole(null);
  }

  if (!role) {
    return <Auth onComplete={(r) => setRole(r)} />;
  }

  if (role === 'seller') {
    return <SellerDashboard onSignOut={handleSignOut} />;
  }

  // buyer and admin both land on Home for now
  return <Home onSignOut={handleSignOut} />;
  }
