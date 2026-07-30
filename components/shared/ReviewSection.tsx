'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getReviews, addReview } from '@/lib/firestore/data-loader';
import type { Review } from '@/lib/firestore/types';
import { Icons } from './Icons';

interface ReviewSectionProps {
  targetId: string;
  targetType: 'product' | 'service' | 'business';
  targetName: string;
}

export default function ReviewSection({
  targetId,
  targetType,
  targetName,
}: ReviewSectionProps) {
  const { user, loading: authLoading } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const data = await getReviews(targetId, targetType);
        setReviews(data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [targetId, targetType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Anda harus login terlebih dahulu untuk memberi ulasan.');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('Mohon tuliskan komentar ulasan Anda.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const userName = user.displayName || user.email?.split('@')[0] || 'Pengguna Banjarsari';
      const userPhoto = user.photoURL || undefined;

      const newReview = await addReview({
        targetId,
        targetType,
        userId: user.uid,
        userName,
        userPhoto,
        rating,
        comment: comment.trim(),
      });

      setReviews((prev) => [newReview, ...prev]);
      setComment('');
      setRating(5);
      setSuccessMsg('Terima kasih! Ulasan Anda berhasil diterbitkan.');
    } catch (err) {
      console.error('Error submitting review:', err);
      setErrorMsg('Gagal mengirim ulasan. Silakan coba beberapa saat lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const totalCount = reviews.length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '5.0';

  const renderStars = (score: number, size = 16) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        style={{
          color: i < Math.round(score) ? '#FFC107' : '#E0E0E0',
          fontSize: size,
          lineHeight: 1,
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <section
      style={{
        marginTop: 40,
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        padding: 32,
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow)',
      }}
      id="ulasan-section"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 20,
          borderBottom: '2px solid var(--line)',
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            PENILAIAN & ULASAN WARGA
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(20px, 3vw, 26px)',
              fontWeight: 800,
              color: 'var(--dark)',
              margin: 0,
            }}
          >
            Ulasan untuk {targetName}
          </h2>
        </div>

        {/* Rating Summary Score Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--surface-2)',
            padding: '10px 18px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--line)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 900,
              color: 'var(--primary)',
              lineHeight: 1,
            }}
          >
            {avgRating}
          </div>
          <div>
            <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
              {renderStars(Number(avgRating), 16)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {totalCount} Ulasan Terverifikasi
            </div>
          </div>
        </div>
      </div>

      {/* FORM Ulasan (Khusus Logged In User) */}
      <div style={{ marginBottom: 36 }}>
        {authLoading ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
            Memeriksa status login...
          </div>
        ) : user ? (
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              border: '1.5px solid var(--primary)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: 'var(--dark)' }}>
                  Beri Rating & Ulasan
                </h4>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>
                  Ulasan sebagai: <strong style={{ color: 'var(--primary)' }}>{user.displayName || user.email}</strong>
                </p>
              </div>

              {/* Star Rating Picker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)' }}>Pilih Rating:</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 26,
                        cursor: 'pointer',
                        color: star <= (hoverRating || rating) ? '#FFC107' : '#CCC',
                        padding: 0,
                        transition: 'transform 0.1s, color 0.1s',
                        transform: star <= (hoverRating || rating) ? 'scale(1.15)' : 'scale(1)',
                      }}
                      title={`${star} Bintang`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', minWidth: 24 }}>
                  {hoverRating || rating} ★
                </span>
              </div>
            </div>

            {/* Comment Text Area */}
            <div style={{ marginBottom: 16 }}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bagikan pengalaman Anda tentang kualitas produk, kecepatan respon, atau layanan..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--line-strong)',
                  background: 'var(--surface)',
                  fontSize: 14,
                  fontFamily: 'var(--font-ui)',
                  color: 'var(--dark)',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Notifications */}
            {successMsg && (
              <div
                style={{
                  background: '#E8F5E9',
                  color: '#2E7D32',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Icons.Check style={{ width: 16, height: 16 }} /> {successMsg}
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  background: '#FFEBEE',
                  color: '#C62828',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Action Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{
                  height: 42,
                  padding: '0 24px',
                  fontSize: 13,
                  fontWeight: 700,
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
              </button>
            </div>
          </form>
        ) : (
          /* GUEST USER FALLBACK BANNER */
          <div
            style={{
              background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface) 100%)',
              border: '1.5px dashed var(--primary)',
              borderRadius: 'var(--radius-xl)',
              padding: 24,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'var(--white)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 20,
              }}
            >
              🔒
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                Ingin Memberikan Rating & Ulasan?
              </h4>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 480 }}>
                Fitur ulasan hanya dapat digunakan oleh warga/pengguna yang sudah masuk (login) ke sistem Katalog PALUGADA Banjarsari.
              </p>
            </div>
            <Link
              href="/login"
              className="btn btn-primary"
              style={{ height: 42, padding: '0 24px', fontSize: 13, fontWeight: 700, marginTop: 4 }}
            >
              Masuk / Login Sekarang
            </Link>
          </div>
        )}
      </div>

      {/* LIST OF REVIEWS */}
      <div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--dark)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>Daftar Ulasan</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ({totalCount})
          </span>
        </h3>

        {loading ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Memuat ulasan...
          </div>
        ) : reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.map((r) => (
              <div
                key={r.id}
                style={{
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 20,
                  border: '1px solid var(--line)',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'var(--white)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {r.userPhoto ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={r.userPhoto} alt={r.userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    r.userName.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Review Body */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
                    <h5 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>
                      {r.userName}
                    </h5>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {new Date(r.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                    {renderStars(r.rating, 14)}
                  </div>

                  {/* Comment */}
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--dark)', opacity: 0.9 }}>
                    {r.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--line)',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>
              Belum ada ulasan untuk {targetName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              Jadilah orang pertama yang memberikan pengalaman atau kesan Anda!
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
