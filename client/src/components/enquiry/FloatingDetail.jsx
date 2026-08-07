import { useEffect, useRef } from 'react';
import { DetailPanel } from './DetailPanel';
import styles from './FloatingDetail.module.css';

export function FloatingDetail({ enquiry, theme, onClose, onLogActivity, onCloseWon, onCloseLost, clickRect }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;

    const panel = panelRef.current;
    const panelW = 420;
    const panelH = Math.min(panel.scrollHeight, window.innerHeight - 24);
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;
    const margin = 12;

    // Always open to the RIGHT of the sidebar+list area
    // Try right side of clicked card first
    let left = clickRect ? clickRect.right + margin : viewW - panelW - margin;

    // If not enough space on right, try left of card
    if (left + panelW > viewW - margin) {
      left = clickRect ? clickRect.left - panelW - margin : margin;
    }

    // If still off screen, clamp
    if (left < margin) left = margin;
    if (left + panelW > viewW - margin) left = viewW - panelW - margin;

    // Vertically centered in viewport
    const top = Math.max(margin, (viewH - panelH) / 2);

    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    panel.style.maxHeight = `${viewH - 24}px`;
  }, [clickRect, enquiry?._id]);

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
