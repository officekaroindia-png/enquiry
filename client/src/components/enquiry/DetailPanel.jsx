import { useState } from 'react';
import { X, Phone, Mail, MapPin, Building2, Wifi, CheckCircle2, XCircle, ChevronRight, FileText, ArrowRight, Clock } from 'lucide-react';
import { Avatar, StageBadge, Button, Textarea, Select, Divider } from '../ui';
import { getStageById, getValidNextStages, STAGES } from '../../data/stages';
import { formatDate, formatDateTime, getDaysInStage, formatDaysInStage } from '../../utils/formatDate';
import styles from './DetailPanel.module.css';

const ICONS = {
  enquiry_received: Wifi, contact: Phone, presentation: FileText, site_visit: MapPin,
  commercial_offer: FileText, order: CheckCircle2, execution: ArrowRight,
  payment: CheckCircle2, closed_won: CheckCircle2, closed_lost: XCircle,
};

const STAGE_LABELS = {
  enquiry_received: 'Enquiry Received', contact: 'Contact', presentation: 'Presentation',
  site_visit: 'Site Visit (Soil Test)', commercial_offer: 'Commercial Offer', order: 'Order',
  execution: 'Execution', payment: 'Payment', closed_won: '✓ Closed Won', closed_lost: '✗ Closed Lost',
};

export function DetailPanel({ enquiry, theme, onClose, onLogActivity, onCloseLost, onCloseWon }) {
  const [note, setNote] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [showLostConfirm, setShowLostConfirm] = useState(false);
  const [lostNote, setLostNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const currentStage = getStageById(enquiry.stage);
  // All stages except current one — can move anywhere
  const allOtherStages = getValidNextStages(enquiry.stage);
  const isActive = enquiry.stage !== 'closed_won' && enquiry.stage !== 'closed_lost';
  const isOnPayment = enquiry.stage === 'payment';
  const days = getDaysInStage(enquiry);
  const daysLabel = formatDaysInStage(enquiry);
  const timerVariant = days === 0 ? 'today' : days < 3 ? 'fresh' : days < 7 ? 'warn' : 'overdue';
  const c = currentStage?.color[theme] || {};
  const progress = currentStage?.step ? Math.round((currentStage.step / 8) * 100) : enquiry.stage === 'closed_won' ? 100 : 0;

  // Default selected stage — first in list or empty
  const effectiveStage = selectedStage || allOtherStages[0]?.id || '';

  async function wrap(fn) {
    setActionLoading(true);
    setActionError('');
    try { await fn(); } catch (e) { setActionError(e.message); } finally { setActionLoading(false); }
  }

  async function handleLog() {
    if (!note.trim() && !effectiveStage) return;
    await wrap(async () => {
      await onLogActivity(enquiry._id, {
        note: note.trim() || `Moved to ${getStageById(effectiveStage)?.label}.`,
        newStage: effectiveStage || enquiry.stage,
      });
      setNote('');
      setSelectedStage('');
    });
  }

  async function handleCloseWon() {
    await wrap(() => onCloseWon(enquiry._id, note || 'Payment received. Closed as won.'));
    setNote('');
  }

  async function handleCloseLost() {
    await wrap(() => onCloseLost(enquiry._id, lostNote || 'Enquiry closed as lost.'));
    setShowLostConfirm(false);
    setLostNote('');
  }

  return (
    <div className={styles.panel}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.head}>
          <div className={styles.headIdentity}>
            <Avatar name={enquiry.name || enquiry.company || '?'} size={44} />
            <div>
              <div className={styles.headNameRow}>
                <h2 className={styles.headName}>{enquiry.name || '—'}</h2>
                {enquiry.enquiryId && <span className={styles.headId}>{enquiry.enquiryId}</span>}
              </div>
              <span className={styles.headCo}><Building2 size={12} />{enquiry.company || '—'}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Stage + progress */}
        <div className={styles.stageRow}>
          <StageBadge stage={currentStage} theme={theme} />
          {isActive && (
            <div className={styles.progressWrap}>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: `${progress}%`, background: c.dot }} />
              </div>
              <span className={styles.progressLabel}>Step {currentStage?.step || '—'}/8</span>
            </div>
          )}
        </div>

        {/* Days in current stage */}
        <div className={[styles.stageDuration, styles[`stageDuration__${timerVariant}`]].join(' ')}>
          <Clock size={12} />
          <span>{daysLabel} in <strong>{currentStage?.label || enquiry.stage}</strong></span>
        </div>

        {/* Pipeline dots */}
        <div className={styles.dots}>
          {STAGES.map((s) => {
            const done = currentStage?.step ? s.step < currentStage.step : false;
            const cur = s.id === enquiry.stage;
            const sc = s.color[theme];
            return (
              <div key={s.id} className={styles.dotWrap} title={s.label}>
                <div className={[styles.dot, done ? styles.dotDone : '', cur ? styles.dotCur : ''].join(' ')}
                  style={{ background: cur || done ? sc.dot : 'transparent', borderColor: cur || done ? sc.dot : 'var(--border-strong)' }} />
                {s.step < 8 && <div className={styles.dotLine} />}
              </div>
            );
          })}
        </div>

        <Divider />

        {/* Contact info */}
        <section className={styles.section}>
          <h3 className={styles.secTitle}>Contact Info</h3>
          <div className={styles.infoGrid}>
            {[
              { icon: <Mail size={13}/>, label: 'Email', val: enquiry.email },
              { icon: <Phone size={13}/>, label: 'Phone', val: enquiry.phone },
              { icon: <MapPin size={13}/>, label: 'Location', val: enquiry.location },
              { icon: <Wifi size={13}/>, label: 'Project', val: enquiry.projectType },
              { icon: <ChevronRight size={13}/>, label: 'Source', val: enquiry.source },
              { icon: <ChevronRight size={13}/>, label: 'Added', val: formatDate(enquiry.createdAt) },
            ].filter(r => r.val).map(({ icon, label, val }) => (
              <div key={label} className={styles.infoRow}>
                <span className={styles.infoIcon}>{icon}</span>
                <span className={styles.infoLabel}>{label}</span>
                <span className={styles.infoVal}>{val}</span>
              </div>
            ))}
          </div>
          {enquiry.notes && (
            <div className={styles.notesBox}>
              <span className={styles.notesLabel}>Notes</span>
              <p className={styles.notesText}>{enquiry.notes}</p>
            </div>
          )}
        </section>

        <Divider />

        {/* Activity trail */}
        <section className={styles.section}>
          <h3 className={styles.secTitle}>Activity Trail</h3>
          <div className={styles.timeline}>
            {[...enquiry.activities].reverse().map((act, idx, arr) => {
              const actStage = getStageById(act.stage);
              const Icon = ICONS[act.stage] || ChevronRight;
              const ac = actStage?.color[theme];
              return (
                <div key={act._id || idx} className={styles.tlItem}>
                  <div className={styles.tlLeft}>
                    <div className={styles.tlIcon}
                      style={{ background: ac?.bg || 'var(--bg-tertiary)', color: ac?.text || 'var(--text-muted)' }}>
                      <Icon size={13} />
                    </div>
                    {idx < arr.length - 1 && <div className={styles.tlLine} />}
                  </div>
                  <div className={styles.tlBody}>
                    <div className={styles.tlTitle}>{STAGE_LABELS[act.stage] || act.stage}</div>
                    {act.note && <p className={styles.tlNote}>{act.note}</p>}
                    {act.createdByName && <span className={styles.tlUser}>by {act.createdByName}</span>}
                    <span className={styles.tlTime}>{formatDateTime(act.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Add Activity */}
        {isActive && (
          <>
            <Divider />
            <section className={styles.section}>
              <h3 className={styles.secTitle}>Add Activity</h3>
              {actionError && <div className={styles.actionError}>{actionError}</div>}

              <Textarea id="act-note" placeholder="What happened? Add notes here..."
                value={note} onChange={(e) => setNote(e.target.value)} rows={3} />

              {/* Stage selector — ALL stages available */}
              {allOtherStages.length > 0 && (
                <Select id="next-stage" label="Move to stage"
                  value={effectiveStage} onChange={(e) => setSelectedStage(e.target.value)}>
                  {allOtherStages.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </Select>
              )}

              <div className={styles.actionRow}>
                <Button variant="default" onClick={handleLog}
                  disabled={actionLoading || (!note.trim() && !effectiveStage)}>
                  Log activity
                </Button>

                {isOnPayment && (
                  <Button variant="success" onClick={handleCloseWon} disabled={actionLoading}>
                    <CheckCircle2 size={14} /> Close as Won
                  </Button>
                )}

                {!showLostConfirm ? (
                  <Button variant="danger" onClick={() => setShowLostConfirm(true)} disabled={actionLoading}>
                    <XCircle size={14} /> Close as Lost
                  </Button>
                ) : (
                  <div className={styles.lostBox}>
                    <p className={styles.lostWarn}>Reason for losing (optional)</p>
                    <Textarea id="lost-note" placeholder="Lost to competitor, budget..."
                      value={lostNote} onChange={(e) => setLostNote(e.target.value)} rows={2} />
                    <div className={styles.lostBtns}>
                      <Button variant="ghost" size="sm" onClick={() => setShowLostConfirm(false)}>Cancel</Button>
                      <Button variant="danger" size="sm" onClick={handleCloseLost} disabled={actionLoading}>Confirm lost</Button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {!isActive && (
          <div className={[styles.closedBanner, enquiry.stage === 'closed_won' ? styles.closedWon : styles.closedLost].join(' ')}>
            {enquiry.stage === 'closed_won'
              ? <><CheckCircle2 size={16} /> Closed Won — Payment received</>
              : <><XCircle size={16} /> Closed Lost</>}
          </div>
        )}
      </div>
    </div>
  );
}
