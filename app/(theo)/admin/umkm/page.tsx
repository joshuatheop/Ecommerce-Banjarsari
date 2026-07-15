'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllBisnis, deleteBisnis } from '@/lib/firestore/bisnis';
import type { Business } from '@/lib/firestore/types';
import styles from './umkm.module.css';

export default function AdminUmkmPage() {
  const router = useRouter();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filtered, setFiltered] = useState<Business[]>([]);
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getAllBisnis();
    const visible = data.filter((b) => !b.deletedAt);
    setBusinesses(visible);
    setFiltered(visible);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter logic
  useEffect(() => {
    let result = businesses;
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (b) =>
          b.business_name.toLowerCase().includes(q) ||
          (b.owner_name ?? '').toLowerCase().includes(q) ||
          (b.business_phone ?? '').includes(q)
      );
    }
    if (filterArea) {
      result = result.filter((b) => b.area_name === filterArea);
    }
    setFiltered(result);
    setSelected([]);
  }, [search, filterArea, businesses]);

  // Distinct areas for filter dropdown
  const uniqueAreas = Array.from(
    new Set(businesses.map((b) => b.area_name).filter(Boolean))
  ) as string[];

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBisnis(deleteTarget.business_id);
      showToast(`UMKM "${deleteTarget.business_name}" berhasil dinonaktifkan.`, true);
      setDeleteTarget(null);
      await loadData();
    } catch {
      showToast('Gagal menghapus UMKM.', false);
    } finally {
      setDeleting(false);
    }
  };

  const toggleSelect = (id: string, checked: boolean) =>
    setSelected((s) => (checked ? [...s, id] : s.filter((x) => x !== id)));

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? filtered.map((b) => b.business_id) : []);

  const allChecked = filtered.length > 0 && selected.length === filtered.length;

  return (
    <div className={styles.page}>
      {/* ===== Header ===== */}
      <div className={styles.adminHeader}>
        <div>
          <div className={styles.eyebrow}>PBI-20 · CRUD</div>
          <h1 className={styles.title}>UMKM &amp; Penyedia Jasa</h1>
        </div>
        <div className={styles.headerActions}>
          <button
            id="btn-tambah-umkm"
            className={styles.btnPrimary}
            onClick={() => router.push('/admin/umkm/tambah')}
          >
            ＋ Tambah UMKM / Usaha
          </button>
        </div>
      </div>

      {/* ===== Toolbar ===== */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            id="input-search-umkm"
            className={styles.searchInput}
            type="text"
            placeholder="Cari nama usaha, pemilik, atau telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.selectFilter}
          value={filterArea}
          onChange={(e) => setFilterArea(e.target.value)}
        >
          <option value="">Semua Dusun</option>
          {uniqueAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>

        {selected.length > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.bulkCount}>{selected.length} dipilih</span>
            <button
              className={`${styles.btnGhost} ${styles.btnDanger}`}
              onClick={() => {
                const target = filtered.find((b) => selected.includes(b.business_id));
                if (target) setDeleteTarget(target);
              }}
            >
              🗑 Hapus
            </button>
          </div>
        )}
      </div>

      {/* ===== Table ===== */}
      {loading ? (
        <div className={styles.loadingWrap}>
          <div className={styles.spinner} />
          <p>Memuat data UMKM...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏢</div>
          <p className={styles.emptyTitle}>Belum ada UMKM</p>
          <p className={styles.emptyDesc}>
            {search || filterArea
              ? 'Tidak ada hasil yang sesuai filter. Coba ubah pencarian.'
              : 'Tambahkan UMKM/Penyedia Jasa baru untuk memulai.'}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) => toggleAll(e.target.checked)}
                  />
                </th>
                <th>Nama Usaha</th>
                <th>Dusun / Area</th>
                <th>No. Telepon</th>
                <th>Status</th>
                <th style={{ width: 80, textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.business_id} className={styles.tableRow}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(b.business_id)}
                      onChange={(e) => toggleSelect(b.business_id, e.target.checked)}
                    />
                  </td>
                  <td className={styles.tdProduk}>
                    <div className={styles.produkCell}>
                      {b.business_logo_url ? (
                        <img
                          className={styles.thumbnail}
                          src={b.business_logo_url}
                          alt={b.business_name}
                        />
                      ) : (
                        <div className={styles.thumbPlaceholder}>
                          {b.business_name[0]?.toUpperCase() ?? 'U'}
                        </div>
                      )}
                      <div>
                        <div className={styles.produkName}>{b.business_name}</div>
                        {b.owner_name && (
                          <div className={styles.produkDesc}>oleh {b.owner_name}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{b.area_name ?? '—'}</td>
                  <td className={styles.mono}>{b.business_phone ?? '—'}</td>
                  <td>
                    <span className={b.is_active ? styles.tagKategori : styles.tagRange}>
                      {b.is_active ? '● Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={styles.actionGroup}>
                      <button
                        id={`btn-edit-${b.business_id}`}
                        className={styles.kebab}
                        onClick={() => router.push(`/admin/umkm/${b.business_id}/edit`)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        id={`btn-hapus-${b.business_id}`}
                        className={`${styles.kebab} ${styles.kebabDanger}`}
                        onClick={() => setDeleteTarget(b)}
                        title="Hapus"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table footer */}
          <div className={styles.tableFoot}>
            <span className={styles.tableCount}>
              Menampilkan {filtered.length} dari {businesses.length} pelaku usaha
            </span>
          </div>
        </div>
      )}

      {/* ===== Delete Modal ===== */}
      {deleteTarget && (
        <div className={styles.modalBackdrop} onClick={() => !deleting && setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Nonaktifkan UMKM?</h3>
            <p className={styles.modalDesc}>
              UMKM <strong>&ldquo;{deleteTarget.business_name}&rdquo;</strong> akan dinonaktifkan.
              Semua produk dan layanan jasa milik usaha ini tidak akan tampil di katalog publik.
            </p>
            <div className={styles.modalActions}>
              <button
                id="btn-batal-hapus"
                className={styles.btnSecondary}
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                id="btn-konfirmasi-hapus"
                className={styles.btnDangerSolid}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Memproses...' : 'Ya, Nonaktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Toast ===== */}
      {toast && (
        <div className={`${styles.toast} ${toast.ok ? styles.toastOk : styles.toastErr}`}>
          {toast.ok ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  );
}
