import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const STORAGE_KEY_PRODUCTS = 'banjarsari_fav_products';
const STORAGE_KEY_SERVICES = 'banjarsari_fav_services';

// Local Storage Helpers
export function getFavoriteProductIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getFavoriteServiceIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERVICES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save Local Storage
function setFavoriteProductIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save product favorites to localStorage:', err);
  }
}

function setFavoriteServiceIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save service favorites to localStorage:', err);
  }
}

// Toggle Product Favorite
export async function toggleProductFavoriteInFirestore(productId: string): Promise<{ isFavorited: boolean; delta: number }> {
  const currentFavs = getFavoriteProductIds();
  const index = currentFavs.indexOf(productId);
  const isFavorited = index !== -1;

  let newFavs: string[];
  let delta: number;

  if (isFavorited) {
    newFavs = currentFavs.filter((id) => id !== productId);
    delta = -1;
  } else {
    newFavs = [...currentFavs, productId];
    delta = 1;
  }

  setFavoriteProductIds(newFavs);

  // Sync to Firestore
  try {
    const ref = doc(db, 'produk', productId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        like_count: increment(delta),
      });
    }
  } catch (err) {
    console.warn('[toggleProductFavoriteInFirestore] Firestore update failed (using local fallback):', err);
  }

  return { isFavorited: !isFavorited, delta };
}

// Toggle Service Favorite
export async function toggleServiceFavoriteInFirestore(serviceId: string): Promise<{ isFavorited: boolean; delta: number }> {
  const currentFavs = getFavoriteServiceIds();
  const index = currentFavs.indexOf(serviceId);
  const isFavorited = index !== -1;

  let newFavs: string[];
  let delta: number;

  if (isFavorited) {
    newFavs = currentFavs.filter((id) => id !== serviceId);
    delta = -1;
  } else {
    newFavs = [...currentFavs, serviceId];
    delta = 1;
  }

  setFavoriteServiceIds(newFavs);

  // Sync to Firestore
  try {
    const ref = doc(db, 'jasa', serviceId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        like_count: increment(delta),
      });
    }
  } catch (err) {
    console.warn('[toggleServiceFavoriteInFirestore] Firestore update failed (using local fallback):', err);
  }

  return { isFavorited: !isFavorited, delta };
}
