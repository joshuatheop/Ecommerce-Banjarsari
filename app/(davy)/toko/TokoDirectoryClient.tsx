'use client';

import { useState, useMemo } from 'react';
import type { Business } from '@/lib/firestore/types';
import { mockAreas } from '@/lib/firestore/mock-data';
import { Icons } from '@/components/shared/Icons';
import BusinessCard from '@/components/shared/BusinessCard';

interface TokoDirectoryClientProps {
  businesses: Business[];
}

export default function TokoDirectoryClient({ businesses }: TokoDirectoryClientProps) {
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('semua');

  const allAreas = useMemo(() => {
    const set = new Set<string>(mockAreas);
    (businesses || []).forEach((b) => {
      if (b.area && b.area.trim()) set.add(b.area.trim());
    });
    return Array.from(set);
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.owner.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()) ||
        (b.area && b.area.toLowerCase().includes(search.toLowerCase()));

      const matchArea =
        selectedArea === 'semua' || (b.area && b.area.toLowerCase().trim() === selectedArea.toLowerCase().trim());

      return matchSearch && matchArea;
    });
  }, [businesses, search, selectedArea]);

  return (
    <div style={{ background: 'var(--bg)', padding: '40px 0 80px', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="label-eyebrow" style={{ color: 'var(--primary)', marginBottom: 6 }}>
            Profil UMKM & Penyedia Jasa
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              color: 'var(--primary)',
              margin: '0 0 12px',
            }}
          >
            Profil Usaha Desa Banjarsari
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 640, margin: 0 }}>
            Temukan berbagai pengrajin, produsen kuliner, serta penyedia jasa terpercaya di Banjarsari, Garut.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            padding: 20,
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow)',
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          {/* Search input */}
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Icons.Search
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama UMKM, pemilik, atau kata kunci..."
              style={{
                width: '100%',
                height: 44,
                paddingLeft: 42,
                paddingRight: 16,
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--line-strong)',
                background: 'var(--surface-2)',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          {/* Area Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Wilayah:
            </span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              style={{
                height: 44,
                padding: '0 16px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--line-strong)',
                background: 'var(--surface-2)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--primary)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="semua">Semua Wilayah</option>
              {allAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        {filteredBusinesses.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {filteredBusinesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--line)',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏬</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
              Tidak ada UMKM ditemukan
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Coba sesuaikan kata kunci pencarian atau filter wilayah Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
