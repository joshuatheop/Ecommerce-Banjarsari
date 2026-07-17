import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Service, Business, Category } from './types';
import { mockProducts, mockServices, mockBusinesses, mockCategories } from './mock-data';

// ============================================================
// Helper: convert Firestore doc to typed object
// ============================================================

function toDate(val: any): Date {
  if (!val) return new Date();
  if (typeof val.toDate === 'function') return val.toDate();
  if (val.seconds !== undefined) return new Date(val.seconds * 1000);
  return new Date(val);
}

function toProduct(id: string, data: Record<string, unknown>): Product {
  const name = (data.product_name as string) || '';
  const description = (data.product_description as string) || '';
  const price = (data.product_price as number) || 0;
  const category = (data.category_id as string) || '';
  const imageUrls = (data.thumbnail_url as string) ? [data.thumbnail_url as string] : [];

  return {
    id,
    name,
    description,
    price,
    category,
    businessId: (data.business_id as string) || '',
    imageUrls,
    status: data.is_active === false ? 'nonaktif' : 'aktif',
    clickCount: (data.clickCount as number) || 0,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),

    // PBI-11 fields (fallback/aliases)
    Gallery_Images: imageUrls,
    Product_Name: name,
    Full_Description: description,
    Product_Price: price,
    Related_Product_Category_ID: category,
    Marketplace_URL: (data.marketplace as string) || '',
  };
}

function toService(id: string, data: Record<string, unknown>): Service {
  const name = (data.service_name as string) || '';
  const description = (data.service_description as string) || '';
  const imageUrls = (data.thumbnail_url as string) ? [data.thumbnail_url as string] : [];
  const minPrice = (data.minimum_price as number) || 0;
  const maxPrice = (data.maximum_price as number) || 0;
  const priceType = (data.price_type as string) || 'FIXED';

  const priceRange = priceType === 'RANGE'
    ? `Rp ${minPrice.toLocaleString('id-ID')} – Rp ${maxPrice.toLocaleString('id-ID')}`
    : `Rp ${minPrice.toLocaleString('id-ID')}`;

  return {
    id,
    name,
    description,
    priceRange,
    price: minPrice,
    category: (data.category_id as string) || '',
    businessId: (data.business_id as string) || '',
    imageUrls,
    status: data.is_active === false ? 'nonaktif' : 'aktif',
    clickCount: (data.clickCount as number) || 0,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),

    // PBI-12 fields (fallback/aliases)
    Gallery_Images: imageUrls,
    Service_Name: name,
    Full_Description: description,
    Is_Negotiable: data.is_negotiable !== undefined ? (data.is_negotiable as boolean) : true,
    Availability_Type: (data.availability_type as string) || 'Tersedia',
    Service_Type: priceType === 'RANGE' ? 'Panggilan' : 'On-Site',
    Marketplace_URL: (data.marketplace as string) || '',
  };
}

function toBusiness(id: string, data: Record<string, unknown>): Business {
  const name = (data.business_name as string) || '';
  const owner = (data.owner_name as string) || '';
  const description = (data.business_description as string) || '';
  const address = (data.business_address as string) || '';
  const area = (data.area_name as string) || 'Banjarsari';
  const whatsapp = (data.business_phone as string) || (data.whatsapp_number as string) || '';
  const imageUrl = (data.business_logo_url as string) || '';

  return {
    id,
    name,
    owner,
    description,
    category: '',
    address,
    area,
    whatsapp,
    imageUrl,
    status: data.is_active === false ? 'nonaktif' : 'aktif',
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),

    // PBI-13 fields (fallback/aliases)
    instagram: (data.instagram_url as string) || '',
    facebook: (data.facebook_url as string) || '',
    socialMediaUrl: (data.instagram_url as string) || (data.facebook_url as string) || '',
  };
}

function toCategory(id: string, data: Record<string, unknown>): Category {
  const catType = (data.category_type as string) || 'PRODUCT';
  const type = catType === 'PRODUCT' ? 'product' : catType === 'SERVICE' ? 'service' : 'both';

  return {
    id,
    name: (data.category_name as string) || '',
    slug: (data.slug as string) || '',
    icon: (data.icon as string) || '',
    type,
  };
}

// ============================================================
// Fetch functions — gracefully fall back to mock data
// ============================================================

export async function getProducts(): Promise<Product[]> {
  try {
    const q = query(
      collection(db, 'produk'),
      where('is_active', '==', true),
      limit(50)
    );
    const snap = await getDocs(q);
    if (snap.empty) return mockProducts;
    return snap.docs.map((doc) => toProduct(doc.id, doc.data() as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching products:', error);
    return mockProducts;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const q = query(
      collection(db, 'jasa'),
      where('is_active', '==', true),
      limit(50)
    );
    const snap = await getDocs(q);
    if (snap.empty) return mockServices;
    return snap.docs.map((doc) => toService(doc.id, doc.data() as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching services:', error);
    return mockServices;
  }
}

export async function getBusinesses(): Promise<Business[]> {
  try {
    const q = query(
      collection(db, 'bisnis'),
      where('is_active', '==', true)
    );
    const snap = await getDocs(q);
    if (snap.empty) return mockBusinesses;
    return snap.docs.map((doc) => toBusiness(doc.id, doc.data() as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return mockBusinesses;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const snap = await getDocs(collection(db, 'kategori'));
    if (snap.empty) return mockCategories;
    return snap.docs.map((doc) => toCategory(doc.id, doc.data() as Record<string, unknown>));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return mockCategories;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'produk', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return toProduct(docSnap.id, docSnap.data() as Record<string, unknown>);
    }
  } catch (error) {
    console.error('Error fetching product from Firestore:', error);
  }
  // Fallback to mock data
  const mock = mockProducts.find((p) => p.id === id);
  return mock ? toProduct(mock.id, mock as unknown as Record<string, unknown>) : null;
}

export async function getService(id: string): Promise<Service | null> {
  try {
    const docRef = doc(db, 'jasa', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return toService(docSnap.id, docSnap.data() as Record<string, unknown>);
    }
  } catch (error) {
    console.error('Error fetching service from Firestore:', error);
  }
  // Fallback to mock data
  const mock = mockServices.find((s) => s.id === id);
  return mock ? toService(mock.id, mock as unknown as Record<string, unknown>) : null;
}

export async function getBusiness(id: string): Promise<Business | null> {
  try {
    const docRef = doc(db, 'bisnis', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return toBusiness(docSnap.id, docSnap.data() as Record<string, unknown>);
    }
  } catch (error) {
    console.error('Error fetching business from Firestore:', error);
  }
  // Fallback to mock data
  const mock = mockBusinesses.find((b) => b.id === id);
  return mock ? toBusiness(mock.id, mock as unknown as Record<string, unknown>) : null;
}

export async function incrementProductClicks(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'produk', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        clickCount: increment(1)
      });
    }
  } catch (error) {
    console.error('Error incrementing product clicks:', error);
  }
}

export async function incrementServiceClicks(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'jasa', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        clickCount: increment(1)
      });
    }
  } catch (error) {
    console.error('Error incrementing service clicks:', error);
  }
}

