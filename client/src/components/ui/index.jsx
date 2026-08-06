import styles from './ui.module.css';

export function Avatar({ name = '', size = 36 }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div className={styles.avatar} style={{ width: size, height: size, fontSize: size * 0.36, background: `hsl(${hue},55%,88%)`, color: `hsl(${hue},50%,30%)` }} aria-hidden="true">
      {initials}
    </div>
  );
}

export function StageBadge({ stage, theme = 'light' }) {
  if (!stage) return null;
  const c = stage.color[theme];
  return <span className={styles.badge} style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{stage.label}</span>;
}

export function Button({ children, variant = 'default', size = 'md', onClick, disabled, type = 'button', className = '' }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={[styles.btn, styles[`btn_${variant}`], styles[`btn_${size}`], className].join(' ')}>
      {children}
    </button>
  );
}

export function Input({ label, id, error, ...props }) {
  return (
    <div className={styles.fieldGroup}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <input id={id} className={[styles.input, error ? styles.inputError : ''].join(' ')} {...props} />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

export function Textarea({ label, id, rows = 3, ...props }) {
  return (
    <div className={styles.fieldGroup}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <textarea id={id} rows={rows} className={styles.textarea} {...props} />
    </div>
  );
}

export function Select({ label, id, children, ...props }) {
  return (
    <div className={styles.fieldGroup}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <select id={id} className={styles.select} {...props}>{children}</select>
    </div>
  );
}

export function Divider() { return <hr className={styles.divider} />; }

export function Spinner({ size = 20 }) {
  return <div className={styles.spinner} style={{ width: size, height: size }} />;
}

export function EmptyState({ icon, title, description }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <p className={styles.emptyTitle}>{title}</p>
      {description && <p className={styles.emptyDesc}>{description}</p>}
    </div>
  );
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className={styles.errorBanner}>
      <span>{message}</span>
      {onDismiss && <button onClick={onDismiss} className={styles.errorClose}>✕</button>}
    </div>
  );
}
