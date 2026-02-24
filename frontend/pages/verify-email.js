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
      <main style={{ padding: '40px 20px', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 40, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxWidth: 600, width: '100%' }}>
          <h1 style={{ marginTop: 0, marginBottom: 24, fontSize: 28, color: '#1a1a1a', textAlign: 'center' }}>🔐 Email Verification</h1>
          
          {!token ? (
            <div>
              <p style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>No token found in URL. If you received a verification link, click it directly.</p>
              <p style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>Or paste your verification token below:</p>
              <ManualVerify />
            </div>
          ) : (
            <div>
              {status === 'loading' && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 16, color: '#666' }}>⏳ Verifying your email...</p>
                </div>
              )}
              {status === 'success' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: '#e6ffed', border: '1px solid #b7f0c5', color: '#056a2f', padding: 16, borderRadius: 6, marginBottom: 20, fontSize: 15, fontWeight: '500' }}>
                    ✓ {message}
                  </div>
                  <p style={{ fontSize: 14, color: '#666' }}>Redirecting to login in 3 seconds...</p>
                </div>
              )}
              {status === 'error' && (
                <div>
                  <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', padding: 16, borderRadius: 6, marginBottom: 20, fontSize: 15 }}>
                    ⚠️ {message}
                  </div>
                  <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>If the link expired, you can register again to receive a new verification link.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <a href="/login" style={{ padding: '10px', background: '#f0f0f0', color: '#0066cc', border: '#ddd solid 1px', borderRadius: 6, textDecoration: 'none', fontWeight: '500', textAlign: 'center', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.target.style.background = '#e0e0e0'} onMouseLeave={e => e.target.style.background = '#f0f0f0'}>← Back to Login</a>
                    <a href="/register" style={{ padding: '10px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 6, textDecoration: 'none', fontWeight: '500', textAlign: 'center', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.target.style.background = '#0052a3'} onMouseLeave={e => e.target.style.background = '#0066cc'}>Register Again</a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ManualVerify(){
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  async function submit(e){
    e && e.preventDefault();
    setMsg('');
    setIsError(false);
    if (!input) { setMsg('Token is required'); setIsError(true); return; }
    setLoading(true);
    try{
      const res = await fetch('http://localhost:4000/api/auth/verify-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: input })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) { 
        setMsg(data.error || 'Verification failed'); 
        setIsError(true);
      } else { 
        setMsg(data.message || 'Verified — you can login now');
        setIsError(false);
        setInput('');
      }
    }catch(err){ 
      setMsg('Network error'); 
      setIsError(true);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>Verification Token</label>
        <input 
          value={input} 
          onChange={e=>setInput(e.target.value)} 
          placeholder="Paste your verification token here"
          style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', fontFamily: 'monospace' }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        style={{ width: '100%', padding: '10px', background: loading ? '#ccc' : '#0066cc', color: 'white', border: 'none', borderRadius: 6, fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, transition: 'background 0.2s' }}
        onMouseEnter={e => { if (!loading) e.target.style.background = '#0052a3'; }}
        onMouseLeave={e => { if (!loading) e.target.style.background = '#0066cc'; }}
      >
        {loading ? '⏳ Verifying...' : '✓ Verify Token'}
      </button>

      {msg && (
        <div style={{ background: isError ? '#ffebee' : '#e6ffed', border: `1px solid ${isError ? '#ffcdd2' : '#b7f0c5'}`, color: isError ? '#c62828' : '#056a2f', padding: 12, borderRadius: 6, marginTop: 16, fontSize: 14 }}>
          {isError ? '⚠️' : '✓'} {msg}
        </div>
      )}
    </form>
  )
}
