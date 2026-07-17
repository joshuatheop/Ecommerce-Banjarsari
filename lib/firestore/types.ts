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

  // PBI-11 specific / alias fields
  Gallery_Images?: string[];
  Product_Name?: string;
  Full_Description?: string;
  Product_Price?: number;
  Related_Product_Category_ID?: string;
  Marketplace_URL?: string;
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

  // PBI-12 specific / alias fields
  Gallery_Images?: string[];
  Service_Name?: string;
  Full_Description?: string;
  Is_Negotiable?: boolean;
  Availability_Type?: 'Tersedia' | 'Penuh' | string;
  Service_Type?: 'Panggilan' | 'On-Site' | string;
  Marketplace_URL?: string;
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

  // PBI-13 specific social media fields
  instagram?: string;
  facebook?: string;
  socialMediaUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  type: 'product' | 'service' | 'both';
}
