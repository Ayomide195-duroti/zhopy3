import React, { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  sellerEmail: string;
  imageUrl?: string;
  stock?: number;
};

const styles: { [key: string]: React.CSSProperties } = {
  card: { background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(34,22,11,0.1)', position: 'relative' },
  imgWrap: { aspectRatio: '1/1', background: 'rgba(34,22,11,0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, position: 'relative' },
  img: { width: '100%', height: '100%', objectFit: 'cover' as const },
  favBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 },
  cardBody: { padding: '10px 12px 12px' },
  sellerTag: { fontSize: 10, fontWeight: 600, letterSpacing: '0.3px', color: 'rgba(34,22,11,0.42)', marginBottom: 4, textTransform: 'uppercase' as const },
  prodName: { fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 6 },
  priceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontWeight: 800, fontSize: 14 },
  addBtn: { background: '#22160B', color: '#F6F0E1', fontSize: 11, fontWeight: 700, padding: '7px 13px', borderRadius: 5, border: 'none', cursor: 'pointer' },
  stockBadge: { fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 999, marginTop: 4, display: 'inline-block' },
};

export default function ProductCard({ product }: { product: Product }) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const uid = auth.currentUser?.uid;
  const favId = uid ? `${uid}_${product.id}` : '';

  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, 'favorites', favId)).then((snap) => {
      setFavorited(snap.exists());
    });
  }, [uid, favId]);

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    if (!uid || loading) return;
    setLoading(true);
    try {
      if (favorited) {
        await deleteDoc(doc(db, 'favorites', favId));
        setFavorited(false);
      } else {
        await setDoc(doc(db, 'favorites', favId), {
          userId: uid,
          productId: product.id,
          createdAt: new Date().toISOString(),
        });
        setFavorited(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const outOfStock = typeof product.stock === 'number' && product.stock <= 0;

  return (
    <div style={styles.card}>
      <div style={styles.imgWrap}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={styles.img} />
        ) : (
          '📦'
        )}
        <button style={styles.favBtn} onClick={toggleFavorite}>
          {favorited ? '❤️' : '🤍'}
        </button>
      </div>
      <div style={styles.cardBody}>
        <p style={styles.sellerTag}>{product.sellerEmail}</p>
        <p style={styles.prodName}>{product.name}</p>
        {typeof product.stock === 'number' && (
          <span
            style={{
              ...styles.stockBadge,
              background: outOfStock ? 'rgba(178,58,47,0.15)' : 'rgba(76,175,80,0.15)',
              color: outOfStock ? '#B23A2F' : '#2E7D32',
            }}
          >
            {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
          </span>
        )}
        <div style={styles.priceRow}>
          <span style={styles.price}>₦{Number(product.price).toLocaleString()}</span>
          <button style={styles.addBtn} disabled={outOfStock}>
            {outOfStock ? 'Sold out' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
               }
