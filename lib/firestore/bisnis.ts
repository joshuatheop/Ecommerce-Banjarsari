import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Business } from './types';
import { generateSlug } from './types';

const COLLECTION = 'bisnis';

// ============================================================
// Helper: convert Firestore doc → Business
// ============================================================

function toBusiness(id: string, data: Record<string, unknown>): Business {
  const bName = (data.business_name as string) || (data.name as string) || '';
  const ownerName = (data.owner_name as string) || (data.owner as string) || '';
  const bDesc = (data.business_description as string) || (data.description as string) || '';
  const bAddr = (data.business_address as string) || (data.address as string) || '';
  const areaName = (data.area_name as string) || (data.area as string) || '';
  const bPhone = (data.business_phone as string) || (data.whatsapp as string) || '';
  const logoUrl = (data.business_logo_url as string) || (data.imageUrl as string) || null;

  return {
    id,
    name: bName,
    owner: ownerName,
    description: bDesc,
    category: (data.category as string) || '',
    address: bAddr,
    area: areaName,
    whatsapp: bPhone,
    imageUrl: logoUrl || '',
    status: data.is_active === false ? 'nonaktif' : 'aktif',
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),

    business_id:          id,
    business_logo_url:    logoUrl,
    business_name:        bName,
    business_description: bDesc,
    business_address:     bAddr,
    business_phone:       bPhone,
    slug:                 (data.slug as string) || '',
    marketplace:          (data.marketplace as string) ?? null,
    area_name:            areaName,
    latitude:             (data.latitude as number) ?? null,
    longitude:            (data.longitude as number) ?? null,
    owner_name:           ownerName,
    is_active:            (data.is_active as boolean) ?? true,
    deletedAt:            data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : null,
  };
}

// ============================================================
// READ — Semua Bisnis (untuk admin, tanpa filter status)
// ============================================================

export async function getAllBisnis(): Promise<Business[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => toBusiness(d.id, d.data() as Record<string, unknown>));
  } catch (err) {
    console.error('[getAllBisnis] Error:', err);
    return [];
  }
}

// ============================================================
// READ — Satu Bisnis by ID
// ============================================================

export async function getBisnisById(id: string): Promise<Business | null> {
  try {
    const ref = doc(db, COLLECTION, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return toBusiness(snap.id, snap.data() as Record<string, unknown>);
  } catch (err) {
    console.error('[getBisnisById] Error:', err);
    return null;
  }
}

// ============================================================
// CREATE — Tambah Bisnis Baru
// ============================================================

export type CreateBisnisPayload = Omit<Partial<Business>, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export async function createBisnis(payload: CreateBisnisPayload): Promise<string> {
  const slug = payload.slug || generateSlug(payload.business_name || payload.name || '');
  const ref = await addDoc(collection(db, COLLECTION), {
    ...payload,
    slug,
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
    deletedAt:  null,
  });
  return ref.id;
}

// ============================================================
// UPDATE — Edit Bisnis
// ============================================================

export type UpdateBisnisPayload = Partial<Omit<Business, 'business_id' | 'createdAt' | 'deletedAt'>>;

export async function updateBisnis(id: string, payload: UpdateBisnisPayload): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

// ============================================================
// DELETE — Soft delete (set deletedAt + is_active = false)
// ============================================================

export async function deleteBisnis(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    deletedAt:  serverTimestamp(),
    is_active:  false,
    updatedAt:  serverTimestamp(),
  });
}
