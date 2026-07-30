// ============================================================
// Type Definitions — PALUGADA Data Models (v2)
// ============================================================

// ---- Enum Types ----
export type CategoryType = 'PRODUCT' | 'SERVICE';
export type PriceType = 'FIXED' | 'STARTING_FROM' | 'RANGE' | 'CONTACT_PROVIDER';
export type AvailabilityType =
  | 'ALWAYS_AVAILABLE'
  | 'BY_SCHEDULE'
  | 'BY_REQUEST'
  | 'TEMPORARILY_UNAVAILABLE';
export type UserRole = 'admin' | 'pelanggan';
export type EventType =
  | 'BUSINESS_VIEW'
  | 'PRODUCT_VIEW'
  | 'SERVICE_VIEW'
  | 'WHATSAPP_CLICK'
  | 'MARKETPLACE_CLICK'
  | 'SHARE_CLICK';

export type ChannelClickType =
  | 'WHATSAPP_CLICK'
  | 'MARKETPLACE_CLICK'
  | 'SHARE_CLICK'
  | 'view_item'
  | 'click_wa'
  | 'click_marketplace'
  | 'salin_link';

// ---- A. Produk ----
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  businessId: string;
  imageUrls: string[];
  status: 'aktif' | 'nonaktif';
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;

  // v2 aliases
  product_id?: string;
  business_id?: string;
  category_id?: string;
  product_name?: string;
  product_description?: string | null;
  product_price?: number;
  whatsapp_number?: string | null;
  marketplace?: string | null;
  thumbnail_url?: string | null;
  is_active?: boolean;

  // PBI-11 specific / alias fields
  Gallery_Images?: string[];
  Product_Name?: string;
  Full_Description?: string;
  Product_Price?: number;
  Related_Product_Category_ID?: string;
  Marketplace_URL?: string;
}

export interface ProdukItem {
  product_id: string;           // UUID / Firestore doc ID
  business_id: string;          // FK → businesses
  category_id: string;          // FK → categories
  product_name: string;
  product_description: string | null;
  product_price: number;        // BIGINT as number
  slug: string;
  whatsapp_number: string | null;
  marketplace: string | null;
  media_sosial: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;

  // v1 aliases for backwards compatibility
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  businessId?: string;
  imageUrls?: string[];
  status?: 'aktif' | 'nonaktif';
  clickCount?: number;
}

// ---- B. Service ----
export interface Service {
  id: string;
  name: string;
  description: string;
  priceRange: string;       // e.g. "Rp 50.000 – Rp 150.000"
  price: number;            // base price for sorting
  category: string;
  businessId: string;
  imageUrls: string[];
  status: 'aktif' | 'nonaktif';
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;

  // v2 aliases
  service_id?: string;
  business_id?: string;
  category_id?: string;
  service_name?: string;
  service_description?: string | null;
  minimum_price?: number | null;
  maximum_price?: number | null;
  price_type?: PriceType;
  whatsapp_number?: string | null;
  marketplace?: string | null;
  thumbnail_url?: string | null;
  is_active?: boolean;

  // PBI-12 specific / alias fields
  Gallery_Images?: string[];
  Service_Name?: string;
  Full_Description?: string;
  Is_Negotiable?: boolean;
  Availability_Type?: 'Tersedia' | 'Penuh' | string;
  Service_Type?: 'Panggilan' | 'On-Site' | string;
  Marketplace_URL?: string;
}

export interface ServiceItem {
  service_id: string;           // UUID / Firestore doc ID
  business_id: string;          // FK → businesses
  category_id: string;          // FK → categories
  service_name: string;
  service_description: string | null;
  minimum_price: number | null;
  maximum_price: number | null;
  price_type: PriceType;
  is_negotiable: boolean;
  whatsapp_number: string | null;
  marketplace: string | null;
  availability_type: AvailabilityType;
  slug: string;
  thumbnail_url: string | null;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;

  // v1 aliases
  id?: string;
  name?: string;
  description?: string;
  priceRange?: string;
  price?: number;
  category?: string;
  businessId?: string;
  imageUrls?: string[];
  status?: 'aktif' | 'nonaktif';
  clickCount?: number;
}

// ---- C. Business ----
export interface Business {
  id: string;
  name: string;
  owner: string;
  description: string;
  category: string;
  address: string;
  area: string;
  whatsapp: string;
  imageUrl: string;
  status: 'aktif' | 'nonaktif';
  createdAt: Date;
  updatedAt: Date;

  business_id: string;
  business_logo_url: string | null;
  business_name: string;
  business_description: string | null;
  business_address: string | null;
  business_phone: string | null;
  slug: string;
  marketplace: string | null;
  area_name: string | null;
  owner_name: string | null;
  is_active: boolean;

  instagram?: string;
  facebook?: string;
  socialMediaUrl?: string;

  latitude?: number | null;
  longitude?: number | null;
  Latitude_Coordinate?: number;
  Longitude_Coordinate?: number;
  deletedAt?: Date | null;
}

// ---- D. Category ----
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  type: 'product' | 'service' | 'both';

  category_id: string;
  category_name: string;
  category_type: CategoryType;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// ---- E. Users ----
export interface User {
  user_id: string;              // UUID / Firebase Auth UID
  email: string;
  role: UserRole;
  photo_url: string | null;
  display_name: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// ---- F. Visitor Sessions ----
export interface VisitorSession {
  session_id: string;
  visitor_id: string;
  user_id: string | null;
  startedAt?: Date;
  lastActivityAt?: Date;
}

// ---- G. Analytics Events ----
export interface AnalyticsEvent {
  event_id: string;             // UUID / Firestore doc ID
  session_id: string;           // FK → visitor_sessions
  business_id: string | null;
  product_id: string | null;
  service_id: string | null;
  event_type: EventType;
  destination_url: string | null; // also used as display name in aggregation
  createdAt?: Date;
}

// ---- H. Reviews / Ulasan ----
export interface Review {
  id: string;
  targetId: string;
  targetType: 'product' | 'service' | 'business';
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// ============================================================
// Helper: format service price for display
// ============================================================
export function getServicePriceDisplay(service: ServiceItem | Service): string {
  const minPrice = (service as any).minimum_price ?? service.price ?? null;
  const maxPrice = (service as any).maximum_price ?? null;
  const pType = (service as any).price_type || 'FIXED';

  const fmt = (n: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(n);

  switch (pType) {
    case 'FIXED':
      return minPrice != null ? fmt(minPrice) : 'Hubungi Kami';
    case 'STARTING_FROM':
      return minPrice != null
        ? `Mulai ${fmt(minPrice)}`
        : 'Hubungi Kami';
    case 'RANGE':
      if (minPrice != null && maxPrice != null)
        return `${fmt(minPrice)} – ${fmt(maxPrice)}`;
      return minPrice != null ? fmt(minPrice) : 'Hubungi Kami';
    case 'CONTACT_PROVIDER':
    default:
      return 'Hubungi Kami';
  }
}

// ============================================================
// Helper: generate URL slug from string
// ============================================================
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
