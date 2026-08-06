import { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Select, Textarea, ErrorBanner, Spinner } from '../ui';
import styles from './NewEnquiryModal.module.css';

const SOURCES = ['Website','Referral','LinkedIn','Cold Call','Event','WhatsApp','Other'];
const PROJECT_TYPES = [
  'Industrial Earthing','Data Centre Earthing','Telecom Tower Earthing',
  'Chemical Plant Earthing','Warehouse Earthing','Solar Plant Earthing',
  'Residential Earthing','Other',
];
const EMPTY = { name:'', company:'', email:'', phone:'', location:'', projectType: PROJECT_TYPES[0], source: SOURCES[0], notes:'' };

export function NewEnquiryModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  async function handleSubmit(ev) {
    ev.preventDefault();
    setLoading(true);
    setApiError('');
    try {
      await onSubmit({ ...form });
      onClose();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>New Enquiry</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <ErrorBanner message={apiError} onDismiss={() => setApiError('')} />
          <div className={styles.grid2}>
            <Input id="name" label="Full name" value={form.name} onChange={set('name')} placeholder="Rajesh Kumar" />
            <Input id="company" label="Company" value={form.company} onChange={set('company')} placeholder="Acme Corp Pvt Ltd" />
          </div>
          <div className={styles.grid2}>
            <Input id="email" label="Email" type="email" value={form.email} onChange={set('email')} placeholder="rajesh@acme.in" />
            <Input id="phone" label="Phone" value={form.phone} onChange={set('phone')} placeholder="98xxxxxxxx" />
          </div>
          <div className={styles.grid2}>
            <Input id="location" label="Location" value={form.location} onChange={set('location')} placeholder="Mumbai, Maharashtra" />
            <Select id="source" label="Source" value={form.source} onChange={set('source')}>
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </div>
          <Select id="projectType" label="Project type" value={form.projectType} onChange={set('projectType')}>
            {PROJECT_TYPES.map((p) => <option key={p}>{p}</option>)}
          </Select>
          <Textarea id="notes" label="Initial notes" value={form.notes} onChange={set('notes')} placeholder="Any initial details..." rows={3} />
          <div className={styles.footer}>
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size={16} /> : 'Add Enquiry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
