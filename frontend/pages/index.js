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
      <main style={{ padding: 20 }}>
        <h1>Search Apartments</h1>
        <section style={{ marginBottom: 20 }}>
          <label style={{ marginRight: 8 }}>Max rent:</label>
          <input type="number" value={filters.max_rent} onChange={e => setFilters({ ...filters, max_rent: e.target.value })} />
          <label style={{ marginLeft: 12 }}><input type="checkbox" checked={filters.pet_friendly} onChange={() => toggleFilter('pet_friendly')} /> Pet friendly</label>
          <label style={{ marginLeft: 12 }}><input type="checkbox" checked={filters.furnished} onChange={() => toggleFilter('furnished')} /> Furnished</label>
        </section>

        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {apartments.map(a => <ApartmentCard key={a.id} apartment={a} />)}
          </div>
        )}
      </main>
    </div>
  )
}
