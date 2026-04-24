import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../src/components/Header';
import Link from 'next/link';

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const WalkingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="1.5"/>
    <path d="M9 9l3-3 3 3"/>
    <path d="M9 9l-2 7h10l-2-7"/>
    <path d="M7 16l-1 5M17 16l1 5"/>
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const StarIcon = ({ filled = false }) => (
  <span style={{ color: filled ? '#F5A623' : '#D5D0C8', fontSize: 20, lineHeight: 1 }}>★</span>
);

export default function ApartmentPage() {
  const router = useRouter();
  const { id } = router.query;
  const [apartment, setApartment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState({
    overall: 5,
    noise: 5,
    maintenance: 5,
    management: 5,
    value: 5,
  });
  const [reviewText, setReviewText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (id) load();
  }, [id]);

  async function load() {
    try {
      const apt = await axios.get(`http://localhost:4000/api/apartments/${id}`);
      setApartment(apt.data.apartment);
      const rev = await axios.get(`http://localhost:4000/api/apartments/${id}/reviews`);
      setReviews(rev.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  if (!apartment)
    return (
      <div>
        <Header />
        <main style={{ padding: 20, textAlign: 'center', color: 'var(--text3)' }}>
          Loading...
        </main>
      </div>
    );

  const isLoggedIn = mounted && !!localStorage.getItem('jwt_token');

  const handleRatingChange = (key, val) => {
    setRatings({ ...ratings, [key]: val });
  };

  const handleStarClick = (key, val) => {
    setRatings({ ...ratings, [key]: val });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (reviewText.trim().length < 50) {
      setFormError('Review must be at least 50 characters');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:4000/api/apartments/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
        },
        body: JSON.stringify({
          overall_rating: ratings.overall,
          noise_rating: ratings.noise,
          maintenance_rating: ratings.maintenance,
          management_rating: ratings.management,
          value_rating: ratings.value,
          written_review: reviewText,
          display_as_anonymous: anonymous,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Submission failed' }));
        setFormError(err.error || 'Submission failed');
      } else {
        setFormSuccess('✓ Review submitted! Thank you for sharing.');
        setReviewText('');
        setAnonymous(false);
        setRatings({
          overall: 5,
          noise: 5,
          maintenance: 5,
          management: 5,
          value: 5,
        });
        setTimeout(() => setFormSuccess(null), 4000);
        await load();
      }
    } catch (err) {
      console.error(err);
      setFormError('Network error while submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const getChips = () => {
    const chips = [];
    if (apartment.pet_policy?.toLowerCase().includes('yes') || apartment.pet_friendly) {
      chips.push({ label: 'Pet-friendly', variant: 'green' });
    }
    if (apartment.furnished) {
      chips.push({ label: 'Furnished', variant: 'blue' });
    }
    if (apartment.parking_available) {
      chips.push({ label: 'Parking', variant: 'default' });
    }
    return chips;
  };

  const chips = getChips();

  return (
    <>
      <Header />
      <main>
        {/* Hero Image */}
        <div style={styles.heroImg}>
          <div style={styles.heroImgLabel}>
            Photo of {apartment.name}
          </div>
        </div>

        {/* Back button */}
        <div style={styles.detailMeta}>
          <button
            onClick={() => router.back()}
            style={styles.backBtn}
          >
            <BackIcon />
            Back
          </button>
        </div>

        {/* Apartment Meta */}
        <div style={styles.detailMeta}>
          <h1 style={styles.detailName}>{apartment.name}</h1>
          <div style={styles.detailAddr}>
            <MapPinIcon />
            {apartment.address}
          </div>

          {/* Stats row */}
          <div style={styles.detailStats}>
            <div style={styles.detailPrice}>
              ${apartment.rent_min}
              <span> /mo</span>
            </div>
            <div style={styles.detailDivider} />
            <div style={styles.detailRatingBlock}>
              <div style={styles.detailRatingNum}>
                {apartment.avg_overall_rating ? apartment.avg_overall_rating.toFixed(1) : '-'}
              </div>
              <div>
                {apartment.avg_overall_rating && (
                  <>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon key={i} filled={i < Math.round(apartment.avg_overall_rating)} />
                      ))}
                    </div>
                    <div style={styles.detailReviewCount}>
                      {apartment.review_count || 0} review{apartment.review_count !== 1 ? 's' : ''}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div style={styles.detailDivider} />
            <div style={styles.detailDistance}>
              <WalkingIcon />
              {(apartment.distance_to_campus || 0).toFixed(1)} mi to campus
            </div>
          </div>

          {/* Chips */}
          {chips.length > 0 && (
            <div style={styles.detailChips}>
              {chips.map((chip, idx) => (
                <span
                  key={idx}
                  style={{
                    ...styles.chip,
                    ...(chip.variant === 'green' ? styles.chipGreen : {}),
                    ...(chip.variant === 'blue' ? styles.chipBlue : {}),
                  }}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div style={styles.detailMeta}>
          <h2 style={styles.sectionTitle}>Reviews</h2>

          {reviews.length === 0 ? (
            <p style={styles.noReviews}>
              No reviews yet. Be the first to share your experience!
            </p>
          ) : (
            <div style={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review.id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div>
                      <div style={styles.reviewAuthor}>
                        {review.display_as_anonymous ? (
                          <>
                            <LockIcon />
                            Anonymous
                          </>
                        ) : (
                          <>
                            <UserIcon />
                            {review.user?.username || 'User'}
                          </>
                        )}
                      </div>
                      {review.is_verified_student && (
                        <span style={styles.verifiedBadge}>
                          <CheckIcon />
                          Verified student
                        </span>
                      )}
                      <div style={styles.reviewStars}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <StarIcon key={i} filled={i < Math.round(review.overall_rating)} />
                        ))}
                      </div>
                    </div>
                    <div style={styles.reviewDate}>
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <p style={styles.reviewText}>{review.written_review}</p>

                  {(review.noise_rating ||
                    review.maintenance_rating ||
                    review.management_rating ||
                    review.value_rating) && (
                    <div style={styles.reviewSubRatings}>
                      {[
                        { label: 'Noise', rating: review.noise_rating },
                        { label: 'Maintenance', rating: review.maintenance_rating },
                        { label: 'Management', rating: review.management_rating },
                        { label: 'Value', rating: review.value_rating },
                      ].map((item) => (
                        <div key={item.label}>
                          <div style={styles.reviewSubLabel}>{item.label}</div>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {Array.from({ length: 5 }, (_, i) => (
                              <StarIcon
                                key={i}
                                filled={i < Math.round(item.rating)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Write Review Section */}
        <div style={styles.detailMeta}>
          <h2 style={styles.sectionTitle}>Share Your Experience</h2>

          {!isLoggedIn ? (
            <div style={styles.signInPrompt}>
              <h3 style={styles.signInPromptTitle}>Sign in to share your experience</h3>
              <p style={styles.signInPromptText}>
                Help other students find the right place by sharing your honest review.
              </p>
              <div style={styles.signInPromptButtons}>
                <Link href="/login">
                  <a style={styles.btnPrimary}>Sign in</a>
                </Link>
                <Link href="/register">
                  <a style={styles.btnOutline}>Create account</a>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
              {/* Rating Grid */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Rate Your Experience</label>
                <div style={styles.ratingRow}>
                  {[
                    ['overall', 'Overall'],
                    ['noise', 'Noise'],
                    ['maintenance', 'Maintenance'],
                    ['management', 'Management'],
                    ['value', 'Value'],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label style={styles.ratingItemLabel}>{label}</label>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => handleStarClick(key, n)}
                            style={{
                              fontSize: 20,
                              cursor: 'pointer',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              lineHeight: 1,
                              transition: 'transform 0.1s',
                              color: n <= ratings[key] ? '#F5A623' : '#D5D0C8',
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details about your living experience, the community, amenities, and anything else helpful for future students..."
                  style={styles.formTextarea}
                />
                <div style={styles.formHint}>
                  {reviewText.length >= 50 ? (
                    <>
                      <CheckIcon /> Looks good
                    </>
                  ) : (
                    `${reviewText.length}/50 characters minimum`
                  )}
                </div>
              </div>

              {/* Anonymous Toggle */}
              <div style={styles.formGroup}>
                <label style={styles.anonToggle}>
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    style={{ marginRight: 10, cursor: 'pointer' }}
                  />
                  <span>Post anonymously</span>
                </label>
              </div>

              {/* Messages */}
              {formSuccess && <div style={styles.msgSuccess}>{formSuccess}</div>}
              {formError && <div style={styles.msgError}>{formError}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || reviewText.trim().length < 50}
                style={{
                  ...styles.btnPrimary,
                  ...((submitting || reviewText.trim().length < 50) &&
                    styles.btnPrimaryDisabled),
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

const styles = {
  heroImg: {
    background: 'var(--bg2)',
    borderBottom: '1px solid var(--border)',
    height: 280,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'repeating-linear-gradient(135deg, var(--bg2), var(--bg2) 12px, #EDE9E2 12px, #EDE9E2 24px)',
  },
  heroImgLabel: {
    background: 'var(--card)',
    padding: '10px 20px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
    color: 'var(--text3)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
    fontWeight: 500,
    position: 'relative',
    zIndex: 1,
  },
  detailMeta: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '28px 24px',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text2)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 0',
    transition: 'color 0.15s',
    outline: 'none',
    marginBottom: 20,
  },
  detailName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 8,
    margin: 0,
  },
  detailAddr: {
    fontSize: 15,
    color: 'var(--text2)',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  detailStats: {
    display: 'flex',
    gap: 24,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: 600,
    color: 'var(--accent)',
  },
  detailDivider: {
    width: 1,
    height: 28,
    background: 'var(--border)',
  },
  detailRatingBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  detailRatingNum: {
    fontSize: 28,
    fontWeight: 600,
    color: 'var(--text)',
  },
  detailReviewCount: {
    fontSize: 12,
    color: 'var(--text3)',
  },
  detailDistance: {
    fontSize: 14,
    color: 'var(--text2)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  detailChips: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chip: {
    fontSize: 11,
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid var(--border)',
    color: 'var(--text2)',
    background: 'var(--bg)',
  },
  chipGreen: {
    background: 'var(--green-soft)',
    borderColor: 'var(--green)',
    color: 'var(--green)',
  },
  chipBlue: {
    background: 'var(--blue-soft)',
    borderColor: 'var(--blue)',
    color: 'var(--blue)',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 20,
    margin: 0,
  },
  reviewsList: {
    display: 'grid',
    gap: 16,
    marginBottom: 32,
  },
  reviewCard: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 20,
    boxShadow: 'var(--shadow-sm)',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  verifiedBadge: {
    background: 'var(--blue-soft)',
    color: 'var(--blue)',
    border: `1px solid var(--blue)`,
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 'var(--radius-pill)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  reviewStars: {
    display: 'flex',
    gap: 2,
    marginTop: 6,
  },
  reviewDate: {
    fontSize: 12,
    color: 'var(--text3)',
  },
  reviewText: {
    fontSize: 14,
    color: 'var(--text2)',
    lineHeight: 1.65,
    margin: '10px 0',
  },
  reviewSubRatings: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
    paddingTop: 14,
    borderTop: '1px solid var(--border)',
    marginTop: 12,
  },
  reviewSubLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  },
  noReviews: {
    color: 'var(--text3)',
    fontSize: 16,
    fontStyle: 'italic',
    margin: 0,
  },
  signInPrompt: {
    background: 'var(--accent-soft)',
    border: `1px solid oklch(88% 0.06 28)`,
    borderRadius: 'var(--radius)',
    padding: 32,
    textAlign: 'center',
  },
  signInPromptTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 8,
    margin: 0,
  },
  signInPromptText: {
    fontSize: 14,
    color: 'var(--text2)',
    marginBottom: 20,
    margin: '8px 0 20px 0',
  },
  signInPromptButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  reviewForm: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 28,
    boxShadow: 'var(--shadow-sm)',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  ratingRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  ratingItemLabel: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text2)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },
  formTextarea: {
    width: '100%',
    minHeight: 120,
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    color: 'var(--text)',
    background: 'var(--bg)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    lineHeight: 1.6,
    resize: 'vertical',
  },
  formHint: {
    fontSize: 12,
    color: 'var(--text3)',
    marginTop: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  anonToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg)',
  },
  msgSuccess: {
    background: 'var(--green-soft)',
    border: `1px solid var(--green)`,
    color: 'oklch(40% 0.14 155)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    marginBottom: 16,
  },
  msgError: {
    background: 'oklch(96% 0.04 15)',
    border: '1px solid oklch(75% 0.14 15)',
    color: 'oklch(40% 0.18 15)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    marginBottom: 16,
  },
  btnPrimary: {
    fontSize: 15,
    fontWeight: 600,
    color: 'white',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '11px 28px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  btnPrimaryDisabled: {
    background: 'var(--border2)',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  btnOutline: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text)',
    background: 'transparent',
    border: `1px solid var(--border2)`,
    borderRadius: 'var(--radius-sm)',
    padding: '11px 28px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
};
