import { useState } from 'react'
import axios from 'axios'
import Header from '../src/components/Header'

export default function Register(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  async function submit(e){
    e.preventDefault();
    setIsError(false);
    try{
      await axios.post('http://localhost:4000/api/auth/register', { email, password });
      setMessage('✓ Registered! Check your email for a verification link (or console if no email setup)');
      setEmail('');
      setPassword('');
    }catch(err){ 
      setIsError(true);
      setMessage(err?.response?.data?.error || 'Registration failed') 
    }
  }

  return (
    <div>
      <Header />
      <main style={{ padding: '40px 20px', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 40, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', maxWidth: 400, width: '100%' }}>
          <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 28, color: '#1a1a1a', textAlign: 'center' }}>Create Account</h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>Join the apartment review community</p>
          
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
              <p style={{ marginTop: 6, fontSize: 12, color: '#999' }}>💡 Use a @uiowa.edu email for student verification</p>
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

            {message && (
              <div style={{ background: isError ? '#ffebee' : '#e6ffed', border: `1px solid ${isError ? '#ffcdd2' : '#b7f0c5'}`, color: isError ? '#c62828' : '#056a2f', padding: 12, borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
                {isError ? '⚠️' : '✓'} {message}
              </div>
            )}

            <button 
              type="submit" 
              style={{ width: '100%', padding: '12px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 6, fontWeight: '600', cursor: 'pointer', fontSize: 15, transition: 'background 0.2s' }}
              onMouseEnter={e => e.target.style.background = '#0052a3'}
              onMouseLeave={e => e.target.style.background = '#0066cc'}
            >
              Create Account
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: '#666' }}>
            Already have an account? <a href="/login" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>Sign in</a>
          </p>
        </div>
      </main>
    </div>
  )
}
