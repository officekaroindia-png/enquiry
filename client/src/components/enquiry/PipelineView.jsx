import { STAGES } from '../../data/stages';
import { EnquiryCard } from './EnquiryCard';
import styles from './PipelineView.module.css';

export function PipelineView({ enquiries, selectedId, onSelect, theme }) {
  const active = enquiries.filter((e) => e.stage !== 'closed_won' && e.stage !== 'closed_lost');
  return (
    <div className={styles.board}>
      {STAGES.map((stage) => {
        const items = active.filter((e) => e.stage === stage.id);
        const c = stage.color[theme];
        return (
          <div key={stage.id} className={styles.column}>
            <div className={styles.colHeader} style={{ borderTop: `3px solid ${c.dot}` }}>
              <div className={styles.colTitle}>
                <span className={styles.colDot} style={{ background: c.dot }} />
                <span className={styles.colLabel}>{stage.label}</span>
              </div>
              <span className={styles.colCount} style={{ background: c.bg, color: c.text }}>{items.length}</span>
            </div>
            <div className={styles.colCards}>
              {items.length === 0
                ? <div className={styles.emptyCol}>No enquiries</div>
                : items.map((enq) => <EnquiryCard key={enq._id} enquiry={enq} isSelected={enq._id === selectedId} onClick={(rect) => onSelect(enq._id, rect)} theme={theme} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
