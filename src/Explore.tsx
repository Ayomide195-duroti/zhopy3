import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import ProductCard, { Product } from './ProductCard';

const CATEGORIES = ['All', 'Phones', 'Fashion', 'Home & Living', 'Electronics', 'Beauty', 'Groceries'];
type SortOption = 'newest' | 'lowest' | 'highest';

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B' },
  header: { background: '#22160B', padding: '18px 16px' },
  headerInner: { maxWidth: 900, margin: '0 auto' },
  logo: { color: '#F6F0E1', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 12, display: 'block' },
  searchBox: { display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 8, padding: '10px 14px' },
  searchInput: { border: 'none', outline: 'none', background: 'transparent', fontSize: 14, width: '100%', fontFamily: "'Manrope', sans-serif" },
  main: { maxWidth: 900, margin: '0 auto', padding: '16px 16px 90px' },
  filterRow: { display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto' },
  filterPanel: { background: '#fff', borderRadius: 10, border: '1px solid rgba(34,22,11,0.1)', padding: 16, marginBottom: 16 },
  filterLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', color: 'rgba(34,22,11,0.5)', marginBottom: 8 },
  priceRow: { display: 'flex', gap: 8, marginBottom: 16 },
  priceInput: { flex: 1, padding: '9px 12px', borderRadius: 6, border: '1px solid rgba(34,22,11,0.18)', fontSize: 13, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1' },
  sortRow: { display: 'flex', gap: 8 },
  resultsCount: { fontSize: 12, color: 'rgba(34,22,11,0.5)', marginBottom: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 },
  emptyState: { textAlign: 'center', padding: '48px 20px', border: '1px dashed rgba(34,22,11,0.2)', borderRadius: 8, background: '#fff' },
  emptyText: { fontSize: 13, color: 'rgba(34,22,11,0.55)' },
};

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 16px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: 'nowrap',
    border: active ? 'none' : '1px solid rgba(34,22,11,0.15)',
    background: active ? '#22160B' : '#fff',
    color: active ? '#F6F0E1' : 'rgba(34,22,11,0.65)',
    cursor: 'pointer',
  };
}

export default function Explore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Product[] = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        price: d.data().price,
        category: d.data().category,
        sellerEmail: d.data().sellerEmail || 'Zhopy seller',
        imageUrl: d.data().imageUrl,
        stock: typeof d.data().stock === 'number' ? d.data().stock : undefined,
      }));
      setProducts(list);
    });
    return () => unsub();
  }, []);

  let filtered = products.filter((p) => {
    if (activeCat !== 'All' && p.category !== activeCat) return false;
    if (searchText.trim() && !p.name.toLowerCase().includes(searchText.trim().toLowerCase())) return false;
    const price = Number(p.price);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    return true;
  });

  if (sortBy === 'lowest') {
    filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === 'highest') {
    filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
  }

  return (
    <div style={styles.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <span style={styles.logo}>Explore</span>
          <div style={styles.searchBox}>
            <span style={{ marginRight: 8, opacity: 0.4 }}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.filterRow}>
          {CATEGORIES.map((cat) => (
            <button key={cat} style={pillStyle(activeCat === cat)} onClick={() => setActiveCat(cat)}>
              {cat}
            </button>
          ))}
          <button style={pillStyle(showFilters)} onClick={() => setShowFilters(!showFilters)}>
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {showFilters && (
          <div style={styles.filterPanel}>
            <p style={styles.filterLabel}>Price range (₦)</p>
            <div style={styles.priceRow}>
              <input
                style={styles.priceInput}
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                style={styles.priceInput}
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <p style={styles.filterLabel}>Sort by</p>
            <div style={styles.sortRow}>
              <button style={pillStyle(sortBy === 'newest')} onClick={() => setSortBy('newest')}>Newest</button>
              <button style={pillStyle(sortBy === 'lowest')} onClick={() => setSortBy('lowest')}>Lowest price</button>
              <button style={pillStyle(sortBy === 'highest')} onClick={() => setSortBy('highest')}>Highest price</button>
            </div>
          </div>
        )}

        <p style={styles.resultsCount}>{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              {products.length === 0 ? 'No products yet. Once sellers start posting, their products will show up here.' : 'No products match your search or filters.'}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
        }
