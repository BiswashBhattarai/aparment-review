import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="1"/>
    <line x1="9" y1="22" x2="9" y2="12"/>
    <line x1="15" y1="22" x2="15" y2="12"/>
    <line x1="9" y1="7" x2="9.01" y2="7"/>
    <line x1="15" y1="7" x2="15.01" y2="7"/>
    <line x1="9" y1="12" x2="15" y2="12"/>
  </svg>
);

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('jwt_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <header style={styles.header}>
      <div style={styles.headerInner}>
        <Link href="/" style={styles.logo}>
          <div style={styles.logoMark}>
            <BuildingIcon />
          </div>
          <span style={styles.logoName}>IC Apartments</span>
        </Link>
        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>
            Browse
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} style={styles.btnDanger}>
              Sign out
            </button>
          ) : (
            <>
              <Link href="/login" style={styles.navLink}>
                Sign in
              </Link>
              <Link href="/register" style={styles.btnPrimary}>
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(250, 248, 245, 0.88)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 64,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    cursor: 'pointer',
  },
  logoMark: {
    width: 32,
    height: 32,
    background: 'var(--accent)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18,
    color: 'var(--text)',
    fontWeight: 600,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  navLink: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text2)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    transition: 'color 0.15s, background 0.15s',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    display: 'inline-block',
  },
  btnPrimary: {
    fontSize: 14,
    fontWeight: 600,
    color: 'white',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 18px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  btnDanger: {
    fontSize: 14,
    fontWeight: 500,
    color: 'white',
    background: '#c0392b',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 18px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
};
