import React from 'react';
import Link from 'next/link';
import StarRating from './StarRating';

const ApartmentCard = ({ apartment }) => {
  return (
    <Link href={`/apartment/${apartment.id}`} className="apartment-card-link">
      <div style={styles.card}>
        <div style={styles.imageArea}>
          {apartment.near_campus && <span style={styles.badge}>Near campus</span>}
        </div>
        <div style={styles.body}>
          <h3 style={styles.name}>{apartment.name}</h3>
          <p style={styles.address}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: 4}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {apartment.address}
          </p>
          <div style={styles.priceRow}>
            <span style={styles.price}>${apartment.rent_min}</span>
            <span style={styles.priceSuffix}>/mo</span>
          </div>
          <div style={styles.meta}>
            <div style={styles.rating}>
              <StarRating rating={apartment.rating_avg} size={13} />
              <span style={styles.ratingVal}>{apartment.rating_avg}</span>
            </div>
            <span style={styles.distance}>{apartment.distance_to_campus} miles</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-card)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s ease',
  },
  imageArea: {
    height: 180,
    background: 'repeating-linear-gradient(45deg, #fdfcfb, #fdfcfb 10px, #faf8f5 10px, #faf8f5 20px)',
    position: 'relative',
  },
  badge: {
    position: 'absolute', top: 12, right: 12,
    background: 'white', padding: '4px 10px', borderRadius: 100,
    fontSize: 11, fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  body: { padding: 20 },
  name: { fontSize: 18, fontWeight: 600, marginBottom: 4, color: 'var(--text)' },
  address: { fontSize: 13, color: 'var(--text3)', display: 'flex', alignItems: 'center', marginBottom: 12 },
  price: { fontSize: 17, fontWeight: 600, color: 'var(--accent)' },
  priceSuffix: { fontSize: 13, color: 'var(--text3)' },
  meta: { paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rating: { display: 'flex', alignItems: 'center', gap: 4 },
  ratingVal: { fontSize: 13, fontWeight: 600 },
  distance: { fontSize: 12, color: 'var(--text3)' }
};

export default ApartmentCard;
