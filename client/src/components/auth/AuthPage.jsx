import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, ErrorBanner, Spinner } from '../ui';
import styles from './AuthPage.module.css';

export function AuthPage() {
  const { login, register, loading, error, clearError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (formErrors[field]) setFormErrors((fe) => ({ ...fe, [field]: '' }));
    clearError();
  };

  function validate() {
    const errs = {};
    if (mode === 'register' && !form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (mode === 'register' && form.password.length < 6) errs.password = 'Min 6 characters';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    if (mode === 'login') {
      await login(form.email, form.password);
    } else {
      await register(form.name, form.email, form.password);
    }
  }

  function switchMode() {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setForm({ name: '', email: '', password: '' });
    setFormErrors({});
    clearError();
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚡</span>
          <span className={styles.brandName}>EnquiryCRM</span>
        </div>
        <h1 className={styles.title}>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p className={styles.subtitle}>
          {mode === 'login' ? 'Sign in to your account' : 'Start tracking your enquiries'}
        </p>

        <ErrorBanner message={error} onDismiss={clearError} />

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <Input id="name" label="Full name" value={form.name} onChange={set('name')}
              placeholder="Karan Singh" error={formErrors.name} autoComplete="name" />
          )}
          <Input id="email" label="Email" type="email" value={form.email} onChange={set('email')}
            placeholder="you@company.in" error={formErrors.email} autoComplete="email" />
          <Input id="password" label="Password" type="password" value={form.password} onChange={set('password')}
            placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'} error={formErrors.password}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />

          <Button variant="primary" size="lg" type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? <Spinner size={16} /> : mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <p className={styles.switchText}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <button className={styles.switchBtn} onClick={switchMode}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
