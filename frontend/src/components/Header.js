import Link from 'next/link'

export default function Header(){
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Link href="/" style={{ fontWeight: 'bold', fontSize: 20, color: '#0066cc', textDecoration: 'none' }}>🏢 IC Apartments</Link>
        <nav style={{ display: 'flex', gap: 24 }}>
          <Link href="/" style={{ fontSize: 14, fontWeight: '500', color: '#333', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#0066cc'} onMouseLeave={e => e.target.style.color = '#333'}>Home</Link>
          <Link href="/login" style={{ fontSize: 14, fontWeight: '500', color: '#333', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#0066cc'} onMouseLeave={e => e.target.style.color = '#333'}>Login</Link>
          <Link href="/register" style={{ fontSize: 14, fontWeight: '500', background: '#0066cc', color: 'white', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#0052a3'} onMouseLeave={e => e.target.style.background = '#0066cc'}>Register</Link>
        </nav>
      </div>
    </header>
  )
}
