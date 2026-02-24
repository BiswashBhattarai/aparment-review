import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../src/components/Header'
import Link from 'next/link'

export default function VerifyEmail(){
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    async function verify() {
      setStatus('loading');
      try {
        const res = await fetch('http://localhost:4000/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json().catch(()=>({}));
        if (!res.ok) {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        } else {
          setStatus('success');
          setMessage(data.message || 'Email verified. You can now login.');
          // auto-redirect to login after 3 seconds
          setTimeout(() => {
            if (typeof window !== 'undefined') router.push('/login');
          }, 3000);
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error while verifying email');
      }
    }
    verify();
  }, [token]);

  // transient inline toast for success messages
  useEffect(() => {
    if (status === 'success') {
      const id = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(id);
    }
  }, [status]);

  return (
    <div>
      <Header />
      <main style={{ padding: 20 }}>
        <h1>Email Verification</h1>
        {!token ? (
          <div>
            <p>No token found in URL. If you have a verification link, make sure it looks like <code>?token=...</code>.</p>
            <p>Or paste the token into the box below and click Verify.</p>
            <ManualVerify />
          </div>
        ) : (
          <div>
            {status === 'loading' && <p>Verifying...</p>}
            {status === 'success' && (
              <div>
                <div style={{ position: 'relative' }}>
                  <div style={{ background: '#e6ffed', border: '1px solid #b7f0c5', color: '#056a2f', padding: 12, borderRadius: 6 }}>{message}</div>
                  <p style={{ marginTop: 8 }}>Redirecting to <Link href="/login">login</Link> in 3s...</p>
                </div>
              </div>
            )}
            {status === 'error' && (
              <div>
                <p style={{ color: 'red' }}>{message}</p>
                <p>If the link expired try requesting a new verification link by registering again.</p>
                <p><Link href="/login">Go to login</Link></p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function ManualVerify(){
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e){
    e && e.preventDefault();
    setMsg('');
    if (!input) { setMsg('Token is required'); return; }
    setLoading(true);
    try{
      const res = await fetch('http://localhost:4000/api/auth/verify-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: input })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) setMsg(data.error || 'Verification failed'); else setMsg(data.message || 'Verified — you can login now');
    }catch(err){ setMsg('Network error'); }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 600 }}>
      <div>
        <label>Verification token</label>
        <input value={input} onChange={e=>setInput(e.target.value)} style={{ width: '100%', marginTop: 6 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
      </div>
      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
    </form>
  )
}
