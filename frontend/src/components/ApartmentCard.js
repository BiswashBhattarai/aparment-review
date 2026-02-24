import Link from 'next/link'
import StarRating from './StarRating'

export default function ApartmentCard({ apartment }){
  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', padding: 20, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}>
      <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 18, color: '#1a1a1a' }}>{apartment.name}</h3>
      <p style={{ margin: '8px 0', fontSize: 14, color: '#666' }}><strong>📍</strong> {apartment.address}</p>
      <p style={{ margin: '8px 0', fontSize: 14, color: '#0066cc', fontWeight: '600' }}>💰 ${apartment.rent_min} - ${apartment.rent_max}/mo</p>
      <div style={{ margin: '12px 0', padding: '8px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
        <StarRating rating={apartment.avg_overall_rating} size="sm" />
      </div>
      <p style={{ margin: '8px 0', fontSize: 14, color: '#666' }}>📏 {apartment.distance_to_campus || 'N/A'} miles to campus</p>
      <Link href={`/apartment/${apartment.id}`} style={{ display: 'inline-block', marginTop: 16, padding: '10px 20px', background: '#0066cc', color: 'white', borderRadius: '6px', fontWeight: '500', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#0052a3'} onMouseLeave={e => e.target.style.background = '#0066cc'}>View details →</Link>
    </div>
  )
}
