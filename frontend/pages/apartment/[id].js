import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../src/components/Header';

export default function ApartmentPage(){
  const router = useRouter();
  const { id } = router.query;
  const [apartment, setApartment] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(()=>{ if(id) load(); }, [id]);

  async function load(){
    try{
      const apt = await axios.get(`http://localhost:4000/api/apartments/${id}`);
      setApartment(apt.data.apartment);
      const rev = await axios.get(`http://localhost:4000/api/apartments/${id}/reviews`);
      setReviews(rev.data.data);
    }catch(err){ console.error(err) }
  }

  if(!apartment) return (<div><Header /><main style={{padding:20}}>Loading...</main></div>);

  return (
    <div>
      <Header />
      <main style={{ padding: 20 }}>
        <h1>{apartment.name}</h1>
        <p>{apartment.address}</p>
        <p>Rent: ${apartment.rent_min} - ${apartment.rent_max}</p>
        <h2>Reviews</h2>
        {reviews.length === 0 ? <p>No reviews yet</p> : (
          reviews.map(r => (
            <div key={r.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
              <div style={{ fontWeight: 'bold' }}>{r.display_as_anonymous ? 'Anonymous' : r.user?.username || 'User' } {r.is_verified_student ? '(Verified Student)' : ''}</div>
              <div>{r.written_review}</div>
              <div style={{ color: '#666', fontSize: 12 }}>{new Date(r.created_at).toLocaleString()}</div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
