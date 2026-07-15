import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ProdukItem, ServiceItem, Business, Category } from './types';
import { mockProducts, mockServices, mockBusinesses, mockCategories } from './mock-data';

// ============================================================
// Helper: convert Firestore doc → typed objects
// ============================================================

function toProdukItem(id: string, data: Record<string, unknown>): ProdukItem {
  return {
    product_id:          id,
    business_id:         (data.business_id as string) || '',
    category_id:         (data.category_id as string) || '',
    product_name:        (data.product_name as string) || '',
    product_description: (data.product_description as string) ?? null,
    product_price:       (data.product_price as number) || 0,
    slug:                (data.slug as string) || '',
    whatsapp_number:     (data.whatsapp_number as string) ?? null,
    marketplace:         (data.marketplace as string) ?? null,
    thumbnail_url:       (data.thumbnail_url as string) ?? null,
    is_active:           (data.is_active as boolean) ?? true,
    createdAt:           data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt:           data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    deletedAt:           data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : null,
  };
}

function toServiceItem(id: string, data: Record<string, unknown>): ServiceItem {
  return {
    service_id:          id,
    business_id:         (data.business_id as string) || '',
    category_id:         (data.category_id as string) || '',
    service_name:        (data.service_name as string) || '',
    service_description: (data.service_description as string) ?? null,
    minimum_price:       (data.minimum_price as number) ?? null,
    maximum_price:       (data.maximum_price as number) ?? null,
    price_type:          (data.price_type as ServiceItem['price_type']) || 'CONTACT_PROVIDER',
    is_negotiable:       (data.is_negotiable as boolean) ?? false,
    whatsapp_number:     (data.whatsapp_number as string) ?? null,
    marketplace:         (data.marketplace as string) ?? null,
    availability_type:   (data.availability_type as ServiceItem['availability_type']) || 'ALWAYS_AVAILABLE',
    slug:                (data.slug as string) || '',
    thumbnail_url:       (data.thumbnail_url as string) ?? null,
    is_active:           (data.is_active as boolean) ?? true,
    createdAt:           data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt:           data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    deletedAt:           data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : null,
  };
}

function toBusiness(id: string, data: Record<string, unknown>): Business {
  return {
    business_id:          id,
    business_logo_url:    (data.business_logo_url as string) ?? null,
    business_name:        (data.business_name as string) || '',
    business_description: (data.business_description as string) ?? null,
    business_address:     (data.business_address as string) ?? null,
    business_phone:       (data.business_phone as string) ?? null,
    slug:                 (data.slug as string) || '',
    marketplace:          (data.marketplace as string) ?? null,
    area_name:            (data.area_name as string) ?? null,
    latitude:             (data.latitude as number) ?? null,
    longitude:            (data.longitude as number) ?? null,
    owner_name:           (data.owner_name as string) ?? null,
    is_active:            (data.is_active as boolean) ?? true,
    createdAt:            data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt:            data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    deletedAt:            data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : null,
  };
}

function toCategory(id: string, data: Record<string, unknown>): Category {
  return {
    category_id:   id,
    category_name: (data.category_name as string) || '',
    category_type: (data.category_type as Category['category_type']) || 'PRODUCT',
    slug:          (data.slug as string) || '',
    icon:          (data.icon as string) ?? null,
    is_active:     (data.is_active as boolean) ?? true,
    createdAt:     data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt:     data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    deletedAt:     data.deletedAt instanceof Timestamp ? data.deletedAt.toDate() : null,
  };
}

// ============================================================
// Fetch functions — gracefully fall back to mock data
// ============================================================

export async function getProducts(): Promise<ProdukItem[]> {
  try {
    const q = query(
      collection(db, 'produk'),
      where('is_active', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50),
    );
    const snap = await getDocs(q);
    if (snap.empty) return mockProducts;
    return snap.docs.map((doc) => toProdukItem(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    return mockProducts;
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const q = query(
      collection(db, 'jasa'),
      where('is_active', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50),
    );
    const snap = await getDocs(q);
    if (snap.empty) return mockServices;
    return snap.docs.map((doc) => toServiceItem(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    return mockServices;
  }
}

export async function getBusinesses(): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'bisnis'),
      where('is_active', '==', true),
      orderBy('business_name', 'asc'),
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
    const snap = await getDocs(
      query(collection(db, 'kategori'), where('is_active', '==', true))
    );
    if (snap.empty) return mockCategories;
    return snap.docs.map((doc) => toCategory(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    return mockCategories;
  }
}
