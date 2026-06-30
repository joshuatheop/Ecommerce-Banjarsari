import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Ambil role user dari Firestore.
 * Mengembalikan 'admin' | 'pelanggan' | null jika tidak ditemukan.
 */
export async function getUserRole(uid: string): Promise<'admin' | 'pelanggan' | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data().role as 'admin' | 'pelanggan';
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Buat atau update dokumen user di Firestore.
 */
export async function createUserDocument(uid: string, email: string, role: 'admin' | 'pelanggan' = 'pelanggan') {
  await setDoc(doc(db, 'users', uid), {
    email,
    role,
    createdAt: serverTimestamp(),
  }, { merge: true });
}
