import Link from 'next/link'

export default function ApartmentCard({ apartment }){
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <h3 style={{ marginTop: 0 }}>{apartment.name}</h3>
      <p style={{ margin: '6px 0' }}>{apartment.address}</p>
      <p style={{ margin: '6px 0' }}>Rent: ${apartment.rent_min} - ${apartment.rent_max}</p>
      <p style={{ margin: '6px 0' }}>Distance to campus: {apartment.distance_to_campus || 'N/A'} miles</p>
      <Link href={`/apartment/${apartment.id}`}><a>View details</a></Link>
    </div>
  )
}
