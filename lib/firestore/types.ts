export interface Business {
  id: string;
  name: string;
  owner: string;
  description: string;
  address: string;
  /** area_id: Dusun/RW string — PBI-04 area filter */
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
  /** business_id: FK ke koleksi toko */
  businessId: string;
  /** item_type: Enum product/service — PBI-04 */
  itemType: "product";
  name: string;
  /** product_category_id: ID dari koleksi kategori — PBI-04 */
  categoryId: string;
  /** Nama kategori (diresolved dari categoryId) */
  category: string;
  price: number;
  /** price_range: Enum <50rb | 50-100rb | >100rb — PBI-04 */
  priceRange: "<50rb" | "50-100rb" | ">100rb";
  description: string;
  thumbColor: string;
  clickCount: number;
  /** has_marketplace_link: Boolean — PBI-04 */
  hasMarketplaceLink: boolean;
  hasWa: boolean;
}

export interface Service {
  id: string;
  /** business_id: FK ke koleksi toko */
  businessId: string;
  /** item_type: Enum product/service — PBI-04 */
  itemType: "service";
  name: string;
  /** service_category_id: ID dari koleksi kategori — PBI-04 */
  categoryId: string;
  /** Nama kategori (diresolved dari categoryId) */
  category: string;
  description: string;
  priceEstimation: string;
  /** is_negotiable: Boolean — PBI-04 */
  isNegotiable: boolean;
  /** availability_type: Enum Setiap_Hari | Janjian — PBI-04 */
  availability: "Setiap Hari" | "Janjian";
  serviceType: string;
  /** has_portfolio: Boolean — PBI-04 */
  hasPortfolio: boolean;
  clickCount: number;
  thumbColor: string;
  /** has_marketplace_link: Boolean — PBI-04 */
  hasMarketplaceLink: boolean;
  hasWa: boolean;
}

export interface Category {
  id: string;
  name: string;
  /** category_type: Enum product/service */
  type: "product" | "service";
  slug: string;
  icon: string;
}
