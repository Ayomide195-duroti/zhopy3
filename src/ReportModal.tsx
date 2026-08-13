import React, { useState } from 'react';

const REASONS = ['Item not as described', 'No delivery', 'Scam / no payment', 'Rude behavior', 'Other'];

const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(34,22,11,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 },
  sheet: { width: '100%', maxWidth: 480, background: '#F6F0E1', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, fontFamily: "'Manrope', sans-serif", color: '#22160B', maxHeight: '85vh', overflowY: 'auto' as const },
  title: { fontSize: 16, fontWeight: 800, marginBottom: 4 },
  sub: { fontSize: 12, color: 'rgba(34,22,11,0.55)', marginBottom: 18 },
  label: { fontSize: 12, fontWeight: 600, marginBottom: 8, display: 'block' },
  reasonGrid: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 },
  textarea: { width: '100%', padding: '11px 14px', borderRadius: 7, border: '1px solid rgba(34,22,11,0.18)', fontSize: 14, marginBottom: 16, fontFamily: "'Manrope', sans-serif", background: '#fff', minHeight: 80, resize: 'vertical' as const },
  errorText: { fontSize: 12, color: '#B23A2F', marginBottom: 12, fontWeight: 600 },
  btnRow: { display: 'flex', gap: 10 },
  cancelBtn: { flex: 1, background: '#fff', color: '#22160B', fontSize: 13, fontWeight: 700, padding: '12px', borderRadius: 8, border: '1px solid rgba(34,22,11,0.18)', cursor: 'pointer' },
  submitBtn: { flex: 1, background: '#D6A419', color: '#22160B', fontSize: 13, fontWeight: 700, padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer' },
  successWrap: { textAlign: 'center', padding: '20px 0' },
  successIcon: { fontSize: 32, marginBottom: 10 },
  successTitle: { fontSize: 15, fontWeight: 800, marginBottom: 6 },
  successText: { fontSize: 12, color: 'rgba(34,22,11,0.55)', marginBottom: 20 },
  doneBtn: { background: '#22160B', color: '#F6F0E1', fontSize: 13, fontWeight: 700, padding: '11px 24px', borderRadius: 8, border: 'none', cursor: 'pointer' },
};

function reasonBtnStyle(active: boolean): React.CSSProperties {
  return {
    textAlign: 'left', padding: '11px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    border: active ? '2px solid #22160B' : '1px solid rgba(34,22,11,0.18)',
    background: active ? '#22160B' : '#fff',
    color: active ? '#F6F0E1' : '#22160B',
  };
}

export default function ReportModal({ subjectLabel, onClose }: { subjectLabel: string; onClose: () => void }) {
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!reason) {
      setError('Please select a reason.');
      return;
    }
    setError('');
    setSubmitted(true);
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <>
            <p style={styles.title}>Report an issue</p>
            <p style={styles.sub}>Regarding: {subjectLabel}</p>

            <label style={styles.label}>What went wrong?</label>
            <div style={styles.reasonGrid}>
              {REASONS.map((r) => (
                <button
                  key={r}
                  style={reasonBtnStyle(reason === r)}
                  onClick={() => { setReason(r); setError(''); }}
                >
                  {r}
                </button>
              ))}
            </div>

            <label style={styles.label}>Additional details (optional)</label>
            <textarea
              style={styles.textarea}
              placeholder="Tell us more about what happened..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />

            {error && <p style={styles.errorText}>{error}</p>}

            <div style={styles.btnRow}>
              <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
              <button style={styles.submitBtn} onClick={handleSubmit}>Submit report</button>
            </div>
          </>
        ) : (
          <div style={styles.successWrap}>
            <div style={styles.successIcon}>✓</div>
            <p style={styles.successTitle}>Report submitted</p>
            <p style={styles.successText}>Our admin team will review this and follow up if needed.</p>
            <button style={styles.doneBtn} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
         }
