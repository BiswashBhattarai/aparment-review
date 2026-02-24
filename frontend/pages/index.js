import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../src/components/Header';
import ApartmentCard from '../src/components/ApartmentCard';

export default function Home() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ max_rent: '', min_bedrooms: '', pet_friendly: false, parking: false, furnished: false });

  useEffect(() => { fetchApts(); }, []);

  async function fetchApts(page=1) {
    setLoading(true);
    try {
      const params = { page, ...filters };
      // convert booleans to strings expected by backend
      if (!params.pet_friendly) delete params.pet_friendly;
      const res = await axios.get('http://localhost:4000/api/apartments', { params });
      setApartments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  function toggleFilter(key) { setFilters({ ...filters, [key]: !filters[key] }); }

  return (
    <div className="container">
      <Header />
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: 32, color: '#1a1a1a' }}>🏠 Find Your Next Apartment</h1>
          <p style={{ margin: 0, fontSize: 16, color: '#666' }}>Filter by rent, amenities, and more</p>
        </div>
        
        <section style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 24, borderRadius: 8, marginBottom: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginTop: 0, marginBottom: 20, fontSize: 18, color: '#1a1a1a' }}>Filters</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>💰 Max Rent</label>
              <input 
                type="number" 
                placeholder="e.g., 1500"
                value={filters.max_rent} 
                onChange={e => setFilters({ ...filters, max_rent: e.target.value })} 
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: 12, cursor: 'pointer', fontWeight: '500', color: '#333' }}>
                <input type="checkbox" checked={filters.pet_friendly} onChange={() => toggleFilter('pet_friendly')} style={{ marginRight: 8, cursor: 'pointer', width: 18, height: 18 }} /> 
                🐶 Pet friendly
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: '500', color: '#333' }}>
                <input type="checkbox" checked={filters.furnished} onChange={() => toggleFilter('furnished')} style={{ marginRight: 8, cursor: 'pointer', width: 18, height: 18 }} /> 
                🛋️ Furnished
              </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => fetchApts(1)} 
                style={{ padding: '10px 24px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 6, fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s', fontSize: 14 }}
                onMouseEnter={e => e.target.style.background = '#0052a3'}
                onMouseLeave={e => e.target.style.background = '#0066cc'}
              >
                🔍 Apply Filters
              </button>
            </div>
          </div>
        </section>

        {loading ? <p style={{ textAlign: 'center', color: '#666', fontSize: 16 }}>Loading apartments...</p> : (
          <div>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Found <strong>{apartments.length}</strong> apartment{apartments.length !== 1 ? 's' : ''}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {apartments.map(a => <ApartmentCard key={a.id} apartment={a} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
