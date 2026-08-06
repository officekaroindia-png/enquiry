import { useEffect, useRef } from 'react';
import { DetailPanel } from './DetailPanel';
import styles from './FloatingDetail.module.css';

export function FloatingDetail({ enquiry, theme, onClose, onLogActivity, onCloseWon, onCloseLost, clickRect }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current || !clickRect) return;

    const panel = panelRef.current;
    const panelH = 600; // approx panel height
    const panelW = 420;
    const margin = 12;
    const viewH = window.innerHeight;
    const viewW = window.innerWidth;

    // Try to open to the RIGHT of the card first
    let left = clickRect.right + margin;
    let top = clickRect.top;

    // If not enough space on right, open to LEFT
    if (left + panelW > viewW) {
      left = clickRect.left - panelW - margin;
    }

    // If still off screen, center horizontally
    if (left < 0) {
      left = Math.max(margin, (viewW - panelW) / 2);
    }

    // Clamp top so panel doesn't go off bottom
    if (top + panelH > viewH - margin) {
      top = viewH - panelH - margin;
    }

    // Don't go above top
    if (top < margin) top = margin;

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }, [clickRect, enquiry?._id]);

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!enquiry) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdrop}>
      <div className={styles.panel} ref={panelRef}>
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
