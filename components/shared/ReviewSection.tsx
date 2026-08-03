'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import type { ReviewItem } from '@/lib/firestore/types';
import { getReviews, addReview, calculateAverageRating } from '@/lib/firestore/reviews';

interface ReviewSectionProps {
  itemId: string;
  itemType: 'product' | 'service';
  itemName?: string;
}

const StarRating = ({ rating, size = 18, interactive = false, onRatingChange }: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (r: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(null)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: interactive ? 'pointer' : 'default',
            color: star <= displayRating ? '#FFB800' : '#D1D5DB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.1s, color 0.1s',
            transform: interactive && hoverRating === star ? 'scale(1.2)' : 'scale(1)',
          }}
          aria-label={`${star} Bintang`}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default function ReviewSection({ itemId, itemType, itemName }: ReviewSectionProps) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReviewsData = useCallback(async () => {
    if (!itemId) return;
    setLoading(true);
    const data = await getReviews(itemId, itemType);
    setReviews(data);
    setLoading(false);
  }, [itemId, itemType]);

  useEffect(() => {
    fetchReviewsData();
  }, [fetchReviewsData]);

  const { average, count } = calculateAverageRating(reviews);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!user) {
      setErrorMsg('Anda harus masuk terlebih dahulu untuk mengirim ulasan.');
      return;
    }

    if (!commentInput.trim()) {
      setErrorMsg('Silakan tulis komentar atau masukan Anda.');
      return;
    }

    try {
      setSubmitting(true);
      const userName = user.displayName || user.email?.split('@')[0] || 'Pengguna';
      const userPhoto = user.photoURL || null;

      await addReview({
        item_id: itemId,
        item_type: itemType,
        user_id: user.uid,
        user_name: userName,
        user_photo: userPhoto,
        rating: ratingInput,
        comment: commentInput.trim(),
      });

      setSuccessMsg('Terima kasih! Ulasan dan rating Anda berhasil dikirim.');
      setCommentInput('');
      setRatingInput(5);
      await fetchReviewsData();
    } catch (err: any) {
      console.error('[ReviewSection] Submit error:', err);
      const detailMsg = err?.message ? `: ${err.message}` : '.';
      setErrorMsg(`Gagal mengirim ulasan${detailMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '2px solid #111', paddingBottom: 12 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, textTransform: 'uppercase', color: '#111', margin: 0 }}>
            Ulasan & Rating Pembeli
          </h3>
          {itemName && <div style={{ fontSize: 12.5, color: '#666', marginTop: 2 }}>{itemName}</div>}
        </div>

        {/* Rating Summary Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-2)', padding: '8px 16px', borderRadius: 8, border: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
            {count > 0 ? average.toFixed(1) : '0.0'}
          </div>
          <div>
            <StarRating rating={Math.round(average)} size={16} />
            <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
              {count > 0 ? `${count} ulasan` : 'Belum ada ulasan'}
            </div>
          </div>
        </div>
      </div>

      {/* Review List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: '#888', fontSize: 14 }}>
          Memuat ulasan...
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 20px', background: '#FAFAFA', border: '1px dashed #CCC', color: '#666' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>Belum Ada Ulasan</div>
          <div style={{ fontSize: 13, marginTop: 2 }}>Jadilah yang pertama memberikan ulasan dan rating untuk {itemType === 'product' ? 'produk' : 'jasa'} ini!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map((rev) => {
            const initial = rev.user_name ? rev.user_name.charAt(0).toUpperCase() : 'U';
            const dateStr = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '';

            return (
              <div
                key={rev.review_id}
                style={{
                  background: '#fff',
                  border: '1px solid #E5E5E5',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {/* User Avatar */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                        fontSize: 14,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      {rev.user_photo ? (
                        <Image
                          src={rev.user_photo}
                          alt={rev.user_name}
                          width={36}
                          height={36}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      ) : (
                        initial
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{rev.user_name}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{dateStr}</div>
                    </div>
                  </div>

                  <StarRating rating={rev.rating} size={15} />
                </div>

                <p style={{ margin: 0, fontSize: 14, color: '#333', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Auth-gated Review Submission Form */}
      <div style={{ background: '#fff', border: '1.5px solid #111', padding: 20, marginTop: 8 }}>
        {user ? (
          /* User is LOGGED IN: Show form */
          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#111' }}>
              Tulis Ulasan & Rating Anda
            </div>

            {errorMsg && (
              <div style={{ background: '#FFF5F5', color: '#C0392B', padding: '10px 14px', border: '1px solid #FEB2B2', fontSize: 13, borderRadius: 4 }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ background: '#F0FDF4', color: '#15803D', padding: '10px 14px', border: '1px solid #86EFAC', fontSize: 13, borderRadius: 4 }}>
                {successMsg}
              </div>
            )}

            {/* Rating Star Picker */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#444', display: 'block', marginBottom: 6 }}>
                Pilih Rating (1-5 Bintang):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <StarRating rating={ratingInput} size={26} interactive onRatingChange={setRatingInput} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>
                  {ratingInput} / 5 Bintang
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label htmlFor="review-comment" style={{ fontSize: 13, fontWeight: 700, color: '#444', display: 'block', marginBottom: 6 }}>
                Komentar & Ulasan:
              </label>
              <textarea
                id="review-comment"
                rows={3}
                placeholder="Bagikan pengalaman Anda menggunakan produk/jasa ini..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid #CCC',
                  borderRadius: 0,
                  fontSize: 14,
                  fontFamily: 'var(--font-ui)',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                alignSelf: 'flex-start',
                borderRadius: 0,
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: 13,
                padding: '10px 24px',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>
        ) : (
          /* User is NOT LOGGED IN: Show login required notice */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#111', textTransform: 'uppercase' }}>
                Ingin Memberikan Rating & Ulasan?
              </div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
                Fitur rating dan komentar dikhususkan untuk pengguna yang sudah masuk (login).
              </div>
            </div>
            <Link
              href="/login"
              className="btn btn-primary btn-sm"
              style={{ borderRadius: 0, fontWeight: 700, textTransform: 'uppercase', fontSize: 13, padding: '8px 18px' }}
            >
              Masuk untuk Memberikan Rating
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
