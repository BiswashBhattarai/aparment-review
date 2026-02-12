import Link from 'next/link'

export default function Header(){
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #eee' }}>
      <div><Link href="/"><a style={{ fontWeight: 'bold', fontSize: 18 }}>IC Apartments</a></Link></div>
      <nav>
        <Link href="/"><a style={{ marginRight: 12 }}>Home</a></Link>
        <Link href="/login"><a style={{ marginRight: 12 }}>Login</a></Link>
        <Link href="/register"><a>Register</a></Link>
      </nav>
    </header>
  )
}
