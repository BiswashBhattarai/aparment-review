import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../src/components/Header';

export default function ApartmentPage(){
  const router = useRouter();
  const { id } = router.query;
  const [apartment, setApartment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [overall, setOverall] = useState(5);
  const [noise, setNoise] = useState(5);
  const [maintenance, setMaintenance] = useState(5);
  const [management, setManagement] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

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

        <section style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}>
          <h2>Write a Review</h2>
          {typeof window === 'undefined' ? null : (
            !localStorage.getItem('token') ? (
              <p>Please <a href="/login">login</a> to post a review.</p>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setFormError(null);
                if (reviewText.trim().length < 50) { setFormError('Review must be at least 50 characters'); return; }
                setSubmitting(true);
                try {
                  const res = await fetch(`http://localhost:4000/api/apartments/${id}/reviews`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                      overall_rating: parseInt(overall),
                      noise_rating: parseInt(noise),
                      maintenance_rating: parseInt(maintenance),
                      management_rating: parseInt(management),
                      value_rating: parseInt(valueRating),
                      written_review: reviewText,
                      display_as_anonymous: !!anonymous
                    })
                  });
                  if (!res.ok) {
                    const err = await res.json().catch(()=>({ error: 'Submission failed' }));
                    setFormError(err.error || 'Submission failed');
                  } else {
                    setReviewText('');
                    setAnonymous(false);
                    // reload reviews
                    await load();
                  }
                } catch (err) {
                  console.error(err);
                  setFormError('Network error');
                } finally { setSubmitting(false); }
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 8 }}>
                  <label>Overall
                    <input type="number" min="1" max="5" value={overall} onChange={e=>setOverall(e.target.value)} />
                  </label>
                  <label>Noise
                    <input type="number" min="1" max="5" value={noise} onChange={e=>setNoise(e.target.value)} />
                  </label>
                  <label>Maintenance
                    <input type="number" min="1" max="5" value={maintenance} onChange={e=>setMaintenance(e.target.value)} />
                  </label>
                  <label>Management
                    <input type="number" min="1" max="5" value={management} onChange={e=>setManagement(e.target.value)} />
                  </label>
                  <label>Value
                    <input type="number" min="1" max="5" value={valueRating} onChange={e=>setValueRating(e.target.value)} />
                  </label>
                </div>
                <div>
                  <label>Review (min 50 chars)</label>
                  <textarea value={reviewText} onChange={e=>setReviewText(e.target.value)} rows={6} style={{ width: '100%' }} />
                </div>
                <div style={{ marginTop: 8 }}>
                  <label><input type="checkbox" checked={anonymous} onChange={e=>setAnonymous(e.target.checked)} /> Post anonymously</label>
                </div>
                {formError && <div style={{ color: 'red', marginTop: 8 }}>{formError}</div>}
                <div style={{ marginTop: 12 }}>
                  <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
                </div>
              </form>
            )
          )}
        </section>
      </main>
    </div>
  )
}
