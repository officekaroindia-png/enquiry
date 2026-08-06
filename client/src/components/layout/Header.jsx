import { Sun, Moon, Menu, Search, RefreshCw } from 'lucide-react';
import styles from './Header.module.css';

const LABELS = { pipeline: 'Pipeline', all: 'All Enquiries', closed_won: 'Closed Won', closed_lost: 'Closed Lost' };

export function Header({ theme, onThemeToggle, activeView, onMenuToggle, search, onSearch, onRefresh, loading }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuToggle}><Menu size={20} /></button>
        <h1 className={styles.title}>{LABELS[activeView] || 'CRM'}</h1>
      </div>
      <div className={styles.right}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input type="text" className={styles.searchInput} placeholder="Search enquiries..."
            value={search} onChange={(e) => onSearch(e.target.value)} />
        </div>
        <button className={styles.iconBtn} onClick={onRefresh} title="Refresh" disabled={loading}>
          <RefreshCw size={16} className={loading ? styles.spinning : ''} />
        </button>
        <button className={styles.iconBtn} onClick={onThemeToggle}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
