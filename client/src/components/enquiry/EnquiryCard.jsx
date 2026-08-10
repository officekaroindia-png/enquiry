import { MapPin, Phone, Building2, Calendar, Hash, Clock } from 'lucide-react';
import { Avatar, StageBadge } from '../ui';
import { getStageById } from '../../data/stages';
import { formatDate, getDaysInStage, formatDaysInStage } from '../../utils/formatDate';
import styles from './EnquiryCard.module.css';

export function EnquiryCard({ enquiry, isSelected, onClick, theme }) {
  const stage = getStageById(enquiry.stage);
  if (!stage) return null;
  const c = stage.color[theme];
  const lastActivity = enquiry.activities?.[enquiry.activities.length - 1];
  const days = getDaysInStage(enquiry);
  const daysLabel = formatDaysInStage(enquiry);

  // Colour the timer badge: green <3d, amber 3-7d, red >7d
  const timerVariant = days === 0 ? 'today' : days < 3 ? 'fresh' : days < 7 ? 'warn' : 'overdue';

  return (
    <div
      className={[styles.card, isSelected ? styles.selected : ''].join(' ')}
      style={{ '--card-bg': c.bg, '--card-border': c.border, '--card-dot': c.dot }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
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

        {/* ── Days-in-stage timer badge ── */}
        <div className={[styles.stageDuration, styles[`stageDuration__${timerVariant}`]].join(' ')}>
          <Clock size={11} />
          <span>{daysLabel} in this stage</span>
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
