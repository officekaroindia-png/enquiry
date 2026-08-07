import { MapPin, Phone, Building2, Calendar } from 'lucide-react';
import { StageBadge } from '../ui';
import { getStageById } from '../../data/stages';
import { formatDate } from '../../utils/formatDate';
import styles from './EnquiryCard.module.css';

export function EnquiryCard({ enquiry, isSelected, onClick, theme }) {
  const stage = getStageById(enquiry.stage);
  if (!stage) return null;
  const c = stage.color[theme];
  const lastActivity = enquiry.activities?.[enquiry.activities.length - 1];
  const idNum = enquiry.enquiryId ? parseInt(enquiry.enquiryId.replace('ENQ-', ''), 10) : '?';

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    onClick(rect);
  }

  return (
    <div
      className={[styles.card, isSelected ? styles.selected : ''].join(' ')}
      style={{ '--card-bg': c.bg, '--card-border': c.border, '--card-dot': c.dot }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
    >
      <div className={styles.colorStrip} />
      <div className={styles.body}>

        <div className={styles.top}>
          {/* ID Circle instead of avatar */}
          <div
            className={styles.idCircle}
            style={{ background: c.bg, color: c.text, border: `2px solid ${c.border}` }}
          >
            #{idNum}
          </div>

          <div className={styles.nameBlock}>
            <span className={styles.name}>
              {enquiry.name || enquiry.company || 'Unnamed'}
            </span>
            <span className={styles.company}>
              <Building2 size={11} />
              {enquiry.company || '—'}
            </span>
          </div>

          <StageBadge stage={stage} theme={theme} />
        </div>

        <div className={styles.meta}>
          {enquiry.location && <span className={styles.metaItem}><MapPin size={11} />{enquiry.location}</span>}
          {enquiry.phone && <span className={styles.metaItem}><Phone size={11} />{enquiry.phone}</span>}
          <span className={styles.metaItem}><Calendar size={11} />{formatDate(enquiry.createdAt)}</span>
        </div>

        {lastActivity?.note && (
          <div className={styles.lastActivity}>
            <span className={styles.actDot} />
            <span className={styles.actText}>{lastActivity.note}</span>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.source}>{enquiry.source || 'Direct'}</span>
          <span className={styles.actCount}>{enquiry.activities?.length || 0} activities</span>
        </div>
      </div>
    </div>
  );
}
