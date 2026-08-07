import { useEffect, useRef } from 'react';
import { DetailPanel } from './DetailPanel';
import styles from './FloatingDetail.module.css';

export function FloatingDetail({ enquiry, theme, onClose, onLogActivity, onCloseWon, onCloseLost }) {
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!enquiry) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdrop}>
      <div className={styles.panel}>
        <DetailPanel
          enquiry={enquiry}
          theme={theme}
          onClose={onClose}
          onLogActivity={onLogActivity}
          onCloseWon={onCloseWon}
          onCloseLost={onCloseLost}
        />
      </div>
    </div>
  );
}
