import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type Role = 'buyer' | 'seller' | 'admin';

const styles: { [key: string]: React.CSSProperties } = {
  topNav: {
    display: 'none',
    background: '#22160B',
    padding: '14px 24px',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: "'Manrope', sans-serif",
  },
  topNavInner: { maxWidth: 1100, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#F6F0E1', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' },
  topLinks: { display: 'flex', gap: 28 },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    borderTop: '1px solid rgba(34,22,11,0.1)',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '8px 0 10px',
    zIndex: 50,
    fontFamily: "'Manrope', sans-serif",
  },
  bottomItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none', fontSize: 10, fontWeight: 700 },
  spacer: { height: 64 },
};

function topLinkStyle(active: boolean): React.CSSProperties {
  return {
    color: active ? '#D6A419' : 'rgba(246,240,225,0.7)',
    fontSize: 13,
    fontWeight: 700,
    textDecoration: 'none',
  };
}

function bottomIconStyle(active: boolean): React.CSSProperties {
  return {
    color: active ? '#D6A419' : 'rgba(34,22,11,0.45)',
  };
}

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/explore', label: 'Explore', icon: '🔍' },
  { path: '/sell', label: 'Sell', icon: '➕' },
  { path: '/messages', label: 'Messages', icon: '💬' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function Nav({ role }: { role: Role }) {
  const location = useLocation();

  if (role === 'admin') return null;

  return (
    <>
      <nav style={{ ...styles.topNav, display: window.innerWidth >= 768 ? 'flex' : 'none' }}>
        <div style={styles.topNavInner}>
          <span style={styles.logo}>ZHOPY</span>
          <div style={styles.topLinks}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} to={item.path} style={topLinkStyle(location.pathname === item.path)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div style={styles.spacer} className="zhopy-bottom-spacer" />

      <nav style={styles.bottomNav} className="zhopy-bottom-nav">
        {NAV_ITEMS.map((item) => (
          <Link key={item.path} to={item.path} style={styles.bottomItem}>
            <span style={{ fontSize: 18, ...bottomIconStyle(location.pathname === item.path) }}>{item.icon}</span>
            <span style={bottomIconStyle(location.pathname === item.path)}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .zhopy-bottom-nav { display: none !important; }
          .zhopy-bottom-spacer { display: none !important; }
        }
      `}</style>
    </>
  );
  }
