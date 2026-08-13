import React, { useState } from 'react';

const CATEGORIES = ['All', 'Phones', 'Fashion', 'Home & Living', 'Electronics', 'Beauty', 'Groceries'];

const PRODUCTS: {
  id: number;
  name: string;
  price: number;
  seller: string;
  rating: number;
  img: string;
}[] = [];

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B' },
  header: { position: 'sticky', top: 0, zIndex: 20, background: '#F6F0E1', borderBottom: '1px solid rgba(34,22,11,0.12)', padding: '14px 16px' },
  headerRow: { maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 },
  logo: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' },
  searchBox: { flex: 1, maxWidth: 400, margin: '0 16px', display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 6, padding: '9px 14px', border: '1px solid rgba(34,22,11,0.15)' },
  searchInput: { border: 'none', outline: 'none', background: 'transparent', fontSize: 14, width: '100%', color: '#22160B', fontFamily: "'Manrope', sans-serif" },
  rightGroup: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 },
  walletBadge: { display: 'flex', alignItems: 'center', gap: 8, background: '#22160B', color: '#F6F0E1', borderRadius: 6, padding: '6px 12px' },
  walletLabel: { fontSize: 10, opacity: 0.6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' },
  walletAmount: { fontSize: 13, fontWeight: 700 },
  cartWrap: { position: 'relative', fontSize: 19 },
  cartBadge: { position: 'absolute', top: -6, right: -8, background: '#D6A419', color: '#22160B', fontSize: 10, fontWeight: 800, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  catStrip: { maxWidth: 1100, margin: '0 auto', padding: '14px 16px', display: 'flex', gap: 8, overflowX: 'auto' },
  hero: { maxWidth: 1100, margin: '4px auto 28px', padding: '0 16px' },
  heroInner: { background: '#22160B', borderRadius: 10, padding: '36px 24px', position: 'relative', overflow: 'hidden' },
  heroBar: { width: 40, height: 4, background: '#D6A419', marginBottom: 16, borderRadius: 2 },
  heroText: { color: '#F6F0E1', fontSize: 22, fontWeight: 800, maxWidth: 340, lineHeight: 1.35, letterSpacing: '-0.3px' },
  heroSub: { color: 'rgba(246,240,225,0.6)', fontSize: 13, marginTop: 8, maxWidth: 320, lineHeight: 1.5 },
  heroBtn: { marginTop: 18, background: '#D6A419', color: '#22160B', fontSize: 13, fontWeight: 700, padding: '10px 22px', borderRadius: 6, border: 'none', cursor: 'pointer' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '0 16px 48px' },
  sectionHead: { display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 800, letterSpacing: '-0.2px' },
  sectionCount: { fontSize: 12, color: 'rgba(34,22,11,0.45)', fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 },
  card: { background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(34,22,11,0.1)' },
  imgWrap: { aspectRatio: '1/1', background: 'rgba(34,22,11,0.05)', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  cardBody: { padding: '10px 12px 12px' },
  sellerTag: { fontSize: 10, fontWeight: 600, letterSpacing: '0.3px', color: 'rgba(34,22,11,0.42)', marginBottom: 4, textTransform: 'uppercase' },
  prodName: { fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 6, letterSpacing: '-0.1px' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, fontSize: 11, color: 'rgba(34,22,11,0.55)' },
  priceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontWeight: 800, fontSize: 14, letterSpacing: '-0.2px' },
  addBtn: { background: '#22160B', color: '#F6F0E1', fontSize: 11, fontWeight: 700, padding: '7px 13px', borderRadius: 5, border: 'none', cursor: 'pointer' },
  emptyState: { textAlign: 'center', padding: '48px 20px', border: '1px dashed rgba(34,22,11,0.2)', borderRadius: 8, background: '#fff' },
  emptyTitle: { fontSize: 14, fontWeight: 700, marginBottom: 6 },
  emptyText: { fontSize: 13, color: 'rgba(34,22,11,0.55)' },
  signOutBtn: { fontSize: 11, fontWeight: 700, color: 'rgba(34,22,11,0.5)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
};

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

export default function Home({ onSignOut }: { onSignOut: () => void }) {
  const [activeCat, setActiveCat] = useState('All');
  const balance = 45250;

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      <header style={styles.header}>
        <div style={styles.headerRow}>
          <span style={styles.logo}>ZHOPY</span>
          <div style={styles.searchBox}>
            <span style={{ marginRight: 8, opacity: 0.4, fontSize: 13 }}>Search</span>
            <input style={styles.searchInput} placeholder="products, sellers..." />
          </div>
          <div style={styles.rightGroup}>
            <div style={styles.walletBadge}>
              <span style={styles.walletLabel}>Balance</span>
              <span style={styles.walletAmount}>₦{balance.toLocaleString()}</span>
            </div>
            <div style={styles.cartWrap}>
              🛒
              <span style={styles.cartBadge}>0</span>
            </div>
            <button style={styles.signOutBtn} onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </header>

      <div style={styles.catStrip}>
        {CATEGORIES.map((cat) => (
          <button key={cat} style={catBtnStyle(activeCat === cat)} onClick={() => setActiveCat(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroBar} />
          <p style={styles.heroText}>Buy and sell with confidence.</p>
          <p style={styles.heroSub}>Verified sellers, secure wallet payments, and products delivered across Nigeria.</p>
          <button style={styles.heroBtn}>Start Shopping</button>
        </div>
      </div>

      <main style={styles.main}>
        <div style={styles.sectionHead}>
          <span style={styles.sectionTitle}>Featured Products</span>
          <span style={styles.sectionCount}>{PRODUCTS.length} items</span>
        </div>

        {PRODUCTS.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>No products yet</p>
            <p style={styles.emptyText}>Once sellers start posting, their products will show up here.</p>
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
                  <div style={styles.ratingRow}>
                    <span style={{ color: '#D6A419' }}>★</span>
                    <span>{p.rating}</span>
                  </div>
                  <div style={styles.priceRow}>
                    <span style={styles.price}>₦{p.price.toLocaleString()}</span>
                    <button style={styles.addBtn}>Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
           }
