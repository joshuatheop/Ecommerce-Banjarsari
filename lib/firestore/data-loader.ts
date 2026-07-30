import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, updateDoc, increment, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, Service, Business, Category, Review, ProdukItem, ServiceItem } from './types';
import { mockProducts, mockServices, mockBusinesses, mockCategories, mockReviews } from './mock-data';

// ============================================================
// Helper: convert Firestore doc → typed objects
// ============================================================

function toDate(val: any): Date {
  if (!val) return new Date();
  if (typeof val.toDate === 'function') return val.toDate();
  if (val.seconds !== undefined) return new Date(val.seconds * 1000);
  return new Date(val);
}

function toProduct(id: string, data: Record<string, unknown>): Product {
  const name = (data.product_name as string) || (data.name as string) || (data.Product_Name as string) || '';
  const description = (data.product_description as string) || (data.description as string) || (data.Full_Description as string) || '';
  const price = (data.product_price as number) ?? (data.price as number) ?? (data.Product_Price as number) ?? 0;
  const category = (data.category_id as string) || (data.category as string) || (data.Related_Product_Category_ID as string) || (data.Category as string) || '';

  let imageUrls: string[] = [];
  if (data.thumbnail_url as string) {
    imageUrls = [data.thumbnail_url as string];
  } else if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
    imageUrls = data.imageUrls as string[];
  } else if (Array.isArray(data.Gallery_Images) && data.Gallery_Images.length > 0) {
    imageUrls = data.Gallery_Images as string[];
  } else if (data.imageUrl as string) {
    imageUrls = [data.imageUrl as string];
  }

  return {
    id,
    name,
    description,
    price,
    category,
    businessId: (data.business_id as string) || (data.businessId as string) || (data.Business_ID as string) || '',
    imageUrls,
    status: data.is_active === false ? 'nonaktif' : 'aktif',
    clickCount: (data.clickCount as number) || (data.click_count as number) || 0,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),

    // PBI-11 fields (fallback/aliases)
    Gallery_Images: imageUrls,
    Product_Name: name,
    Full_Description: description,
    Product_Price: price,
    Related_Product_Category_ID: category,
    Marketplace_URL: (data.marketplace as string) || (data.Marketplace_URL as string) || '',
  };
}

function toService(id: string, data: Record<string, unknown>): Service {
  const name = (data.service_name as string) || (data.name as string) || (data.Service_Name as string) || '';
  const description = (data.service_description as string) || (data.description as string) || (data.Full_Description as string) || '';

  let imageUrls: string[] = [];
  if (data.thumbnail_url as string) {
    imageUrls = [data.thumbnail_url as string];
  } else if (Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
    imageUrls = data.imageUrls as string[];
  } else if (Array.isArray(data.Gallery_Images) && data.Gallery_Images.length > 0) {
    imageUrls = data.Gallery_Images as string[];
  } else if (data.imageUrl as string) {
    imageUrls = [data.imageUrl as string];
  }

  const minPrice = (data.minimum_price as number) ?? (data.price as number) ?? (data.minPrice as number) ?? 0;
  const maxPrice = (data.maximum_price as number) ?? (data.maxPrice as number) ?? 0;
  const priceType = (data.price_type as string) || (data.priceType as string) || 'FIXED';
  const category = (data.category_id as string) || (data.category as string) || (data.Category as string) || '';

  const priceRange = (data.priceRange as string) || (priceType === 'RANGE'
    ? `Rp ${minPrice.toLocaleString('id-ID')} – Rp ${maxPrice.toLocaleString('id-ID')}`
    : `Rp ${minPrice.toLocaleString('id-ID')}`);

  return {
    id,
    name,
    description,
    priceRange,
    price: minPrice,
    category,
    businessId: (data.business_id as string) || (data.businessId as string) || (data.Business_ID as string) || '',
    imageUrls,
    status: data.is_active === false ? 'nonaktif' : 'aktif',
    clickCount: (data.clickCount as number) || (data.click_count as number) || 0,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),

    // PBI-12 fields (fallback/aliases)
    Gallery_Images: imageUrls,
    Service_Name: name,
    Full_Description: description,
    Is_Negotiable: data.is_negotiable !== undefined ? (data.is_negotiable as boolean) : true,
    Availability_Type: (data.availability_type as string) || 'Tersedia',
    Service_Type: priceType === 'RANGE' ? 'Panggilan' : 'On-Site',
    Marketplace_URL: (data.marketplace as string) || (data.Marketplace_URL as string) || '',
  };
}

export function sanitizeCoordinates(
  rawLat?: number | null,
  rawLng?: number | null,
  idOrSeed?: string
): { latitude: number; longitude: number } {
  const BASE_LAT = -7.238328;
  const BASE_LNG = 107.836660;

  // Valid Garut region bounding box (-7.40 to -7.10 S, 107.70 to 108.00 E)
  if (
    typeof rawLat === 'number' &&
    typeof rawLng === 'number' &&
    !isNaN(rawLat) &&
    !isNaN(rawLng) &&
    rawLat >= -7.40 &&
    rawLat <= -7.10 &&
    rawLng >= 107.70 &&
    rawLng <= 108.00
  ) {
    return { latitude: rawLat, longitude: rawLng };
  }

  // Generate a unique, realistic location for each business in Desa Banjarsari, Garut
  if (idOrSeed) {
    let hash = 0;
    for (let i = 0; i < idOrSeed.length; i++) {
      hash = (hash << 5) - hash + idOrSeed.charCodeAt(i);
      hash |= 0;
    }
    const latOffset = (((Math.abs(hash) % 21) - 10) * 0.00035); // +/- ~380m spread
    const lngOffset = ((((Math.abs(hash) >> 4) % 21) - 10) * 0.00035); // +/- ~380m spread

    return {
      latitude: Number((BASE_LAT + latOffset).toFixed(6)),
      longitude: Number((BASE_LNG + lngOffset).toFixed(6)),
    };
  }

  return { latitude: BASE_LAT, longitude: BASE_LNG };
}

function toBusiness(id: string, data: Record<string, unknown>): Business {
  const name = (data.business_name as string) || (data.name as string) || '';
  const owner = (data.owner_name as string) || (data.owner as string) || '';
  const description = (data.business_description as string) || (data.description as string) || '';
  const address = (data.business_address as string) || (data.address as string) || '';
  const area = (data.area_name as string) || (data.area as string) || 'Banjarsari';
  const whatsapp = (data.business_phone as string) || (data.whatsapp_number as string) || (data.whatsapp as string) || '';
  const imageUrl = (data.business_logo_url as string) || (data.imageUrl as string) || '';

  const rawLat = (data.latitude as number) ?? (data.Latitude_Coordinate as number);
  const rawLng = (data.longitude as number) ?? (data.Longitude_Coordinate as number);
  const { latitude: lat, longitude: lng } = sanitizeCoordinates(rawLat, rawLng, id || name);

  // Auto-correct bad Firestore DB data if needed
  if (rawLat !== undefined && rawLng !== undefined && (rawLat < -7.40 || rawLat > -7.10 || rawLng < 107.70 || rawLng > 108.00)) {
    updateDoc(doc(db, 'bisnis', id), {
      latitude: lat,
      longitude: lng,
      Latitude_Coordinate: lat,
      Longitude_Coordinate: lng,
    }).catch(() => { });
  }

  return {
    id,
    name,
    owner,
    description,
    category: (data.category as string) || '',
    address,
    area,
    whatsapp,
    imageUrl,
    status: data.is_active === false ? 'nonaktif' : 'aktif',
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),

    // PBI-13 fields & v2 aliases
    instagram: (data.instagram_url as string) || (data.instagram as string) || '',
    facebook: (data.facebook_url as string) || (data.facebook as string) || '',
    socialMediaUrl: (data.instagram_url as string) || (data.facebook_url as string) || (data.socialMediaUrl as string) || '',

    business_id: id,
    business_logo_url: imageUrl,
    business_name: name,
    business_description: description,
    business_address: address,
    business_phone: whatsapp,
    slug: (data.slug as string) || '',
    marketplace: (data.marketplace as string) ?? null,
    area_name: area,
    owner_name: owner,
    is_active: data.is_active === false ? false : true,

    // Coordinates
    latitude: lat,
    longitude: lng,
    Latitude_Coordinate: lat,
    Longitude_Coordinate: lng,
  };
}

function toCategory(id: string, data: Record<string, unknown>): Category {
  const catType = (data.category_type as string) || 'PRODUCT';
  const type = catType === 'PRODUCT' ? 'product' : catType === 'SERVICE' ? 'service' : 'both';
  const catName = (data.category_name as string) || (data.name as string) || '';

  return {
    id,
    name: catName,
    slug: (data.slug as string) || '',
    icon: (data.icon as string) || '',
    type,

    category_id: id,
    category_name: catName,
    category_type: catType as any,
    is_active: data.is_active === false ? false : true,
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

export async function getProductsByBusiness(businessId: string): Promise<Product[]> {
  try {
    const q = query(
      collection(db, 'produk'),
      where('business_id', '==', businessId),
      where('is_active', '==', true)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => toProduct(d.id, d.data() as Record<string, unknown>));
    }
  } catch (error) {
    console.error('Error fetching products by business:', error);
  }
  // Fallback mock
  return mockProducts.filter((p) => p.businessId === businessId);
}

export async function getServicesByBusiness(businessId: string): Promise<Service[]> {
  try {
    const q = query(
      collection(db, 'jasa'),
      where('business_id', '==', businessId),
      where('is_active', '==', true)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => toService(d.id, d.data() as Record<string, unknown>));
    }
  } catch (error) {
    console.error('Error fetching services by business:', error);
  }
  // Fallback mock
  return mockServices.filter((s) => s.businessId === businessId);
}

// ============================================================
// ============================================================
// Review / Ulasan Functions (Persisted in Firestore & LocalStorage Fallback)
// ============================================================

const LOCAL_STORAGE_REVIEWS_KEY = 'palugada_saved_reviews';

function getLocalStoredReviews(): Review[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }))
      : [];
  } catch {
    return [];
  }
}

function saveLocalReview(review: Review) {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalStoredReviews();
    const updated = [review, ...current.filter((r) => r.id !== review.id)];
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save review in localStorage:', err);
  }
}

export async function getReviews(
  targetId: string,
  targetType: 'product' | 'service' | 'business'
): Promise<Review[]> {
  const localList = getLocalStoredReviews().filter(
    (r) => r.targetId === targetId && r.targetType === targetType
  );

  let firestoreList: Review[] = [];
  try {
    const q = query(
      collection(db, 'ulasan'),
      where('targetId', '==', targetId),
      where('targetType', '==', targetType)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      firestoreList = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          targetId: data.targetId as string,
          targetType: data.targetType as 'product' | 'service' | 'business',
          userId: data.userId as string,
          userName: data.userName as string,
          userPhoto: data.userPhoto as string | undefined,
          rating: Number(data.rating) || 5,
          comment: data.comment as string,
          createdAt: toDate(data.createdAt),
        };
      });
    }
  } catch (error) {
    console.error('Error fetching reviews from Firestore:', error);
  }

  const mockList = mockReviews.filter(
    (r) => r.targetId === targetId && r.targetType === targetType
  );

  // Combine mock, local storage, and firestore reviews (deduplicated by ID)
  const combinedMap = new Map<string, Review>();
  mockList.forEach((r) => combinedMap.set(r.id, r));
  localList.forEach((r) => combinedMap.set(r.id, r));
  firestoreList.forEach((r) => combinedMap.set(r.id, r));

  const result = Array.from(combinedMap.values());
  return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addReview(
  reviewData: Omit<Review, 'id' | 'createdAt'>
): Promise<Review> {
  const newReviewDoc = {
    ...reviewData,
    createdAt: new Date(),
  };

  let createdReview: Review;

  try {
    const docRef = await addDoc(collection(db, 'ulasan'), newReviewDoc);
    createdReview = {
      id: docRef.id,
      ...newReviewDoc,
    };
  } catch (error) {
    console.error('Error adding review to Firestore:', error);
    const mockId = 'rev_' + Date.now();
    createdReview = {
      id: mockId,
      ...newReviewDoc,
    };
    mockReviews.unshift(createdReview);
  }

  // Always persist review locally so it remains intact across page refreshes
  saveLocalReview(createdReview);

  return createdReview;
}
