export interface Business {
  id: string;
  name: string;
  owner: string;
  description: string;
  address: string;
  area: string;
  phone: string;
  wa: string;
  logo: string;
  lat: number;
  lng: number;
  joined: string;
  categories: string[];
  totalProducts: number;
  totalServices: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  category: string;
  price: number;
  priceRange: string;
  description: string;
  thumbColor: string;
  clickCount: number;
  hasMarketplace: boolean;
  hasWa: boolean;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  category: string;
  description: string;
  priceEstimation: string;
  isNegotiable: boolean;
  availability: string;
  serviceType: string;
  hasPortfolio: boolean;
  clickCount: number;
  thumbColor: string;
  hasMarketplace: boolean;
  hasWa: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: 'product' | 'service';
  slug: string;
  icon: string;
}
