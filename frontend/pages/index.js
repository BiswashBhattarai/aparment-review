import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Header from '../src/components/Header';
import ApartmentCard from '../src/components/ApartmentCard';

// Import map dynamically to avoid SSR issues with Leaflet
const ApartmentMap = dynamic(() => import('../src/components/ApartmentMap'), { ssr: false });

export default function Home() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [filters, setFilters] = useState({
    max_rent: '',
    min_bedrooms: '',
    pet_friendly: false,
    parking: false,
    furnished: false,
    sort: 'newest',
  });

  useEffect(() => {
    fetchApts();
  }, []);

  async function fetchApts() {
    setLoading(true);
    try {
      const params = { page: 1, ...filters };
      // Clean up empty filters
      if (!params.pet_friendly) delete params.pet_friendly;
      if (!params.parking) delete params.parking;
      if (!params.furnished) delete params.furnished;
      if (!params.max_rent) delete params.max_rent;
      if (!params.min_bedrooms) delete params.min_bedrooms;

      const res = await axios.get('http://localhost:4000/api/apartments', { params });
      setApartments(res.data.data || []);
    } catch (err) {
      console.error(err);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleFilter(key) {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleClearFilters() {
    setFilters({
      max_rent: '',
      min_bedrooms: '',
      pet_friendly: false,
      parking: false,
      furnished: false,
      sort: 'newest',
    });
  }

  return (
    <>
      <Header />
      <main>
        <section style={styles.hero}>
          <div style={styles.heroInner}>
            <h1 style={styles.heroTitle}>
              Find your next<br />
              <span style={styles.heroAccent}>home in Iowa City.</span>
            </h1>
            <p style={styles.heroSubtitle}>Student-verified reviews, real prices, no surprises.</p>
          </div>
        </section>

        <div style={styles.pageContent}>
          {/* Filter Bar */}
          <div style={styles.filterBar}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max Rent</label>
              <input
                type="number"
                placeholder="e.g. $1,500"
                value={filters.max_rent}
                onChange={(e) => setFilters({ ...filters, max_rent: e.target.value })}
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Min Bedrooms</label>
              <input
                type="number"
                placeholder="e.g. 2"
                min="1"
                value={filters.min_bedrooms}
                onChange={(e) => setFilters({ ...filters, min_bedrooms: e.target.value })}
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Sort by</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                style={styles.filterSelect}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Lowest price</option>
                <option value="price_desc">Highest price</option>
              </select>
            </div>

            <div style={styles.filterToggles}>
              {[
                ['pet_friendly', 'Pet-friendly'],
                ['furnished', 'Furnished'],
                ['parking', 'Parking']
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleFilter(key)}
                  style={{
                    ...styles.filterToggle,
                    ...(filters[key] ? styles.filterToggleActive : {})
                  }}
                >
                  {filters[key] && <span style={styles.filterToggleDot} />}
                  {label}
                </button>
              ))}
            </div>

            <div style={styles.filterActions}>
              <button onClick={handleClearFilters} style={styles.btnOutline}>Clear</button>
              <button onClick={fetchApts} style={styles.btnPrimary}>Search</button>
            </div>
          </div>

          {/* Map and Results Control */}
          <div style={styles.resultsBar}>
             <p style={styles.resultsCount}>
              {loading ? "Searching..." : <span><strong>{apartments.length}</strong> apartments found</span>}
            </p>
            <button onClick={() => setShowMap(!showMap)} style={styles.btnOutline}>
              {showMap ? "Hide map" : "Show map"}
            </button>
          </div>

          {showMap && apartments.length > 0 && (
            <div style={styles.mapContainer}>
              <ApartmentMap apartments={apartments} />
            </div>
          )}

          {/* Apartment Grid */}
          <div style={styles.aptGrid}>
            {apartments.map((apt) => (
              <ApartmentCard key={apt.id} apartment={apt} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

const styles = {
  hero: { background: 'var(--bg)', padding: '56px 24px 40px' },
  heroInner: { maxWidth: 1200, margin: '0 auto' },
  heroTitle: { fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: 'var(--text)', marginBottom: 12 },
  heroAccent: { color: 'var(--accent)' },
  heroSubtitle: { fontSize: 17, color: 'var(--text2)', fontWeight: 400, margin: 0 },
  pageContent: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
  filterBar: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px 24px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'flex-end',
    marginBottom: 28
  },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  filterLabel: { fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' },
  filterInput: {
    padding: '9px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    background: 'var(--bg)',
    outline: 'none',
    minWidth: 140
  },
  filterSelect: {
    padding: '9px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    background: 'var(--bg)',
    outline: 'none'
  },
  filterToggles: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-pill)',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text2)',
    cursor: 'pointer',
    background: 'var(--bg)',
    outline: 'none'
  },
  filterToggleActive: {
    background: 'var(--accent-soft)',
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
  },
  filterToggleDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'currentColor'
  },
  filterActions: { marginLeft: 'auto', display: 'flex', gap: 8 },
  btnPrimary: {
    fontSize: 14, fontWeight: 600, color: 'white', background: 'var(--accent)',
    border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 18px', cursor: 'pointer'
  },
  btnOutline: {
    fontSize: 14, fontWeight: 500, color: 'var(--text)', background: 'transparent',
    border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', padding: '8px 18px', cursor: 'pointer'
  },
  resultsBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  resultsCount: { fontSize: 14, color: 'var(--text2)', margin: 0 },
  mapContainer: { borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', height: 400, marginBottom: 32 },
  aptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 20
  }
};
