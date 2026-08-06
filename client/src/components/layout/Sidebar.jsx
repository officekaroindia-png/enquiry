import { LayoutDashboard, List, CheckCircle, XCircle, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Sidebar.module.css';

const NAV = [
  { id: 'pipeline',    label: 'Pipeline',      icon: LayoutDashboard },
  { id: 'all',         label: 'All Enquiries', icon: List },
  { id: 'closed_won',  label: 'Closed Won',    icon: CheckCircle },
  { id: 'closed_lost', label: 'Closed Lost',   icon: XCircle },
];

export function Sidebar({ activeView, onViewChange, counts, onNewEnquiry, open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} />}
      <aside className={[styles.sidebar, open ? styles.open : ''].join(' ')}>
        <div className={styles.brand}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>EnquiryCRM</span>
        </div>

        <button className={styles.newBtn} onClick={() => { onNewEnquiry(); onClose(); }}>
          <Plus size={15} /> New Enquiry
        </button>

        <nav className={styles.nav}>
          <span className={styles.navSection}>Views</span>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id}
              className={[styles.navItem, activeView === id ? styles.active : ''].join(' ')}
              onClick={() => { onViewChange(id); onClose(); }}>
              <Icon size={16} />
              <span>{label}</span>
              {counts[id] != null && <span className={styles.count}>{counts[id]}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userRow}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
            <button className={styles.logoutBtn} onClick={logout} title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
