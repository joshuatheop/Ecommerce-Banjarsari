'use client';

import { useState } from 'react';
import { Icons } from './Icons';

interface ShareModalProps {
  title: string;
  itemName: string;
  businessName: string;
  priceFormatted: string;
  url?: string;
  itemType?: 'produk' | 'layanan' | 'toko';
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({
  title,
  itemName,
  businessName,
  priceFormatted,
  url,
  itemType = 'produk',
  isOpen,
  onClose,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : (url || '');

  // Formatted caption requested by user:
  // "Cek produk [Nama Produk] dari [Nama UMKM] di PALUGADA! Harganya cuma [Harga]. Klik di sini: [URL]"
  const caption = itemType === 'toko'
    ? `Cek profil UMKM ${businessName} di PALUGADA! Temukan berbagai produk dan layanan unggulan Banjarsari. Klik di sini: ${shareUrl}`
    : `Cek ${itemType} ${itemName} dari ${businessName} di PALUGADA! Harganya cuma ${priceFormatted}. Klik di sini: ${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCopyCaption = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(caption);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  // Social Share URLs
  const waUrl = `https://wa.me/?text=${encodeURIComponent(caption)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(caption)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(caption)}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(1, 48, 32, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid var(--line-strong)',
          overflow: 'hidden',
          animation: 'slideUp 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--secondary)',
                color: 'var(--primary)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Icons.Share style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                {title || 'Bagikan Ke Medsos'}
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                Fitur Auto-Caption & Copy Link PALUGADA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: 4,
            }}
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Toast Banner */}
          {copied && (
            <div
              style={{
                background: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb',
                padding: '10px 16px',
                borderRadius: 'var(--radius)',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                animation: 'fadeIn 0.2s ease',
              }}
            >
              <Icons.Check style={{ width: 18, height: 18, color: '#155724' }} />
              Link / Caption berhasil disalin ke clipboard!
            </div>
          )}

          {/* Auto Caption Preview Box */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginBottom: 6,
                textTransform: 'uppercase',
              }}
            >
              Preview Auto-Caption:
            </label>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px dashed var(--line-strong)',
                borderRadius: 'var(--radius-lg)',
                padding: 14,
                fontSize: 13,
                lineHeight: 1.5,
                color: 'var(--dark)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {caption}
            </div>
          </div>

          {/* Copy Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <button
              onClick={handleCopyLink}
              className="btn btn-primary"
              style={{ height: 42, fontSize: 13, justifyContent: 'center' }}
            >
              <Icons.Link style={{ width: 16, height: 16 }} /> {copied ? 'Tersalin!' : 'Salin Link 1-Klik'}
            </button>
            <button
              onClick={handleCopyCaption}
              className="btn btn-secondary"
              style={{ height: 42, fontSize: 13, justifyContent: 'center' }}
            >
              <Icons.FileText style={{ width: 16, height: 16 }} /> Salin Teks Caption
            </button>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '16px 0' }} />

          {/* Direct Social Media Sharing Buttons */}
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase' }}>
            Bagikan Langsung ke Aplikasi:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 8px',
                background: '#25D366',
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 600,
                transition: 'transform 0.15s',
              }}
            >
              <Icons.Whatsapp style={{ width: 22, height: 22 }} />
              WhatsApp
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 8px',
                background: '#1DA1F2',
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 600,
                transition: 'transform 0.15s',
              }}
            >
              <Icons.Twitter style={{ width: 22, height: 22 }} />
              Twitter / X
            </a>

            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 8px',
                background: '#1877F2',
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 600,
                transition: 'transform 0.15s',
              }}
            >
              <Icons.Facebook style={{ width: 22, height: 22 }} />
              Facebook
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 8px',
                background: '#0088cc',
                color: '#fff',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 600,
                transition: 'transform 0.15s',
              }}
            >
              <Icons.Send style={{ width: 22, height: 22 }} />
              Telegram
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
