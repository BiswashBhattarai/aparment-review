import { useState } from 'react'
import axios from 'axios'
import Header from '../src/components/Header'

export default function Register(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [message,setMessage] = useState('');

  async function submit(e){
    e.preventDefault();
    try{
      await axios.post('http://localhost:4000/api/auth/register', { email, password });
      setMessage('Registered — check console/email for verification link');
    }catch(err){ setMessage(err?.response?.data?.error || 'Failed') }
  }

  return (
    <div>
      <Header />
      <main style={{ padding: 20 }}>
        <h1>Register</h1>
        <form onSubmit={submit} style={{ maxWidth: 400 }}>
          <div><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
      </main>
    </div>
  )
}
