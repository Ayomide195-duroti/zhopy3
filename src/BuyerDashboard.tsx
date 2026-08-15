import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import ReportModal from './ReportModal';

type Product = { id: string; name: string; price: string; category: string; sellerEmail: string; imageUrl?: string };

const CATEGORIES = ['All', 'Phones', 'Fashion', 'Home & Living', 'Electronics', 'Beauty', 'Groceries'];
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
  main: { maxWidth: 900, margin: '0 auto', padding: '20px 16px 48px' },
  catStrip: { display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 },
  card: { background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(34,22,11,0.1)' },
  imgWrap: { aspectRatio: '1/1', background: 'rgba(34,22,11,0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 },
  productImg: { width: '100%', height: '100%', objectFit: 'cover' as const },
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
  amountInput: { width: '100%', padding: '11px 14px', borderRadius: 7, border: 'none', fontSize: 14, marginBottom: 12, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1', color: '#22160B' },
  fundBtn: { width: '100%', background: '#D6A419', color: '#22160B', fontSize: 13, fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  fundBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  cancelLink: { fontSize: 11, color: 'rgba(246,240,225,0.6)', textAlign: 'center', marginTop: 10, cursor: 'pointer', textDecoration: 'underline' },
  successBanner: { background: '#D6A419', color: '#22160B', padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 800, marginBottom: 12 },
  sectionHeadRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reportLink: { fontSize: 12, fontWeight: 700, color: '#B23A2F', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  emptyState: { textAlign: 'center', padding: '32px 20px', border: '1px dashed rgba(34,22,11,0.2)', borderRadius: 8, background: '#fff' },
  emptyText: { fontSize: 13, color: 'rgba(34,22,11,0.55)' },
};

function tabBtnStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    textAlign: 'center',
    padding: '12px 0',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    color: active ? '#22160B' : 'rgba(34,22,11,0.4)',
    borderBottom: active ? '2px solid #D6A419' : '2px solid transparent',
  };
}

function catBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 16px',
    borderRadius: 5,
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    border: active ? 'none' : '1px solid rgba(34,22,11,0.15)',
    background: active ? '#22160B' : '#fff',
    color: active ? '#F6F0E1' : 'rgba(34,22,11,0.65)',
    cursor: 'pointer',
  };
}

function presetBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: '7px 14px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    border: active ? 'none' : '1px solid rgba(246,240,225,0.3)',
    background: active ? '#D6A419' : 'transparent',
    color: active ? '#22160B' : '#F6F0E1',
  };
}

export default function BuyerDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<'shop' | 'wallet'>('shop');
  const [activeCat, setActiveCat] = useState('All');
  const [balance, setBalance] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [funding, setFunding] = useState(false);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    async function loadBalance() {
      const ref = doc(db, 'users', uid!);
      const snap = await getDoc(ref);
      if (snap.exists() && typeof snap.data().balance === 'number') {
        setBalance(snap.data().balance);
      } else {
        await setDoc(ref, { balance: 0 }, { merge: true });
        setBalance(0);
      }
    }
    loadBalance();

    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Product[] = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        price: d.data().price,
        category: d.data().category,
        sellerEmail: d.data().sellerEmail || 'Zhopy seller',
        imageUrl: d.data().imageUrl,
      }));
      setProducts(list);
    });
    return () => unsub();
  }, []);

  const filteredProducts = activeCat === 'All' ? products : products.filter((p) => p.category === activeCat);

  async function handleFund() {
    const amount = selectedAmount ?? Number(customAmount);
    if (!amount || amount <= 0) return;
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setFunding(true);
    try {
      const newBalance = balance + amount;
      await updateDoc(doc(db, 'users', uid), { balance: newBalance });
      setBalance(newBalance);
      setShowTopUp(false);
      setSelectedAmount(null);
      setCustomAmount('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setFunding(false);
    }
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
        <button style={tabBtnStyle(tab === 'shop')} onClick={() => setTab('shop')}>Shop</button>
        <button style={tabBtnStyle(tab === 'wallet')} onClick={() => setTab('wallet')}>Wallet</button>
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

            {filteredProducts.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No products yet. Once sellers start posting, their products will show up here.</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {filteredProducts.map((p) => (
                  <div key={p.id} style={styles.card}>
                    <div style={styles.imgWrap}>
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={styles.productImg} /> : '📦'}
                    </div>
                    <div style={styles.cardBody}>
                      <p style={styles.sellerTag}>{p.sellerEmail}</p>
                      <p style={styles.prodName}>{p.name}</p>
                      <div style={styles.priceRow}>
                        <span style={styles.price}>₦{Number(p.price).toLocaleString()}</span>
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
                        style={presetBtnStyle(selectedAmount === amt)}
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
                  <button
                    style={funding ? { ...styles.fundBtn, ...styles.fundBtnDisabled } : styles.fundBtn}
                    onClick={handleFund}
                    disabled={funding}
                  >
                    {funding ? 'Processing...' : 'Fund with Paystack'}
                  </button>
                  <p style={styles.cancelLink} onClick={() => setShowTopUp(false)}>Cancel</p>
                </div>
              )}
            </div>

            <div style={styles.sectionHeadRow}>
              <p style={{ ...styles.sectionTitle, marginBottom: 0 }}>Order History</p>
              <button style={styles.reportLink} onClick={() => setShowReport(true)}>Report an issue</button>
            </div>

            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No orders yet. Start shopping to see your orders here.</p>
            </div>
          </>
        )}
      </main>

      {showReport && (
        <ReportModal subjectLabel="General issue" onClose={() => setShowReport(false)} />
      )}
    </div>
  );
    }
