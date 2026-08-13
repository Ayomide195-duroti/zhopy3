import React, { useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string;
};

const CATEGORIES = ['Phones', 'Fashion', 'Home & Living', 'Electronics', 'Beauty', 'Groceries'];

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B' },
  header: { background: '#22160B', padding: '18px 16px' },
  headerRow: { maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#F6F0E1', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' },
  roleTag: { background: '#D6A419', color: '#22160B', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999 },
  signOutBtn: { fontSize: 11, fontWeight: 600, color: 'rgba(246,240,225,0.6)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  main: { maxWidth: 900, margin: '0 auto', padding: '24px 16px 48px' },
  pageTitle: { fontSize: 18, fontWeight: 800, marginBottom: 4 },
  pageSub: { fontSize: 13, color: 'rgba(34,22,11,0.55)', marginBottom: 24 },
  layout: { display: 'flex', flexDirection: 'column', gap: 24 },
  formCard: { background: '#fff', borderRadius: 10, border: '1px solid rgba(34,22,11,0.1)', padding: 20 },
  formTitle: { fontSize: 14, fontWeight: 800, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '11px 14px', borderRadius: 7, border: '1px solid rgba(34,22,11,0.18)', fontSize: 14, marginBottom: 14, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1' },
  textarea: { width: '100%', padding: '11px 14px', borderRadius: 7, border: '1px solid rgba(34,22,11,0.18)', fontSize: 14, marginBottom: 14, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1', minHeight: 80, resize: 'vertical' as const },
  select: { width: '100%', padding: '11px 14px', borderRadius: 7, border: '1px solid rgba(34,22,11,0.18)', fontSize: 14, marginBottom: 14, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1' },
  uploadBox: { border: '1.5px dashed rgba(34,22,11,0.25)', borderRadius: 8, padding: '24px 16px', textAlign: 'center', marginBottom: 14, background: '#F6F0E1' },
  uploadText: { fontSize: 12, color: 'rgba(34,22,11,0.5)', marginTop: 4 },
  submitBtn: { width: '100%', background: '#D6A419', color: '#22160B', fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  listSection: {},
  listTitle: { fontSize: 14, fontWeight: 800, marginBottom: 12 },
  productRow: { background: '#fff', borderRadius: 8, border: '1px solid rgba(34,22,11,0.1)', padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 13, fontWeight: 700, marginBottom: 2 },
  productMeta: { fontSize: 11, color: 'rgba(34,22,11,0.5)' },
  productPrice: { fontSize: 13, fontWeight: 800 },
  emptyState: { textAlign: 'center', padding: '32px 20px', border: '1px dashed rgba(34,22,11,0.2)', borderRadius: 8, background: '#fff' },
  emptyText: { fontSize: 13, color: 'rgba(34,22,11,0.55)' },
};

export default function SellerDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) return;
    setProducts([{ id: Date.now(), name, price, category, description }, ...products]);
    setName('');
    setPrice('');
    setDescription('');
  }

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      <header style={styles.header}>
        <div style={styles.headerRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={styles.logo}>ZHOPY</span>
            <span style={styles.roleTag}>Seller</span>
          </div>
          <button style={styles.signOutBtn} onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <main style={styles.main}>
        <p style={styles.pageTitle}>Seller Dashboard</p>
        <p style={styles.pageSub}>Post new products and manage your listings.</p>

        <div style={styles.layout}>
          <form style={styles.formCard} onSubmit={handlePost}>
            <p style={styles.formTitle}>Add a product</p>

            <div style={styles.uploadBox}>
              <div style={{ fontSize: 22 }}>📷</div>
              <p style={styles.uploadText}>Tap to upload a product photo</p>
            </div>

            <label style={styles.label}>Product name</label>
            <input
              style={styles.input}
              placeholder="e.g. Ankara Print Dress"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label style={styles.label}>Price (₦)</label>
            <input
              style={styles.input}
              placeholder="e.g. 12000"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label style={styles.label}>Category</label>
            <select style={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              placeholder="Describe the product, condition, sizing, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button style={styles.submitBtn} type="submit">Post product</button>
          </form>

          <div style={styles.listSection}>
            <p style={styles.listTitle}>Your listings ({products.length})</p>

            {products.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No products posted yet. Add your first one above.</p>
              </div>
            ) : (
              products.map((p) => (
                <div key={p.id} style={styles.productRow}>
                  <div>
                    <p style={styles.productName}>{p.name}</p>
                    <p style={styles.productMeta}>{p.category}</p>
                  </div>
                  <span style={styles.productPrice}>₦{Number(p.price).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
              }
