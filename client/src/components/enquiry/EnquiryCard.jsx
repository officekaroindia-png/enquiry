import { MapPin, Phone, Building2, Calendar, Hash } from 'lucide-react';
import { Avatar, StageBadge } from '../ui';
import { getStageById } from '../../data/stages';
import { formatDate } from '../../utils/formatDate';
import styles from './EnquiryCard.module.css';

export function EnquiryCard({ enquiry, isSelected, onClick, theme }) {
  const stage = getStageById(enquiry.stage);
  if (!stage) return null;
  const c = stage.color[theme];
  const lastActivity = enquiry.activities?.[enquiry.activities.length - 1];

  function handleClick(e) {
    // Pass click position so detail panel can float near it
    const rect = e.currentTarget.getBoundingClientRect();
    onClick(enquiry._id, rect);
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
          <div className={styles.identity}>
            <Avatar name={enquiry.name || enquiry.company || '?'} size={38} />
            <div className={styles.nameBlock}>
              <div className={styles.nameRow}>
                <span className={styles.name}>{enquiry.name || enquiry.company || 'Unnamed'}</span>
                {enquiry.enquiryId && (
                  <span className={styles.enqId}>
                    <Hash size={10} />{enquiry.enquiryId.replace('ENQ-', '')}
                  </span>
                )}
              </div>
              <span className={styles.company}><Building2 size={11} />{enquiry.company || '—'}</span>
            </div>
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
