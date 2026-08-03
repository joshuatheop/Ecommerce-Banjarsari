import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ReviewItem } from './types';

const COLLECTION = 'ulasan';

function toReviewItem(id: string, data: Record<string, unknown>): ReviewItem {
  return {
    review_id: id,
    item_id: (data.item_id as string) || '',
    item_type: (data.item_type as 'product' | 'service') || 'product',
    user_id: (data.user_id as string) || '',
    user_name: (data.user_name as string) || 'Pengguna',
    user_photo: (data.user_photo as string) ?? null,
    rating: typeof data.rating === 'number' ? data.rating : 5,
    comment: (data.comment as string) || '',
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
  };
}

export async function getReviews(itemId: string, itemType: 'product' | 'service'): Promise<ReviewItem[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('item_id', '==', itemId),
      where('item_type', '==', itemType),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toReviewItem(d.id, d.data() as Record<string, unknown>));
  } catch (err) {
    console.warn('[getReviews] Primary query error, attempting fallback without orderBy:', err);
    try {
      const fallbackQ = query(
        collection(db, COLLECTION),
        where('item_id', '==', itemId),
        where('item_type', '==', itemType)
      );
      const snap = await getDocs(fallbackQ);
      const list = snap.docs.map((d) => toReviewItem(d.id, d.data() as Record<string, unknown>));
      list.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      return list;
    } catch (fallbackErr) {
      console.error('[getReviews] Fallback query error:', fallbackErr);
      throw fallbackErr;
    }
  }
}

export async function addReview(
  payload: Omit<ReviewItem, 'review_id' | 'createdAt'>
): Promise<string> {
  const cleanData = {
    item_id: payload.item_id || '',
    item_type: payload.item_type || 'product',
    user_id: payload.user_id || '',
    user_name: payload.user_name || 'Pengguna',
    user_photo: payload.user_photo ? payload.user_photo : null,
    rating: typeof payload.rating === 'number' ? payload.rating : 5,
    comment: payload.comment || '',
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, COLLECTION), cleanData);
  return ref.id;
}

export function calculateAverageRating(reviews: ReviewItem[]): { average: number; count: number } {
  if (!reviews || reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const total = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = Math.round((total / reviews.length) * 10) / 10;
  return { average, count: reviews.length };
}
