import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import ReportModal from './ReportModal';

type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl?: string;
  stock: number;
};

type SellerProfile = {
  name: string;
  location: string;
  phone: string;
};

const MAX_IMAGE_MB = 5;
const MAX_DIMENSION = 1200;
const COMPRESS_QUALITY = 0.72;
const CLOUDINARY_CLOUD_NAME = 'm19y1jnt';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    let detail = '';
    try {
      const errBody = await res.json();
      detail = errBody?.error?.message || '';
    } catch {}
    throw new Error(detail || `Cloudinary upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.secure_url as string;
}

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
          },
          'image/jpeg',
          COMPRESS_QUALITY
        );
      };
      img.onerror = () => reject(new Error('Could not read image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

const CATEGORIES = ['Phones', 'Fashion', 'Home & Living', 'Electronics', 'Beauty', 'Groceries'];

const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Manrope', sans-serif", minHeight: '100vh', background: '#F6F0E1', color: '#22160B' },
  header: { background: '#22160B', padding: '18px 16px' },
  headerRow: { maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { color: '#F6F0E1', fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' },
  roleTag: { background: '#D6A419', color: '#22160B', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999 },
  signOutBtn: { fontSize: 11, fontWeight: 600, color: 'rgba(246,240,225,0.6)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  main: { maxWidth: 900, margin: '0 auto', padding: '24px 16px 48px' },
  pageTitleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  pageTitle: { fontSize: 18, fontWeight: 800 },
  reportLink: { fontSize: 12, fontWeight: 700, color: '#B23A2F', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  pageSub: { fontSize: 13, color: 'rgba(34,22,11,0.55)', marginBottom: 24 },
  successBanner: { background: '#D6A419', color: '#22160B', padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 20 },
  layout: { display: 'flex', flexDirection: 'column', gap: 24 },
  formCard: { background: '#fff', borderRadius: 10, border: '1px solid rgba(34,22,11,0.1)', padding: 20 },
  formTitle: { fontSize: 14, fontWeight: 800, marginBottom: 16 },
  errorText: { fontSize: 12, color: '#B23A2F', marginBottom: 12, fontWeight: 600 },
  label: { fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block' },
  input: { width: '100%', padding: '11px 14px', borderRadius: 7, border: '1px solid rgba(34,22,11,0.18)', fontSize: 14, marginBottom: 14, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1' },
  textarea: { width: '100%', padding: '11px 14px', borderRadius: 7, border: '1px solid rgba(34,22,11,0.18)', fontSize: 14, marginBottom: 14, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1', minHeight: 80, resize: 'vertical' as const },
  select: { width: '100%', padding: '11px 14px', borderRadius: 7, border: '1px solid rgba(34,22,11,0.18)', fontSize: 14, marginBottom: 14, fontFamily: "'Manrope', sans-serif", background: '#F6F0E1' },
  uploadBox: { border: '1.5px dashed rgba(34,22,11,0.25)', borderRadius: 8, padding: '24px 16px', textAlign: 'center', marginBottom: 14, background: '#F6F0E1', cursor: 'pointer', position: 'relative', overflow: 'hidden' },
  uploadText: { fontSize: 12, color: 'rgba(34,22,11,0.5)', marginTop: 4 },
  previewImg: { width: '100%', maxHeight: 180, objectFit: 'contain' as const, borderRadius: 6, marginBottom: 8 },
  removeImgBtn: { fontSize: 11, fontWeight: 700, color: '#B23A2F', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  thumbWrap: { width: 44, height: 44, borderRadius: 6, overflow: 'hidden', background: 'rgba(34,22,11,0.05)', flexShrink: 0, marginRight: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  thumbImg: { width: '100%', height: '100%', objectFit: 'cover' as const },
  submitBtn: { width: '100%', background: '#D6A419', color: '#22160B', fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  submitBtnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  listSection: {},
  listTitle: { fontSize: 14, fontWeight: 800, marginBottom: 12 },
  productRow: { background: '#fff', borderRadius: 8, border: '1px solid rgba(34,22,11,0.1)', padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  productName: { fontSize: 13, fontWeight: 700, marginBottom: 2 },
  productMeta: { fontSize: 11, color: 'rgba(34,22,11,0.5)' },
  productPrice: { fontSize: 13, fontWeight: 800 },
  emptyState: { textAlign: 'center', padding: '32px 20px', border: '1px dashed rgba(34,22,11,0.2)', borderRadius: 8, background: '#fff' },
  emptyText: { fontSize: 13, color: 'rgba(34,22,11,0.55)' },
  tabRow: { display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid rgba(34,22,11,0.1)' },
  stockRow: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 },
  stockBadge: { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999 },
  successBannerSmall: { background: '#D6A419', color: '#22160B', padding: '10px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, marginBottom: 16 },
  menuBtn: { background: 'transparent', border: 'none', color: '#F6F0E1', fontSize: 22, cursor: 'pointer', padding: 4, lineHeight: 1 },
  menuOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100 },
  menuPanel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: 240, background: '#22160B', zIndex: 101, padding: '20px 0', display: 'flex', flexDirection: 'column' },
  menuItem: { color: '#F6F0E1', fontSize: 14, fontWeight: 600, padding: '14px 20px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 },
  menuItemActive: { background: 'rgba(214,164,25,0.15)', color: '#D6A419' },
  menuDivider: { height: 1, background: 'rgba(246,240,225,0.1)', margin: '8px 0' },
  profileField: { marginBottom: 4 },
};

export default function SellerDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [view, setView] = useState<'products' | 'profile'>('products');
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileName, setProfileName] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_IMAGE_MB}MB.`);
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage(e: React.MouseEvent) {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Product[] = snapshot.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        price: d.data().price,
        category: d.data().category,
        description: d.data().description,
        imageUrl: d.data().imageUrl,
        stock: typeof d.data().stock === 'number' ? d.data().stock : 0,
      }));
      setProducts(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function loadProfile() {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      setProfileLoading(true);
      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          const data = snap.data();
          setProfileName(data.name || '');
          setProfileLocation(data.location || '');
          setProfilePhone(data.phone || '');
        }
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileError('');
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    setProfileSaving(true);
    try {
      await setDoc(
        doc(db, 'users', uid),
        { name: profileName, location: profileLocation, phone: profilePhone },
        { merge: true }
      );
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setProfileError('Failed to save profile. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a product name.');
      return;
    }
    if (!price.trim()) {
      setError('Please enter a price.');
      return;
    }
    const stockNum = Number(stock);
    if (!stock.trim() || isNaN(stockNum) || stockNum < 0) {
      setError('Please enter how many units are available.');
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setError('You must be signed in to post a product.');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        setUploadPct(10);
        const compressed = await compressImage(imageFile);
        setUploadPct(40);
        imageUrl = await uploadToCloudinary(compressed);
        setUploadPct(100);
      }

      await addDoc(collection(db, 'products'), {
        name,
        price,
        category,
        description,
        imageUrl,
        stock: stockNum,
        sellerId: uid,
        sellerEmail: auth.currentUser?.email || '',
        createdAt: new Date().toISOString(),
      });
      setName('');
      setPrice('');
      setStock('1');
      setDescription('');
      clearImage({ stopPropagation: () => {} } as React.MouseEvent);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to post product. Please try again.');
    } finally {
      setSaving(false);
      setUploadPct(0);
    }
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
          <button style={styles.menuBtn} onClick={() => setMenuOpen(true)}>☰</button>
        </div>
      </header>

      {menuOpen && (
        <>
          <div style={styles.menuOverlay} onClick={() => setMenuOpen(false)} />
          <div style={styles.menuPanel}>
            <button
              style={view === 'products' ? { ...styles.menuItem, ...styles.menuItemActive } : styles.menuItem}
              onClick={() => { setView('products'); setMenuOpen(false); }}
            >
              📦 Products
            </button>
            <button
              style={view === 'profile' ? { ...styles.menuItem, ...styles.menuItemActive } : styles.menuItem}
              onClick={() => { setView('profile'); setMenuOpen(false); }}
            >
              👤 Profile
            </button>
            <div style={styles.menuDivider} />
            <button style={styles.menuItem} onClick={() => { setShowReport(true); setMenuOpen(false); }}>
              🚩 Report an issue
            </button>
            <button style={styles.menuItem} onClick={onSignOut}>
              🚪 Sign out
            </button>
          </div>
        </>
      )}

      <main style={styles.main}>
        {view === 'products' ? (
          <>
            <div style={styles.pageTitleRow}>
              <p style={styles.pageTitle}>Seller Dashboard</p>
            </div>
            <p style={styles.pageSub}>Post new products and manage your listings.</p>

            {showSuccess && (
              <div style={styles.successBanner}>✓ Product posted successfully!</div>
            )}

            <div style={styles.layout}>
              <form style={styles.formCard} onSubmit={handlePost}>
                <p style={styles.formTitle}>Add a product</p>

                {error && <p style={styles.errorText}>{error}</p>}

                <div style={styles.uploadBox} onClick={() => fileInputRef.current?.click()}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Product preview" style={styles.previewImg} />
                      <button type="button" style={styles.removeImgBtn} onClick={clearImage}>Remove photo</button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 22 }}>📷</div>
                      <p style={styles.uploadText}>
                        {saving && uploadPct > 0 ? `Uploading... ${uploadPct}%` : 'Tap to add a product photo'}
                      </p>
                    </>
                  )}
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

                <label style={styles.label}>Units available</label>
                <input
                  style={styles.input}
                  placeholder="e.g. 5"
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
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

                <button
                  style={saving ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Posting...' : 'Post product'}
                </button>
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
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={styles.thumbWrap}>
                          {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={styles.thumbImg} /> : '📦'}
                        </div>
                        <div>
                          <p style={styles.productName}>{p.name}</p>
                          <p style={styles.productMeta}>{p.category}</p>
                          <div style={styles.stockRow}>
                            <span
                              style={{
                                ...styles.stockBadge,
                              background: p.stock > 0 ? 'rgba(76,175,80,0.15)' : 'rgba(178,58,47,0.15)',
                                  color: p.stock > 0 ? '#2E7D32' : '#B23A2F',
                              }}
                            >
                              {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span style={styles.productPrice}>₦{Number(p.price).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={styles.pageTitleRow}>
              <p style={styles.pageTitle}>Your Profile</p>
            </div>
            <p style={styles.pageSub}>This information may be shown to buyers.</p>

            {profileSuccess && <div style={styles.successBannerSmall}>✓ Profile saved!</div>}

            <form style={styles.formCard} onSubmit={handleSaveProfile}>
              {profileError && <p style={styles.errorText}>{profileError}</p>}

              <div style={styles.profileField}>
                <label style={styles.label}>Business / display name</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Ayo's Fashion Store"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  disabled={profileLoading}
                />
              </div>

              <div style={styles.profileField}>
                <label style={styles.label}>Location</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Ede, Osun State"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  disabled={profileLoading}
                />
              </div>

              <div style={styles.profileField}>
                <label style={styles.label}>Phone number</label>
                <input
                  style={styles.input}
                  placeholder="e.g. 08012345678"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  disabled={profileLoading}
                />
              </div>

              <button
                style={profileSaving ? { ...styles.submitBtn, ...styles.submitBtnDisabled } : styles.submitBtn}
                type="submit"
                disabled={profileSaving || profileLoading}
              >
                {profileSaving ? 'Saving...' : 'Save profile'}
              </button>
            </form>
          </>
        )}
      </main>

      {showReport && (
        <ReportModal subjectLabel="General issue" onClose={() => setShowReport(false)} />
      )}
    </div>
  );
                               }


                                
