import React from 'react';

const StarRating = ({ rating, size = 14 }) => {
  const filledStars = Math.round(rating);
  return (
    <div style={{ display: 'flex', gap: 2, fontSize: size }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star} 
          style={{ color: star <= filledStars ? 'var(--star-gold)' : 'var(--border2)' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
