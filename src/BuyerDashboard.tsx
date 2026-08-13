import React, { useState } from 'react';

type Order = { id: number; product: string; seller: string; price: number; date: string; status: 'delivered' | 'pending' };

const SAMPLE_ORDERS: Order[] = [];

const PRESET_AMOUNTS = [1000, 5000, 10000, 25000];

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B' },
  header: { background: '#22160B', padding: '18px 16px' },
  headerRow: { maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#F6F0E1', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' },
  roleTag: { background: '#D6A419', color: '#22160B', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999 },
  signOutBtn: { fontSize: 11, fontWeight: 600, color: 'rgba(246,240,225,0.6)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  main: { maxWidth: 700, margin: '0 auto', padding: '24px 16px 48px' },
  pageTitle: { fontSize: 18, fontWeight: 800, marginBottom: 4 },
  pageSub: { fontSize: 13, color: 'rgba(34,22,11,0.55)', marginBottom: 24 },
  walletCard: { background: '#22160B', borderRadius: 12, padding: '24px 20px', marginBottom: 24 },
  walletLabel: { fontSize: 11, color: 'rgba(246,240,225,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 6 },
  walletAmount: { fontSize: 28, fontWeight: 800, color: '#F6F0E1', marginBottom: 16 },
  topUpBtn: { background: '#D6A419', color: '#22160B', fontSize: 13, fontWeight: 700, padding: '11px 20px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  topUpForm: { background: 'rgba(246,240,225,0.08)', borderRadius: 8, padding: 16, marginTop: 16 },
  formLabel: { fontSize: 11, color: 'rgba(246,240,225,0.6)', fontWeight: 600, marginBottom: 8, display: 'block' },
  presetRow: { display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' as const },
  presetBtn: (active: boolean): React.CSSProperties => ({
    padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
    border: active ? 'none' : '1px solid rgba(246,240,225,0.3)',
    background: active ? '#D6A419' : 'transparent',
    color: active ? '#22160B' : '#F6F0E1',
  }),
  amountInput: { width: '100%', padding: '11px 14px', borderRadius: 7, border: 'none', fontSize: 14, marginBottom: 12, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1', color: '#22160B' },
  fundBtn: { width: '100%', background: '#D6A419', color: '#22160B', fontSize: 13, fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  cancelLink: { fontSize: 11, color: 'rgba(246,240,225,0.6)', textAlign: 'center', marginTop: 10, cursor: 'pointer', textDecoration: 'underline' },
  successBanner: { background: '#D6A419', color: '#22160B', padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 800, marginBottom: 12 },
  orderRow: { background: '#fff', borderRadius: 8, border: '1px solid rgba(34,22,11,0.1)', padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  orderName: { fontSize: 13, fontWeight: 700, marginBottom: 2 },
  orderMeta: { fontSize: 11, color: 'rgba(34,22,11,0.5)' },
  orderRight: { textAlign: 'right' as const },
  orderPrice: { fontSize: 13, fontWeight: 800, marginBottom: 3 },
  statusBadge: (status: string): React.CSSProperties => ({
    fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 999,
    background: status === 'delivered' ? '#4A6B4D' : '#D6A419',
    color: status === 'delivered' ? '#F6F0E1' : '#22160B',
  }),
  emptyState: { textAlign: 'center', padding: '32px 20px', border: '1px dashed rgba(34,22,11,0.2)', borderRadius: 8, background: '#fff' },
  emptyText: { fontSize: 13, color: 'rgba(34,22,11,0.55)' },
};

export default function BuyerDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [balance, setBalance] = useState(45250);
  const [orders] = useState<Order[]>(SAMPLE_ORDERS);
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  function handleFund() {
    const amount = selectedAmount ?? Number(customAmount);
    if (!amount || amount <= 0) return;
    setBalance(balance + amount);
    setShowTopUp(false);
    setSelectedAmount(null);
    setCustomAmount('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      <header style={styles.header}>
        <div style={styles.headerRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={styles.logo}>ZHOPY</span>
            <span style={styles.roleTag}>Buyer</span>
          </div>
          <button style={styles.signOutBtn} onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <main style={styles.main}>
        <p style={styles.pageTitle}>My Wallet</p>
        <p style={styles.pageSub}>Top up your balance and track your orders.</p>

        {showSuccess && <div style={styles.successBanner}>✓ Wallet funded successfully!</div>}

        <div style={styles.walletCard}>
          <p style={styles.walletLabel}>Available Balance</p>
          <p style={styles.walletAmount}>₦{balance.toLocaleString()}</p>

          {!showTopUp ? (
            <button style={styles.topUpBtn} onClick={() => setShowTopUp(true)}>+ Top Up Wallet</button>
          ) : (
            <div style={styles.topUpForm}>
              <label style={styles.formLabel}>Choose an amount</label>
              <div style={styles.presetRow}>
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    style={styles.presetBtn(selectedAmount === amt)}
                    onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <label style={styles.formLabel}>Or enter custom amount</label>
              <input
                style={styles.amountInput}
                type="number"
                placeholder="e.g. 15000"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
              />
              <button style={styles.fundBtn} onClick={handleFund}>Fund with Paystack</button>
              <p style={styles.cancelLink} onClick={() => setShowTopUp(false)}>Cancel</p>
            </div>
          )}
        </div>

        <p style={styles.sectionTitle}>Order History</p>
        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No orders yet. Start shopping to see your orders here.</p>
          </div>
        ) : (
          orders.map((o) => (
            <div key={o.id} style={styles.orderRow}>
              <div>
                <p style={styles.orderName}>{o.product}</p>
                <p style={styles.orderMeta}>{o.seller} · {o.date}</p>
              </div>
              <div style={styles.orderRight}>
                <p style={styles.orderPrice}>₦{o.price.toLocaleString()}</p>
                <span style={styles.statusBadge(o.status)}>{o.status}</span>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
            }
