import Link from 'next/link'

export default function Header(){
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #eee' }}>
      <div><Link href="/" style={{ fontWeight: 'bold', fontSize: 18 }}>IC Apartments</Link></div>
      <nav>
        <Link href="/" style={{ marginRight: 12 }}>Home</Link>
        <Link href="/login" style={{ marginRight: 12 }}>Login</Link>
        <Link href="/register">Register</Link>
      </nav>
    </header>
  )
}
