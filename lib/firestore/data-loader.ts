import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Product, Service, Category, Business } from "./types";
import {
  mockProducts,
  mockServices,
  mockCategories,
  mockBusinesses
} from "./mock-data";

// Helper to check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !!apiKey && apiKey !== "your-api-key-here" && apiKey.trim() !== "";
};

// ─── Field Mappers ────────────────────────────────────────────────────────────
// migrate.js stores fields in snake_case matching PBI specs.
// These mappers convert Firestore docs → TypeScript types (camelCase).
//
// PBI-04 Firestore field names:
//   item_type           → itemType
//   product_category_id → categoryId  (produk)
//   service_category_id → categoryId  (jasa)
//   area_id             → area        (toko)
//   price_range         → priceRange  (Enum: <50rb | 50-100rb | >100rb)
//   has_marketplace_link→ hasMarketplaceLink (Boolean)
//   availability_type   → availability (Enum: Setiap Hari | Janjian)
//   has_portfolio       → hasPortfolio (Boolean)
//   is_negotiable       → isNegotiable (Boolean)
//   sort_by             → UI-only, not stored in DB

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBusiness(id: string, data: Record<string, any>): Business {
  return {
    id,
    name:          data.business_name        ?? data.name          ?? "",
    owner:         data.owner_name           ?? data.owner         ?? "",
    description:   data.business_description ?? data.description   ?? "",
    address:       data.business_address     ?? data.address       ?? "",
    // PBI-04: area_id (String: Dusun/RW)
    area:          data.area_id              ?? data.area          ?? "",
    phone:         data.business_phone       ?? data.phone         ?? "",
    wa:            data.business_phone       ?? data.wa            ?? "",
    logo:          data.business_logo_url    ?? data.logo          ?? "",
    lat:           data.lat                  ?? 0,
    lng:           data.lng                  ?? 0,
    joined:        data.joined               ?? "",
    categories:    data.categories           ?? [],
    totalProducts: data.totalProducts        ?? 0,
    totalServices: data.totalServices        ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(id: string, data: Record<string, any>): Product {
  return {
    id,
    // PBI-04: item_type Enum product/service
    itemType:           "product",
    businessId:         data.business_id         ?? data.businessId         ?? "",
    // PBI-04: product_category_id (UUID/Int)
    categoryId:         data.product_category_id ?? data.categoryId         ?? "",
    category:           data.category_name       ?? data.category           ?? "",
    name:               data.product_name        ?? data.name               ?? "",
    price:              data.product_price       ?? data.price              ?? 0,
    // PBI-04: price_range Enum <50rb | 50-100rb | >100rb
    priceRange:         data.price_range         ?? data.priceRange         ?? "<50rb",
    description:        data.product_description ?? data.description        ?? "",
    thumbColor:         data.thumbColor          ?? data.thumb_color        ?? "#05472B",
    clickCount:         data.click_count_log     ?? data.clickCount         ?? 0,
    // PBI-04: has_marketplace_link Boolean
    hasMarketplaceLink: data.has_marketplace_link ?? data.hasMarketplaceLink ?? false,
    hasWa:              data.has_wa               ?? data.hasWa              ?? false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapService(id: string, data: Record<string, any>): Service {
  return {
    id,
    // PBI-04: item_type Enum product/service
    itemType:           "service",
    businessId:         data.business_id          ?? data.businessId         ?? "",
    // PBI-04: service_category_id (UUID/Int)
    categoryId:         data.service_category_id  ?? data.categoryId         ?? "",
    category:           data.category_name        ?? data.category           ?? "",
    name:               data.service_name         ?? data.name               ?? "",
    description:        data.service_description  ?? data.description        ?? "",
    priceEstimation:    data.price_estimation      ?? data.priceEstimation    ?? "",
    // PBI-04: is_negotiable Boolean
    isNegotiable:       data.is_negotiable         ?? data.isNegotiable       ?? false,
    // PBI-04: availability_type Enum Setiap_Hari | Janjian
    availability:       data.availability_type     ?? data.availability       ?? "Setiap Hari",
    serviceType:        data.service_type          ?? data.serviceType        ?? "",
    // PBI-04: has_portfolio Boolean
    hasPortfolio:       data.has_portfolio         ?? data.hasPortfolio       ?? false,
    clickCount:         data.click_count_log       ?? data.clickCount         ?? 0,
    thumbColor:         data.thumbColor            ?? data.thumb_color        ?? "#00C0A3",
    // PBI-04: has_marketplace_link Boolean
    hasMarketplaceLink: data.has_marketplace_link  ?? data.hasMarketplaceLink ?? false,
    hasWa:              data.has_wa                ?? data.hasWa              ?? false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategory(id: string, data: Record<string, any>): Category {
  return {
    id,
    name: data.category_name ?? data.name ?? "",
    type: data.category_type ?? data.type ?? "product",
    slug: data.slug ?? "",
    icon: data.icon ?? "",
  };
}

// ─── Exported Functions ───────────────────────────────────────────────────────

export async function getBusinesses(): Promise<Business[]> {
  try {
    if (!isFirebaseConfigured()) return mockBusinesses;
    const querySnapshot = await getDocs(collection(db, "toko"));
    if (querySnapshot.empty) return mockBusinesses;
    return querySnapshot.docs.map(d => mapBusiness(d.id, d.data()));
  } catch (error) {
    console.warn("Firebase getBusinesses failed, using mock data:", error);
    return mockBusinesses;
  }
}

export async function getBusinessById(id: string): Promise<Business | null> {
  try {
    if (!isFirebaseConfigured()) return mockBusinesses.find(b => b.id === id) || null;
    const docRef = doc(db, "toko", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return mockBusinesses.find(b => b.id === id) || null;
    return mapBusiness(docSnap.id, docSnap.data());
  } catch (error) {
    console.warn("Firebase getBusinessById failed, using mock data:", error);
    return mockBusinesses.find(b => b.id === id) || null;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    if (!isFirebaseConfigured()) return mockProducts;
    const querySnapshot = await getDocs(collection(db, "produk"));
    if (querySnapshot.empty) return mockProducts;
    return querySnapshot.docs.map(d => mapProduct(d.id, d.data()));
  } catch (error) {
    console.warn("Firebase getProducts failed, using mock data:", error);
    return mockProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    if (!isFirebaseConfigured()) return mockProducts.find(p => p.id === id) || null;
    const docRef = doc(db, "produk", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return mockProducts.find(p => p.id === id) || null;
    return mapProduct(docSnap.id, docSnap.data());
  } catch (error) {
    console.warn("Firebase getProductById failed, using mock data:", error);
    return mockProducts.find(p => p.id === id) || null;
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    if (!isFirebaseConfigured()) return mockServices;
    const querySnapshot = await getDocs(collection(db, "jasa"));
    if (querySnapshot.empty) return mockServices;
    return querySnapshot.docs.map(d => mapService(d.id, d.data()));
  } catch (error) {
    console.warn("Firebase getServices failed, using mock data:", error);
    return mockServices;
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    if (!isFirebaseConfigured()) return mockServices.find(s => s.id === id) || null;
    const docRef = doc(db, "jasa", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return mockServices.find(s => s.id === id) || null;
    return mapService(docSnap.id, docSnap.data());
  } catch (error) {
    console.warn("Firebase getServiceById failed, using mock data:", error);
    return mockServices.find(s => s.id === id) || null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    if (!isFirebaseConfigured()) return mockCategories;
    const querySnapshot = await getDocs(collection(db, "kategori"));
    if (querySnapshot.empty) return mockCategories;
    return querySnapshot.docs.map(d => mapCategory(d.id, d.data()));
  } catch (error) {
    console.warn("Firebase getCategories failed, using mock data:", error);
    return mockCategories;
  }
}
