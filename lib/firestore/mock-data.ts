import type { Product, Service, Business, Category } from './types';

// ============================================================
// Mock Data — untuk fallback / development tanpa Firebase
// ============================================================

export const mockAreas = [
  'Banjarsari Utara',
  'Banjarsari Selatan',
  'Banjarsari Barat',
  'Banjarsari Timur',
  'Tengah',
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Makanan & Minuman', slug: 'makanan', icon: '🍚', type: 'product' },
  { id: '2', name: 'Kerajinan Tangan', slug: 'kerajinan', icon: '🧺', type: 'product' },
  { id: '3', name: 'Camilan', slug: 'camilan', icon: '🥨', type: 'product' },
  { id: '4', name: 'Pakaian & Fashion', slug: 'fashion', icon: '👗', type: 'product' },
  { id: '5', name: 'Jasa Reparasi', slug: 'reparasi-elektronik', icon: '🔧', type: 'service' },
  { id: '6', name: 'Kecantikan', slug: 'kecantikan', icon: '💇', type: 'service' },
  { id: '7', name: 'Pendidikan', slug: 'pendidikan', icon: '📚', type: 'service' },
  { id: '8', name: 'Pertanian', slug: 'pertanian', icon: '🌱', type: 'product' },
];

export const mockBusinesses: Business[] = [
  {
    id: 'b1',
    name: 'Batik Sari Asih',
    owner: 'Ibu Sri Wahyuni',
    description: 'Pengrajin batik tulis tradisional khas Banjarsari dengan motif unik warisan leluhur.',
    category: 'kerajinan',
    address: 'Jl. Melati No. 12, Banjarsari',
    area: 'Banjarsari Utara',
    whatsapp: '628123456789',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    status: 'aktif',
    createdAt: new Date(),
    updatedAt: new Date(),
    instagram: 'batiksari_banjarsari',
    facebook: 'Batik Sari Asih',
    socialMediaUrl: 'https://instagram.com/batiksari_banjarsari',
  },
  {
    id: 'b2',
    name: 'Dapur Mak Inah',
    owner: 'Ibu Suminah',
    description: 'Produksi aneka masakan rumahan dan camilan tradisional. Tersedia untuk pesanan catering.',
    category: 'makanan',
    address: 'Jl. Kenanga No. 5, Banjarsari',
    area: 'Banjarsari Selatan',
    whatsapp: '628234567890',
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80',
    status: 'aktif',
    createdAt: new Date(),
    updatedAt: new Date(),
    instagram: 'dapurmakinah_banjarsari',
    facebook: 'Dapur Mak Inah',
    socialMediaUrl: 'https://instagram.com/dapurmakinah_banjarsari',
  },
  {
    id: 'b3',
    name: 'Servis Elektronik Pak Budi',
    owner: 'Budi Santoso',
    description: 'Melayani servis berbagai jenis elektronik: HP, laptop, TV, kulkas, AC.',
    category: 'reparasi-elektronik',
    address: 'Jl. Anggrek No. 8, Banjarsari',
    area: 'Banjarsari Barat',
    whatsapp: '628345678901',
    imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80',
    status: 'aktif',
    createdAt: new Date(),
    updatedAt: new Date(),
    instagram: 'budiservice_banjarsari',
    facebook: 'Servis Elektronik Budi',
    socialMediaUrl: 'https://instagram.com/budiservice_banjarsari',
  },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Batik Tulis Motif Parang',
    description: 'Kain batik tulis asli dengan motif parang khas Banjarsari. Dikerjakan oleh pengrajin berpengalaman.',
    price: 250000,
    category: 'kerajinan',
    businessId: 'b1',
    imageUrls: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576016770956-debb63d900ee?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'aktif',
    clickCount: 487,
    createdAt: new Date(),
    updatedAt: new Date(),
    Marketplace_URL: 'https://shopee.co.id/search?keyword=batik+tulis',
  },
  {
    id: 'p2',
    name: 'Tempe Mendoan Crispy',
    description: 'Mendoan crispy homemade dengan bumbu rahasia. Cocok untuk camilan atau lauk makan.',
    price: 15000,
    category: 'makanan',
    businessId: 'b2',
    imageUrls: [
      'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'aktif',
    clickCount: 342,
    createdAt: new Date(),
    updatedAt: new Date(),
    Marketplace_URL: 'https://shopee.co.id/search?keyword=tempe+mendoan',
  },
  {
    id: 'p3',
    name: 'Kripik Singkong Pedas Manis',
    description: 'Kripik singkong renyah dengan varian rasa pedas manis khas Jawa Tengah.',
    price: 20000,
    category: 'camilan',
    businessId: 'b2',
    imageUrls: [
      'https://images.unsplash.com/photo-1599490659213-e2b9527ec087?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'aktif',
    clickCount: 278,
    createdAt: new Date(),
    updatedAt: new Date(),
    Marketplace_URL: 'https://shopee.co.id/search?keyword=kripik+singkong+pedas',
  },
  {
    id: 'p4',
    name: 'Batik Cap Motif Truntum',
    description: 'Batik cap premium dengan motif truntum. Bahan katun halus, nyaman dipakai.',
    price: 180000,
    category: 'kerajinan',
    businessId: 'b1',
    imageUrls: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'aktif',
    clickCount: 195,
    createdAt: new Date(),
    updatedAt: new Date(),
    Marketplace_URL: 'https://shopee.co.id/search?keyword=batik+cap',
  },
];

export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Servis HP & Smartphone',
    description: 'Perbaikan HP semua merek: ganti layar, baterai, charger, software. Bergaransi 30 hari.',
    priceRange: 'Rp 50.000 – Rp 350.000',
    price: 50000,
    category: 'reparasi-elektronik',
    businessId: 'b3',
    imageUrls: [
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1597740985671-2a8a3b80f02e?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'aktif',
    clickCount: 312,
    createdAt: new Date(),
    updatedAt: new Date(),
    Is_Negotiable: true,
    Availability_Type: 'Tersedia',
    Service_Type: 'Panggilan',
    Marketplace_URL: 'https://tokopedia.com',
  },
  {
    id: 's2',
    name: 'Servis Laptop & Komputer',
    description: 'Install ulang OS, bersih virus, upgrade RAM/SSD, ganti keyboard/LCD laptop.',
    priceRange: 'Rp 100.000 – Rp 500.000',
    price: 100000,
    category: 'reparasi-elektronik',
    businessId: 'b3',
    imageUrls: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'aktif',
    clickCount: 241,
    createdAt: new Date(),
    updatedAt: new Date(),
    Is_Negotiable: false,
    Availability_Type: 'Tersedia',
    Service_Type: 'On-Site',
    Marketplace_URL: 'https://tokopedia.com',
  },
  {
    id: 's3',
    name: 'Katering Nasi Box Rumahan',
    description: 'Layanan katering nasi box untuk acara arisan, rapat, atau hajatan. Min. order 20 box.',
    priceRange: 'Rp 15.000 – Rp 35.000 / box',
    price: 15000,
    category: 'makanan',
    businessId: 'b2',
    imageUrls: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'aktif',
    clickCount: 178,
    createdAt: new Date(),
    updatedAt: new Date(),
    Is_Negotiable: true,
    Availability_Type: 'Penuh',
    Service_Type: 'Panggilan',
    Marketplace_URL: 'https://tokopedia.com',
  },
];
