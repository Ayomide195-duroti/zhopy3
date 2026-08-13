import React, { useState } from 'react';

type Tab = 'sellers' | 'products' | 'reports';

type PendingSeller = { id: number; name: string; business: string; date: string };
type AdminProduct = { id: number; name: string; seller: string; price: number; category: string };
type Report = { id: number; product: string; reporter: string; reason: string; status: 'open' | 'resolved' };

const SAMPLE_SELLERS: PendingSeller[] = [
  { id: 1, name: 'Adaeze Okoro', business: 'Adaeze Styles', date: 'Aug 12, 2026' },
  { id: 2, name: 'Chidi Nwosu', business: 'TechHub Lagos', date: 'Aug 11, 2026' },
];

const SAMPLE_PRODUCTS: AdminProduct[] = [
  { id: 1, name: 'Wireless Earbuds Pro', seller: 'TechHub Lagos', price: 18500, category: 'Electronics' },
  { id: 2, name: 'Ankara Print Dress', seller: 'Adaeze Styles', price: 12000, category: 'Fashion' },
];

const SAMPLE_REPORTS: Report[] = [
  { id: 1, product: 'Wireless Earbuds Pro', reporter: 'buyer_tunde', reason: 'Item not as described', status: 'open' },
  { id: 2, product: 'Ankara Print Dress', reporter: 'buyer_amaka', reason: 'Seller unresponsive after payment', status: 'open' },
];

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B' },
  header: { background: '#22160B', padding: '18px 16px' },
  headerRow: { maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#F6F0E1', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' },
  roleTag: { background: '#D6A419', color: '#22160B', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999 },
  signOutBtn: { fontSize: 11, fontWeight: 600, color: 'rgba(246,240,225,0.6)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  main: { maxWidth: 900, margin: '0 auto', padding: '24px 16px 48px' },
  pageTitle: { fontSize: 18, fontWeight: 800, marginBottom: 4 },
  pageSub: { fontSize: 13, color: 'rgba(34,22,11,0.55)', marginBottom: 20 },
  tabRow: { display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' },
  countBadge: { background: 'rgba(34,22,11,0.12)', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 7px', marginLeft: 6 },
  countBadgeActive: { background: 'rgba(246,240,225,0.25)', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '1px 7px', marginLeft: 6 },
  row: { background: '#fff', borderRadius: 8, border: '1px solid rgba(34,22,11,0.1)', padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  rowTitle: { fontSize: 13, fontWeight: 700, marginBottom: 2 },
  rowMeta: { fontSize: 11, color: 'rgba(34,22,11,0.5)' },
  btnGroup: { display: 'flex', gap: 6, flexShrink: 0 },
  approveBtn: { background: '#22160B', color: '#F6F0E1', fontSize: 11, fontWeight: 700, padding: '7px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' },
  rejectBtn: { background: 'transparent', color: '#B23A2F', fontSize: 11, fontWeight: 700, padding: '7px 12px', borderRadius: 6, border: '1px solid #B23A2F', cursor: 'pointer' },
  removeBtn: { background: 'transparent', color: '#B23A2F', fontSize: 11, fontWeight: 700, padding: '7px 12px', borderRadius: 6, border: '1px solid #B23A2F', cursor: 'pointer' },
  statusBadge: (status: string): React.CSSProperties => ({
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '3px 9px', borderRadius: 999,
    background: status === 'open' ? '#B23A2F' : '#4A6B4D',
    color: '#F6F0E1',
  }),
  emptyState: { textAlign: 'center', padding: '32px 20px', border: '1px dashed rgba(34,22,11,0.2)', borderRadius: 8, background: '#fff' },
  emptyText: { fontSize: 13, color: 'rgba(34,22,11,0.55)' },
};

function tabBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 14px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    border: active ? 'none' : '1px solid rgba(34,22,11,0.15)',
    background: active ? '#22160B' : '#fff',
    color: active ? '#F6F0E1' : 'rgba(34,22,11,0.65)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  };
}

export default function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>('sellers');
  const [sellers, setSellers] = useState(SAMPLE_SELLERS);
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [reports, setReports] = useState(SAMPLE_REPORTS);

  function approveSeller(id: number) {
    setSellers(sellers.filter((s) => s.id !== id));
  }
  function rejectSeller(id: number) {
    setSellers(sellers.filter((s) => s.id !== id));
  }
  function removeProduct(id: number) {
    setProducts(products.filter((p) => p.id !== id));
  }
  function resolveReport(id: number) {
    setReports(reports.map((r) => (r.id === id ? { ...r, status: 'resolved' as const } : r)));
  }

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      <header style={styles.header}>
        <div style={styles.headerRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={styles.logo}>ZHOPY</span>
            <span style={styles.roleTag}>Admin</span>
          </div>
          <button style={styles.signOutBtn} onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <main style={styles.main}>
        <p style={styles.pageTitle}>Admin Dashboard</p>
        <p style={styles.pageSub}>Manage sellers, products, and reported issues.</p>

        <div style={styles.tabRow}>
          <button style={tabBtnStyle(tab === 'sellers')} onClick={() => setTab('sellers')}>
            Pending Sellers
            <span style={tab === 'sellers' ? styles.countBadgeActive : styles.countBadge}>{sellers.length}</span>
          </button>
          <button style={tabBtnStyle(tab === 'products')} onClick={() => setTab('products')}>
            Products
            <span style={tab === 'products' ? styles.countBadgeActive : styles.countBadge}>{products.length}</span>
          </button>
          <button style={tabBtnStyle(tab === 'reports')} onClick={() => setTab('reports')}>
            Reported Issues
            <span style={tab === 'reports' ? styles.countBadgeActive : styles.countBadge}>
              {reports.filter((r) => r.status === 'open').length}
            </span>
          </button>
        </div>

        {tab === 'sellers' && (
          sellers.length === 0 ? (
            <div style={styles.emptyState}><p style={styles.emptyText}>No pending sellers right now.</p></div>
          ) : (
            sellers.map((s) => (
              <div key={s.id} style={styles.row}>
                <div>
                  <p style={styles.rowTitle}>{s.name}</p>
                  <p style={styles.rowMeta}>{s.business} · Applied {s.date}</p>
                </div>
                <div style={styles.btnGroup}>
                  <button style={styles.approveBtn} onClick={() => approveSeller(s.id)}>Approve</button>
                  <button style={styles.rejectBtn} onClick={() => rejectSeller(s.id)}>Reject</button>
                </div>
              </div>
            ))
          )
        )}

        {tab === 'products' && (
          products.length === 0 ? (
            <div style={styles.emptyState}><p style={styles.emptyText}>No products listed yet.</p></div>
          ) : (
            products.map((p) => (
              <div key={p.id} style={styles.row}>
                <div>
                  <p style={styles.rowTitle}>{p.name}</p>
                  <p style={styles.rowMeta}>{p.seller} · {p.category} · ₦{p.price.toLocaleString()}</p>
                </div>
                <div style={styles.btnGroup}>
                  <button style={styles.removeBtn} onClick={() => removeProduct(p.id)}>Remove</button>
                </div>
              </div>
            ))
          )
        )}

        {tab === 'reports' && (
          reports.length === 0 ? (
            <div style={styles.emptyState}><p style={styles.emptyText}>No reported issues.</p></div>
          ) : (
            reports.map((r) => (
              <div key={r.id} style={styles.row}>
                <div>
                  <p style={styles.rowTitle}>{r.product}</p>
                  <p style={styles.rowMeta}>Reported by {r.reporter} · {r.reason}</p>
                </div>
                <div style={styles.btnGroup}>
                  <span style={styles.statusBadge(r.status)}>{r.status}</span>
                  {r.status === 'open' && (
                    <button style={styles.approveBtn} onClick={() => resolveReport(r.id)}>Resolve</button>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </main>
    </div>
  );
               }
