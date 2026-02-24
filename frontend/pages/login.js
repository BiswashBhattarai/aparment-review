import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../src/components/Header';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/');
    }catch(err){ setError(err?.response?.data?.error || 'Login failed') }
  }

  return (
    <div>
      <Header />
      <main style={{ padding: '40px 20px', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 40, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxWidth: 400, width: '100%' }}>
          <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 28, color: '#1a1a1a', textAlign: 'center' }}>Welcome Back</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>Sign in to your account</p>
          
          <form onSubmit={submit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>Email</label>
              <input 
                type="email"
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
                placeholder="you@example.com"
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>

            {error && (
              <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', padding: 12, borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
                ⚠️ {error}
              </div>
            )}

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 6, fontWeight: '600', cursor: 'pointer', fontSize: 15, transition: 'background 0.2s' }}
              onMouseEnter={e => e.target.style.background = '#0052a3'}
              onMouseLeave={e => e.target.style.background = '#0066cc'}
            >
              Sign In
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: '#666' }}>
            Don't have an account? <a href="/register" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>Create one</a>
          </p>
        </div>
      </main>
    </div>
  )
}
