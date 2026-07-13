// ============================================================
// Type Definitions — PALUGADA Data Models
// ============================================================

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
}

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
}

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
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  type: 'product' | 'service' | 'both';
}
