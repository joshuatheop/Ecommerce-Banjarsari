import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Service, Business, Category } from './types';
import { mockProducts, mockServices, mockBusinesses, mockCategories } from './mock-data';

// ============================================================
// Helper: convert Firestore doc to typed object
// ============================================================

function toProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: (data.name as string) || '',
    description: (data.description as string) || '',
    price: (data.price as number) || 0,
    category: (data.category as string) || '',
    businessId: (data.businessId as string) || '',
    imageUrls: (data.imageUrls as string[]) || [],
    status: (data.status as 'aktif' | 'nonaktif') || 'aktif',
    clickCount: (data.clickCount as number) || 0,
    createdAt: (data.createdAt as Date) || new Date(),
    updatedAt: (data.updatedAt as Date) || new Date(),
  };
}

function toService(id: string, data: Record<string, unknown>): Service {
  return {
    id,
    name: (data.name as string) || '',
    description: (data.description as string) || '',
    priceRange: (data.priceRange as string) || '',
    price: (data.price as number) || 0,
    category: (data.category as string) || '',
    businessId: (data.businessId as string) || '',
    imageUrls: (data.imageUrls as string[]) || [],
    status: (data.status as 'aktif' | 'nonaktif') || 'aktif',
    clickCount: (data.clickCount as number) || 0,
    createdAt: (data.createdAt as Date) || new Date(),
    updatedAt: (data.updatedAt as Date) || new Date(),
  };
}

function toBusiness(id: string, data: Record<string, unknown>): Business {
  return {
    id,
    name: (data.name as string) || '',
    owner: (data.owner as string) || '',
    description: (data.description as string) || '',
    category: (data.category as string) || '',
    address: (data.address as string) || '',
    area: (data.area as string) || '',
    whatsapp: (data.whatsapp as string) || '',
    imageUrl: (data.imageUrl as string) || '',
    status: (data.status as 'aktif' | 'nonaktif') || 'aktif',
    createdAt: (data.createdAt as Date) || new Date(),
    updatedAt: (data.updatedAt as Date) || new Date(),
  };
}

function toCategory(id: string, data: Record<string, unknown>): Category {
  return {
    id,
    name: (data.name as string) || '',
    slug: (data.slug as string) || '',
    icon: (data.icon as string) || '',
    type: (data.type as 'product' | 'service' | 'both') || 'both',
  };
}

// ============================================================
// Fetch functions — gracefully fall back to mock data
// ============================================================

export async function getProducts(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, 'products'),
      where('status', '==', 'aktif'),
      orderBy('clickCount', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    if (snap.empty) return mockProducts;
    return snap.docs.map((doc) => toProduct(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    // Firebase not configured or offline — use mock data
    return mockProducts;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const q = query(
      collection(db, 'services'),
      where('status', '==', 'aktif'),
      orderBy('clickCount', 'desc'),
      limit(50)
    );
    const snap = await getDocs(q);
    if (snap.empty) return mockServices;
    return snap.docs.map((doc) => toService(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    return mockServices;
  }
}

export async function getBusinesses(): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'businesses'),
      where('status', '==', 'aktif'),
      orderBy('name', 'asc')
    );
    const snap = await getDocs(q);
    if (snap.empty) return mockBusinesses;
    return snap.docs.map((doc) => toBusiness(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    return mockBusinesses;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const snap = await getDocs(collection(db, 'categories'));
    if (snap.empty) return mockCategories;
    return snap.docs.map((doc) => toCategory(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    return mockCategories;
  }
}
