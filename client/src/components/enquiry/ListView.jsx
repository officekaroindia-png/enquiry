import { EnquiryCard } from './EnquiryCard';
import { EmptyState } from '../ui';
import { Inbox } from 'lucide-react';
import styles from './ListView.module.css';

export function ListView({ enquiries, selectedId, onSelect, theme, emptyMessage }) {
  if (!enquiries.length) return <EmptyState icon={<Inbox size={36} />} title={emptyMessage} />;
  return (
    <div className={styles.list}>
      {enquiries.map((enq) => (
        <EnquiryCard key={enq._id} enquiry={enq} isSelected={enq._id === selectedId} onClick={() => onSelect(enq._id)} theme={theme} />
      ))}
    </div>
  );
}
