export default function StarRating({ rating, max = 5, size = 'md' }) {
  // Determine emoji sizes based on prop
  const filledStar = size === 'lg' ? '⭐' : size === 'sm' ? '✴️' : '⭐';
  const emptyStar = size === 'lg' ? '☆' : size === 'sm' ? '☆' : '☆';
  
  // Handle null/undefined ratings
  if (rating === null || rating === undefined) {
    return <span style={{ color: '#999', fontSize: size === 'sm' ? 12 : 14, fontStyle: 'italic' }}>No ratings</span>;
  }

  const roundedRating = Math.round(rating * 10) / 10; // Round to 1 decimal place

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: size === 'sm' ? 12 : size === 'lg' ? 20 : 16, letterSpacing: 2 }}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i}>{i < Math.floor(rating) ? filledStar : emptyStar}</span>
        ))}
      </span>
      <span style={{ fontSize: size === 'sm' ? 12 : 13, color: '#666', fontWeight: '500', marginLeft: 4 }}>
        {roundedRating.toFixed(1)}
      </span>
    </span>
  );
}
