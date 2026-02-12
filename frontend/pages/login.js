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
      <main style={{ padding: 20 }}>
        <h1>Login</h1>
        <form onSubmit={submit} style={{ maxWidth: 400 }}>
          <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    </div>
  )
}
