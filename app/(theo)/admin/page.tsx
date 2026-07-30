'use client';

import { useEffect, useState, useCallback } from 'react';
import { subscribeAnalytics } from '@/lib/firestore/analytics';
import { seedAnalytics as runSeed } from '@/lib/seedAnalytics';
import type { DashboardStats, EventType } from '@/lib/firestore/analytics';
import styles from './dashboard.module.css';

/* ============================================================
   Admin Dashboard — terhubung ke Firestore koleksi `analytics_events`
   PBI-18: Awareness Tracking   → totalSessions
   PBI-19: Analytics Top Access → topProducts, topBusinesses
   PBI-20: Channel Analytics    → eventTypeCounts
   ============================================================ */

// Label display untuk EventType enum
const EVENT_LABELS: Record<EventType, string> = {
  WHATSAPP_CLICK:    'Tombol WhatsApp',
  MARKETPLACE_CLICK: 'Tombol Marketplace',
  SHARE_CLICK:       'Bagikan / Salin Link',
  PRODUCT_VIEW:      'Lihat Detail Produk',
  SERVICE_VIEW:      'Lihat Detail Jasa',
  BUSINESS_VIEW:     'Lihat Profil UMKM',
};

// Warna bar per event type
const EVENT_COLORS: Record<EventType, string> = {
  WHATSAPP_CLICK:    'aqua',
  MARKETPLACE_CLICK: 'green',
  SHARE_CLICK:       'accent',
  PRODUCT_VIEW:      'muted',
  SERVICE_VIEW:      'muted',
  BUSINESS_VIEW:     'muted',
};

/* ---- FakeChart (SVG) — tetap statis untuk tren visual ---- */
function FakeChart() {
  const w = 100, h = 40;
  const dataA = [12, 18, 16, 24, 21, 28, 26, 32, 30, 35, 38, 42, 40, 48, 52, 50, 55, 58, 62, 60, 66, 70, 74, 72, 78, 82, 85, 88, 92, 94];
  const dataB = [8, 11, 9, 14, 13, 18, 17, 21, 20, 24, 26, 28, 27, 33, 36, 35, 38, 41, 44, 43, 47, 50, 53, 51, 56, 58, 61, 63, 66, 68];
  const max = Math.max(...dataA);
  const toPath = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (arr.length - 1)) * w} ${h - (v / max) * h * 0.92}`).join(' ');
  const toArea = (arr: number[]) => `${toPath(arr)} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: 200 }}>
      <defs>
        <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#05472B" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#05472B" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gb" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00C0A3" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#00C0A3" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={toArea(dataA)} fill="url(#ga)" />
      <path d={toPath(dataA)} fill="none" stroke="#05472B" strokeWidth="0.7" />
      <path d={toArea(dataB)} fill="url(#gb)" />
      <path d={toPath(dataB)} fill="none" stroke="#00C0A3" strokeWidth="0.7" />
    </svg>
  );
}

/* ---- StatCard ---- */
function StatCard({ label, value, delta, dir, loading }: {
  label: string; value: string | number; delta?: string;
  dir?: 'up' | 'down'; loading?: boolean;
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.scLabel}>{label}</div>
      <div className={`${styles.scValue} ${loading ? styles.skeleton : ''}`}>
        {loading ? '—' : value}
      </div>
      {delta && (
        <div className={`${styles.scDelta} ${dir === 'up' ? styles.deltaUp : styles.deltaDown}`}>
          {dir === 'up' ? '▲' : '▼'} {delta}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Main Page
   ============================================================ */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  // Subscribe realtime ke Firestore
  useEffect(() => {
    const unsub = subscribeAnalytics(
      (data) => { setStats(data); setLoading(false); },
      () => { setLoading(false); },
    );
    return () => unsub();
  }, []);

  // Seed data dummy
  const handleSeed = useCallback(async () => {
    setSeeding(true);
    setSeedMsg('');
    try {
      await runSeed(50);
      setSeedMsg('✓ 50 data dummy berhasil di-seed!');
    } catch (e) {
      setSeedMsg('✗ Gagal seed data. Cek Firestore rules.');
      console.error(e);
    } finally {
      setSeeding(false);
    }
  }, []);

  // Hitung max untuk progress bar channel
  const channelEntries = stats
    ? (Object.entries(stats.eventTypeCounts) as [EventType, number][])
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])
    : [];
  const maxChannel = channelEntries[0]?.[1] ?? 1;

  return (
    <div className={styles.wrapper}>

      {/* ===== HEADER ===== */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Monitoring Dashboard</h1>
        </div>
        <div className={styles.headerActions}>
          {/* Seed button — hanya untuk dev/testing */}
          <button
            id="dashboard-seed-btn"
            className={styles.btnSeed}
            onClick={handleSeed}
            disabled={seeding}
            title="Tambah 50 data dummy ke Firestore"
          >
            {seeding ? '⏳ Seeding...' : '🌱 Seed Data'}
          </button>
          <button id="dashboard-export-btn" className={styles.btnSecondary}>
            ↑ Export CSV
          </button>
        </div>
      </div>

      {seedMsg && <div className={styles.seedMsg}>{seedMsg}</div>}

      {/* ===== PBI-18: STAT CARDS ===== */}
      <div className={styles.statGrid}>
        <StatCard
          label="Total Sesi Pengunjung"
          value={stats?.totalSessions.toLocaleString('id-ID') ?? '—'}
          loading={loading}
          delta="+18,3%" dir="up"
        />
        <StatCard
          label="Total Event Tercatat"
          value={stats?.totalEvents.toLocaleString('id-ID') ?? '—'}
          loading={loading}
          delta="+34,1%" dir="up"
        />
        <StatCard
          label="Klik WhatsApp"
          value={stats?.eventTypeCounts.WHATSAPP_CLICK.toLocaleString('id-ID') ?? '—'}
          loading={loading}
          delta="+12,4%" dir="up"
        />
        <StatCard
          label="Klik Marketplace"
          value={stats?.eventTypeCounts.MARKETPLACE_CLICK.toLocaleString('id-ID') ?? '—'}
          loading={loading}
          delta="−4,2%" dir="down"
        />
      </div>

      {/* ===== CHART ROW ===== */}
      <div className={styles.chartRow}>
        {/* Line chart — tren visual */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <h4 className={styles.cardTitle}>30 hari terakhir</h4>
            </div>
            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={styles.dot} style={{ background: '#05472B' }} /> Pengunjung
              </span>
              <span className={styles.legendItem}>
                <span className={styles.dot} style={{ background: '#00C0A3' }} /> Klik Item
              </span>
            </div>
          </div>
          <FakeChart />
        </div>

        {/* PBI-20: Channel Analytics bar chart */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Aktivitas paling sering</h4>
          <div className={styles.barList}>
            {loading ? (
              [1, 2, 3, 4].map((i) => <div key={i} className={`${styles.barRow} ${styles.skeleton}`} style={{ height: 36 }} />)
            ) : channelEntries.length === 0 ? (
              <p className={styles.emptyText}>Belum ada data. Klik &quot;Seed Data&quot; untuk mencoba.</p>
            ) : (
              channelEntries.map(([ch, val]) => (
                <div key={ch} className={styles.barRow}>
                  <span className={styles.barName}>{EVENT_LABELS[ch]}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${styles[`fill_${EVENT_COLORS[ch]}`]}`}
                      style={{ width: `${(val / maxChannel) * 100}%` }}
                    />
                  </div>
                  <span className={styles.barVal}>{val}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ===== PBI-19: TOP ITEMS ROW ===== */}
      <div className={styles.topRow}>
        {/* Top Products */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>Produk Paling Populer</h4>
          <div className={styles.itemList}>
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className={`${styles.itemRow} ${styles.skeleton}`} style={{ height: 44 }} />)
            ) : stats?.topProducts.length === 0 ? (
              <p className={styles.emptyText}>Belum ada data.</p>
            ) : (
              stats?.topProducts.map((it, i) => (
                <div key={it.name} className={`${styles.itemRow} ${i > 0 ? styles.itemRowBorder : ''}`}>
                  <span className={styles.rank}>#{i + 1}</span>
                  <div
                    className={styles.itemThumb}
                    style={{ background: ['#AADCAB', '#05472B', '#00C0A3', '#013020', '#CDFF00', '#AADCAB'][i % 6] }}
                  />
                  <div className={styles.itemMeta}>
                    <div className={styles.itemName}>{it.name}</div>
                    <div className={styles.itemSub}>{it.count} klik</div>
                  </div>
                  <span className={styles.itemClicks}>{it.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Businesses */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>UMKM Terpopuler</h4>
          <div className={styles.itemList}>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => <div key={i} className={`${styles.itemRow} ${styles.skeleton}`} style={{ height: 44 }} />)
            ) : stats?.topBusinesses.length === 0 ? (
              <p className={styles.emptyText}>Belum ada data.</p>
            ) : (
              stats?.topBusinesses.map((b, i) => {
                const emojis = ['🍲', '🧺', '☕', '🎨', '🔧'];
                return (
                  <div key={b.name} className={`${styles.itemRow} ${i > 0 ? styles.itemRowBorder : ''}`}>
                    <span className={styles.rank}>#{i + 1}</span>
                    <div className={styles.bizAvatar}>{emojis[i % emojis.length]}</div>
                    <div className={styles.itemMeta}>
                      <div className={styles.itemName}>{b.name}</div>
                      <div className={styles.itemSub}>{b.count} kunjungan</div>
                    </div>
                    <button className={styles.btnGhost}>Lihat →</button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ===== EVENT LOG TABLE ===== */}
      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          <div>
            <h4 className={styles.tableTitle}>Aktivitas Pengunjung Terkini</h4>
          </div>
          <span className={styles.liveChip}>● Live</span>
        </div>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Event</th>
                <th>Produk / Jasa</th>
                <th>UMKM</th>
                <th>Tujuan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className={styles.tdCenter}>Memuat data...</td></tr>
              ) : stats?.recentEvents.length === 0 ? (
                <tr><td colSpan={5} className={styles.tdCenter}>
                  Belum ada data. Klik tombol &ldquo;Seed Data&rdquo; untuk mengisi data dummy.
                </td></tr>
              ) : (
                stats?.recentEvents.map((r) => (
                  <tr key={r.event_id}>
                    <td className={styles.tdMono}>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </td>
                    <td><span className={styles.tag}>{r.event_type}</span></td>
                    <td className={styles.tdBold}>{r.product_id || r.service_id || '—'}</td>
                    <td>{r.business_id || '—'}</td>
                    <td className={styles.tdMono}>{r.destination_url || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
