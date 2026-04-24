import { useState } from 'react';
import axios from 'axios';
import Header from '../src/components/Header';
import Link from 'next/link';

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="1"/>
    <line x1="9" y1="22" x2="9" y2="12"/>
    <line x1="15" y1="22" x2="15" y2="12"/>
    <line x1="9" y1="7" x2="9.01" y2="7"/>
    <line x1="15" y1="7" x2="15.01" y2="7"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
  </svg>
);

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setIsError(false);
    try {
      await axios.post('http://localhost:4000/api/auth/register', { email, password });
      setMessage('✓ Registered! Check your email for a verification link (or console if no email setup)');
      setEmail('');
      setPassword('');
    } catch (err) {
      setIsError(true);
      setMessage(err?.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <>
      <Header />
      <main style={styles.page}>
        <div style={styles.card}>
          {/* Logo */}
          <div style={styles.logo}>
            <BuildingIcon />
          </div>

          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>Join the apartment review community</p>

          <form onSubmit={submit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={styles.input}
              />
              <p style={styles.hint}>
                💡 Use a @uiowa.edu email for automatic student verification
              </p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={styles.input}
              />
            </div>

            {message && (
              <div
                style={{
                  ...styles.message,
                  ...(isError ? styles.messageError : styles.messageSuccess),
                }}
              >
                {message}
              </div>
            )}

            <button type="submit" style={styles.btnPrimary}>
              Create Account
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account?{' '}
            <Link href="/login" style={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: '40px 20px',
  },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 40,
    maxWidth: 420,
    width: '100%',
    boxShadow: 'var(--shadow-md)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    fontWeight: 600,
    color: 'var(--text)',
    textAlign: 'center',
    marginBottom: 6,
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--text2)',
    textAlign: 'center',
    marginBottom: 28,
    margin: '6px 0 28px 0',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    marginBottom: 8,
    fontWeight: 500,
    fontSize: 14,
    color: 'var(--text)',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box',
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    color: 'var(--text3)',
    margin: '6px 0 0 0',
  },
  message: {
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    marginBottom: 20,
  },
  messageSuccess: {
    background: 'var(--green-soft)',
    border: '1px solid var(--green)',
    color: 'oklch(40% 0.14 155)',
  },
  messageError: {
    background: 'oklch(96% 0.04 15)',
    border: '1px solid oklch(75% 0.14 15)',
    color: 'oklch(40% 0.18 15)',
  },
  btnPrimary: {
    width: '100%',
    padding: '11px 28px',
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 15,
    transition: 'background 0.15s',
    outline: 'none',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: 'var(--text2)',
    margin: '20px 0 0 0',
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'none',
    fontWeight: 500,
  },
};
