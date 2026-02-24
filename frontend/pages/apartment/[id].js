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
      <main style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Apartment Info Section */}
        <section style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 32, borderRadius: 8, marginBottom: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h1 style={{ marginTop: 0, marginBottom: 16, fontSize: 32, color: '#1a1a1a' }}>🏢 {apartment.name}</h1>
          <p style={{ margin: '12px 0', fontSize: 16, color: '#666' }}>📍 {apartment.address}</p>
          <p style={{ margin: '12px 0', fontSize: 18, color: '#0066cc', fontWeight: '600' }}>💰 Rent: ${apartment.rent_min} - ${apartment.rent_max}/month</p>
        </section>

        {/* Reviews Section */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, color: '#1a1a1a', marginBottom: 24 }}>⭐ Reviews</h2>
          {reviews.length === 0 ? (
            <p style={{ color: '#999', fontSize: 16, fontStyle: 'italic' }}>No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 20, borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1a1a1a', fontSize: 15 }}>
                        {r.display_as_anonymous ? '🔒 Anonymous' : `👤 ${r.user?.username || 'User'}`}
                        {r.is_verified_student && <span style={{ marginLeft: 8, background: '#e3f2fd', color: '#0066cc', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>✓ Verified</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                  <p style={{ margin: '12px 0 0 0', color: '#333', lineHeight: 1.6 }}>{r.written_review}</p>
                  {(r.overall_rating || r.noise_rating || r.maintenance_rating || r.management_rating || r.value_rating) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0', fontSize: 12 }}>
                      <div><span style={{ color: '#999' }}>Overall:</span> <strong style={{ color: '#0066cc' }}>{r.overall_rating}/5</strong></div>
                      <div><span style={{ color: '#999' }}>Noise:</span> <strong style={{ color: '#0066cc' }}>{r.noise_rating}/5</strong></div>
                      <div><span style={{ color: '#999' }}>Maintenance:</span> <strong style={{ color: '#0066cc' }}>{r.maintenance_rating}/5</strong></div>
                      <div><span style={{ color: '#999' }}>Management:</span> <strong style={{ color: '#0066cc' }}>{r.management_rating}/5</strong></div>
                      <div><span style={{ color: '#999' }}>Value:</span> <strong style={{ color: '#0066cc' }}>{r.value_rating}/5</strong></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Write Review Section */}
        <section style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 32, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginTop: 0, marginBottom: 24, fontSize: 24, color: '#1a1a1a' }}>✍️ Share Your Experience</h2>
          {typeof window === 'undefined' ? null : (
            !localStorage.getItem('token') ? (
              <p style={{ fontSize: 16, color: '#666' }}>Please <a href="/login" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>log in</a> to post a review.</p>
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
                    await load();
                  }
                } catch (err) {
                  console.error(err);
                  setFormError('Network error');
                } finally { setSubmitting(false); }
              }}>
                {/* Rating Grid */}
                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: 'block', marginBottom: 16, fontWeight: '600', color: '#333' }}>Rate Your Experience (1-5 stars)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#666' }}>⭐ Overall</label>
                      <input type="number" min="1" max="5" value={overall} onChange={e=>setOverall(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#666' }}>🔊 Noise Level</label>
                      <input type="number" min="1" max="5" value={noise} onChange={e=>setNoise(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#666' }}>🔧 Maintenance</label>
                      <input type="number" min="1" max="5" value={maintenance} onChange={e=>setMaintenance(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#666' }}>👥 Management</label>
                      <input type="number" min="1" max="5" value={management} onChange={e=>setManagement(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#666' }}>💵 Value</label>
                      <input type="number" min="1" max="5" value={valueRating} onChange={e=>setValueRating(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>Your Review (minimum 50 characters)</label>
                  <textarea value={reviewText} onChange={e=>setReviewText(e.target.value)} rows={6} placeholder="Share details about your living experience, the community, amenities, any issues you encountered, etc." style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical' }} />
                  <p style={{ margin: '6px 0 0 0', fontSize: 12, color: '#999' }}>Characters: {reviewText.length}/50 minimum</p>
                </div>

                {/* Anonymous Checkbox */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: '500', color: '#333' }}>
                    <input type="checkbox" checked={anonymous} onChange={e=>setAnonymous(e.target.checked)} style={{ marginRight: 8, cursor: 'pointer', width: 18, height: 18 }} /> 
                    Post anonymously (your name won't be shown)
                  </label>
                </div>

                {/* Error Message */}
                {formError && <div style={{ background: '#ffebee', border: '1px solid #ffcdd2', color: '#c62828', padding: 12, borderRadius: 6, marginBottom: 20, fontSize: 14 }}>⚠️ {formError}</div>}

                {/* Submit Button */}
                <div>
                  <button type="submit" disabled={submitting || reviewText.trim().length < 50} style={{ padding: '12px 32px', background: reviewText.trim().length < 50 ? '#ccc' : '#0066cc', color: 'white', border: 'none', borderRadius: 6, fontWeight: '600', cursor: reviewText.trim().length < 50 ? 'not-allowed' : 'pointer', fontSize: 15, transition: 'background 0.2s' }} onMouseEnter={e => { if (reviewText.trim().length >= 50 && !submitting) e.target.style.background = '#0052a3'; }} onMouseLeave={e => { if (reviewText.trim().length >= 50 && !submitting) e.target.style.background = '#0066cc'; }}>
                    {submitting ? '⏳ Submitting...' : '✅ Submit Review'}
                  </button>
                </div>
              </form>
            )
          )}
        </section>
      </main>
    </div>
  )
}
