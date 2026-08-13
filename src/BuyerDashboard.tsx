import React, { useState } from 'react';
import ReportModal from './ReportModal';

type Order = { id: number; product: string; seller: string; price: number; date: string; status: 'delivered' | 'pending' };
type Product = { id: number; name: string; price: number; seller: string; rating: number; img: string };

const CATEGORIES = ['All', 'Phones', 'Fashion', 'Home & Living', 'Electronics', 'Beauty', 'Groceries'];
const PRODUCTS: Product[] = [];
const SAMPLE_ORDERS: Order[] = [];
const PRESET_AMOUNTS = [1000, 5000, 10000, 25000];

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B' },
  header: { background: '#22160B', padding: '14px 16px' },
  headerRow: { maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: { color: '#F6F0E1', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' },
  roleTag: { background: '#D6A419', color: '#22160B', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 14 },
  miniWallet: { fontSize: 12, fontWeight: 700, color: '#F6F0E1' },
  signOutBtn: { fontSize: 11, fontWeight: 600, color: 'rgba(246,240,225,0.6)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  tabRow: { display: 'flex', maxWidth: 900, margin: '0 auto', padding: '0 16px' },
  tabBtn: (active: boolean): React.CSSProperties => ({
    flex: 1, textAlign: 'center', padding: '12px 0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
    background: 'transparent', border: 'none',
    color: active ? '#22160B' : 'rgba(34,22,11,0.4)',
    borderBottom: active ? '2px solid #D6A419' : '2px solid transparent',
  }),
  main: { maxWidth: 900, margin: '0 auto', padding: '20px 16px 48px' },
  catStrip: { display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 },
  card: { background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(34,22,11,0.1)' },
  imgWrap: { aspectRatio: '1/1', background: 'rgba(34,22,11,0.05)', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  cardBody: { padding: '10px 12px 12px' },
  sellerTag: { fontSize: 10, fontWeight: 600, letterSpacing: '0.3px', color: 'rgba(34,22,11,0.42)', marginBottom: 4, textTransform: 'uppercase' },
  prodName: { fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 },
  priceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontWeight: 800, fontSize: 14 },
  addBtn: { background: '#22160B', color: '#F6F0E1', fontSize: 11, fontWeight: 700, padding: '7px 13px', borderRadius: 5, border: 'none', cursor: 'pointer' },
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
  sectionHeadRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reportLink: { fontSize: 12, fontWeight: 700, color: '#B23A2F', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
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

function catBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 16px', borderRadius: 5, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
    border: active ? 'none' : '1px solid rgba(34,22,11,0.15)',
    background: active ? '#22160B' : '#fff',
    color: active ? '#F6F0E1' : 'rgba(34,22,11,0.65)',
    cursor: 'pointer',
  };
}

export default function BuyerDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<'shop' | 'wallet'>('shop');
  const [activeCat, setActiveCat] = useState('All');
  const [balance, setBalance] = useState(45250);
  const [orders] = useState<Order[]>(SAMPLE_ORDERS);
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReport, setShowReport] = useState(false);

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
          <div style={styles.headerLeft}>
            <span style={styles.logo}>ZHOPY</span>
            <span style={styles.roleTag}>Buyer</span>
          </div>
          <div style={styles.headerRight}>
            <span style={styles.miniWallet}>₦{balance.toLocaleString()}</span>
            <button style={styles.signOutBtn} onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </header>

      <div style={styles.tabRow}>
        <button style={styles.tabBtn(tab === 'shop')} onClick={() => setTab('shop')}>Shop</button>
        <button style={styles.tabBtn(tab === 'wallet')} onClick={() => setTab('wallet')}>Wallet</button>
      </div>

      <main style={styles.main}>
        {tab === 'shop' && (
          <>
            <div style={styles.catStrip}>
              {CATEGORIES.map((cat) => (
                <button key={cat} style={catBtnStyle(activeCat === cat)} onClick={() => setActiveCat(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            {PRODUCTS.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No products yet. Once sellers start posting, their products will show up here.</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {PRODUCTS.map((p) => (
                  <div key={p.id} style={styles.card}>
                    <div style={styles.imgWrap}>
                      <img src={p.img} alt={p.name} style={styles.img} />
                    </div>
                    <div style={styles.cardBody}>
                      <p style={styles.sellerTag}>{p.seller}</p>
                      <p style={styles.prodName}>{p.name}</p>
                      <div style={styles.priceRow}>
                        <span style={styles.price}>₦{p.price.toLocaleString()}</span>
                        <button style={styles.addBtn}>Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'wallet' && (
          <>
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

            <div style={styles.sectionHeadRow}>
              <p style={{ ...styles.sectionTitle, marginBottom: 0 }}>Order History</p>
              <button style={styles.reportLink} onClick={() => setShowReport(true)}>Report an issue</button>
            </div>

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
          </>
        )}
      </main>

      {showReport && (
        <ReportModal subjectLabel="General issue" onClose={() => setShowReport(false)} />
      )}
    </div>
  );
    }
