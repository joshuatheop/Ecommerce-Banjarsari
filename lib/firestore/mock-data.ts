import { Business, Product, Service, Category } from "./types";

export const mockBusinesses: Business[] = [
  {
    id: 'b1', name: 'Warung Bu Endang', owner: 'Endang Susanti',
    description: 'Warung makan rumahan menyajikan masakan Jawa khas Banjarsari sejak 2008. Andalan kami adalah rawon, soto, dan pecel lele.',
    address: 'Jl. Mawar No. 14, Dusun Krajan RT 03 / RW 02', area: 'Dusun Krajan',
    phone: '6281234567801', wa: '6281234567801', logo: 'WE',
    lat: 0.42, lng: 0.51, joined: '2024-03-12',
    categories: ['Kuliner'], totalProducts: 12, totalServices: 0,
  },
  {
    id: 'b2', name: 'Batik Sari Asih', owner: 'Sri Wahyuni',
    description: 'Studio batik tulis & cap dengan motif khas Banjarsari. Menerima pesanan custom untuk acara, seragam komunitas, dan oleh-oleh.',
    address: 'Jl. Melati No. 7, Dusun Sawahan RT 01 / RW 04', area: 'Dusun Sawahan',
    phone: '6281234567802', wa: '6281234567802', logo: 'SA',
    lat: 0.62, lng: 0.31, joined: '2023-11-05',
    categories: ['Kerajinan'], totalProducts: 8, totalServices: 1,
  },
  {
    id: 'b3', name: 'Kerupuk Mbak Yati', owner: 'Suryati',
    description: 'Produsen kerupuk udang dan rambak khas Banjarsari, dikirim ke seluruh kabupaten.',
    address: 'Jl. Anggrek No. 22, Dusun Krajan RT 05 / RW 02', area: 'Dusun Krajan',
    phone: '6281234567803', wa: '6281234567803', logo: 'KY',
    lat: 0.38, lng: 0.58, joined: '2024-01-22',
    categories: ['Kuliner'], totalProducts: 6, totalServices: 0,
  },
  {
    id: 'b4', name: 'Tempe Pak Joko', owner: 'Joko Prasetyo',
    description: 'Pembuat tempe higienis sejak 1992. Tempe segar setiap pagi, bisa diantar ke rumah area Banjarsari.',
    address: 'Jl. Kenanga No. 9, Dusun Sukorejo RT 02 / RW 01', area: 'Dusun Sukorejo',
    phone: '6281234567804', wa: '6281234567804', logo: 'TJ',
    lat: 0.55, lng: 0.72, joined: '2024-06-08',
    categories: ['Kuliner'], totalProducts: 4, totalServices: 0,
  },
  {
    id: 'b5', name: 'Anyaman Mawar', owner: 'Mawar Indayani',
    description: 'Pengrajin tas anyaman pandan & rotan. Setiap produk dikerjakan tangan oleh ibu-ibu PKK Banjarsari.',
    address: 'Jl. Dahlia No. 3, Dusun Sukorejo RT 04 / RW 01', area: 'Dusun Sukorejo',
    phone: '6281234567805', wa: '6281234567805', logo: 'AM',
    lat: 0.71, lng: 0.66, joined: '2024-02-18',
    categories: ['Kerajinan'], totalProducts: 9, totalServices: 0,
  },
  {
    id: 'b6', name: 'Servis AC Pak Bambang', owner: 'Bambang Riyanto',
    description: 'Teknisi AC bersertifikat dengan pengalaman 15 tahun. Melayani panggilan ke rumah seluruh area Banjarsari dan sekitarnya.',
    address: 'Jl. Flamboyan No. 11, Dusun Krajan RT 04 / RW 03', area: 'Dusun Krajan',
    phone: '6281234567806', wa: '6281234567806', logo: 'BR',
    lat: 0.48, lng: 0.42, joined: '2024-04-30',
    categories: ['Jasa Reparasi'], totalProducts: 0, totalServices: 4,
  },
  {
    id: 'b7', name: 'Salon Cantika', owner: 'Maria Kartika',
    description: 'Salon kecantikan & perawatan rambut di tengah Banjarsari. Buka setiap hari kecuali Senin.',
    address: 'Jl. Cempaka No. 5, Dusun Sawahan RT 03 / RW 04', area: 'Dusun Sawahan',
    phone: '6281234567807', wa: '6281234567807', logo: 'SC',
    lat: 0.60, lng: 0.28, joined: '2023-09-14',
    categories: ['Jasa Kecantikan'], totalProducts: 0, totalServices: 6,
  },
  {
    id: 'b8', name: 'Pijat Bu Sumi', owner: 'Sumiati',
    description: 'Terapis pijat tradisional Jawa & refleksi kaki. Sudah melayani warga Banjarsari sejak 2015.',
    address: 'Jl. Teratai No. 18, Dusun Sukorejo RT 06 / RW 02', area: 'Dusun Sukorejo',
    phone: '6281234567808', wa: '6281234567808', logo: 'BS',
    lat: 0.68, lng: 0.78, joined: '2024-05-12',
    categories: ['Jasa Kesehatan'], totalProducts: 0, totalServices: 3,
  },
  {
    id: 'b9', name: 'Laundry Kilat 24 Jam', owner: 'Hendra Wijaya',
    description: 'Layanan laundry kiloan & express. Antar-jemput gratis untuk warga Dusun Krajan & Sawahan.',
    address: 'Jl. Mawar No. 30, Dusun Krajan RT 02 / RW 02', area: 'Dusun Krajan',
    phone: '6281234567809', wa: '6281234567809', logo: 'LK',
    lat: 0.40, lng: 0.50, joined: '2024-07-01',
    categories: ['Jasa Rumah Tangga'], totalProducts: 0, totalServices: 3,
  },
  {
    id: 'b10', name: 'Kopi Sari Banjarsari', owner: 'Adi Saputra',
    description: 'Kopi robusta lokal Banjarsari yang dipanggang sendiri. Tersedia bubuk dan biji.',
    address: 'Jl. Kenanga No. 25, Dusun Sukorejo RT 03 / RW 01', area: 'Dusun Sukorejo',
    phone: '6281234567810', wa: '6281234567810', logo: 'KS',
    lat: 0.58, lng: 0.69, joined: '2024-08-15',
    categories: ['Kuliner'], totalProducts: 5, totalServices: 0,
  },
  {
    id: 'b11', name: 'Bumbu Mbok Tum', owner: 'Tumijah',
    description: 'Bumbu masak kering tradisional. Praktis untuk membuat rawon, soto, gulai dalam hitungan menit.',
    address: 'Jl. Anggrek No. 6, Dusun Sawahan RT 02 / RW 04', area: 'Dusun Sawahan',
    phone: '6281234567811', wa: '6281234567811', logo: 'BT',
    lat: 0.64, lng: 0.34, joined: '2024-09-02',
    categories: ['Kuliner'], totalProducts: 7, totalServices: 0,
  },
  {
    id: 'b12', name: 'Tukang Las Mas Eko', owner: 'Eko Setiawan',
    description: 'Spesialis pagar besi, kanopi, tralis & pintu las. Survei lokasi gratis di area Banjarsari.',
    address: 'Jl. Flamboyan No. 22, Dusun Krajan RT 05 / RW 03', area: 'Dusun Krajan',
    phone: '6281234567812', wa: '6281234567812', logo: 'EM',
    lat: 0.46, lng: 0.46, joined: '2024-10-20',
    categories: ['Jasa Konstruksi'], totalProducts: 0, totalServices: 4,
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
// Fields sesuai PBI-04:
//   item_type, product_category_id, price_range (<50rb|50-100rb|>100rb),
//   has_marketplace_link (Boolean)

export const mockProducts: Product[] = [
  { id: 'p1',  itemType: 'product', businessId: 'b1',  categoryId: 'c1', category: 'Makanan',    name: 'Rawon Daging Komplit',         price: 22000,  priceRange: '<50rb',    description: 'Rawon khas Jawa Timur dengan daging sapi empuk, kuah hitam kluwek pekat, lengkap dengan tauge pendek, telur asin, sambal, dan kerupuk.',    thumbColor: '#05472B', clickCount: 312, hasMarketplaceLink: true,  hasWa: true },
  { id: 'p2',  itemType: 'product', businessId: 'b1',  categoryId: 'c1', category: 'Makanan',    name: 'Pecel Lele Sambal Terasi',      price: 18000,  priceRange: '<50rb',    description: 'Lele goreng kering renyah dengan sambal terasi pedas, lalapan timun, kemangi, dan kol segar.',                                               thumbColor: '#00C0A3', clickCount: 198, hasMarketplaceLink: false, hasWa: true },
  { id: 'p3',  itemType: 'product', businessId: 'b1',  categoryId: 'c1', category: 'Makanan',    name: 'Soto Ayam Lamongan',            price: 15000,  priceRange: '<50rb',    description: 'Soto ayam bening kaya rempah dengan koya bubuk khas Lamongan, perkedel, dan telur rebus.',                                                   thumbColor: '#AADCAB', clickCount: 156, hasMarketplaceLink: false, hasWa: true },
  { id: 'p4',  itemType: 'product', businessId: 'b2',  categoryId: 'c5', category: 'Kerajinan',  name: 'Batik Tulis Motif Mahkota',     price: 285000, priceRange: '>100rb',   description: 'Kain batik tulis dikerjakan selama 21 hari oleh pembatik senior. Motif eksklusif khas Banjarsari, ukuran 2m × 1.15m.',                        thumbColor: '#05472B', clickCount: 487, hasMarketplaceLink: true,  hasWa: true },
  { id: 'p5',  itemType: 'product', businessId: 'b2',  categoryId: 'c5', category: 'Kerajinan',  name: 'Batik Cap Warna Alam',          price: 145000, priceRange: '>100rb',   description: 'Batik cap dengan pewarna alami dari kayu mahoni, indigo, dan kunyit. Ramah lingkungan.',                                                       thumbColor: '#013020', clickCount: 263, hasMarketplaceLink: true,  hasWa: true },
  { id: 'p6',  itemType: 'product', businessId: 'b3',  categoryId: 'c2', category: 'Camilan',    name: 'Kerupuk Udang 250gr',           price: 25000,  priceRange: '<50rb',    description: 'Kerupuk udang asli dengan kandungan udang 30%. Renyah dan gurih, cocok untuk oleh-oleh.',                                                     thumbColor: '#CDFF00', clickCount: 178, hasMarketplaceLink: true,  hasWa: true },
  { id: 'p7',  itemType: 'product', businessId: 'b3',  categoryId: 'c2', category: 'Camilan',    name: 'Rambak Kulit Sapi 200gr',       price: 35000,  priceRange: '<50rb',    description: 'Rambak kulit sapi premium, digoreng dua kali untuk kerenyahan maksimal.',                                                                      thumbColor: '#00C0A3', clickCount: 142, hasMarketplaceLink: true,  hasWa: true },
  { id: 'p8',  itemType: 'product', businessId: 'b4',  categoryId: 'c1', category: 'Makanan',    name: 'Tempe Mendoan Daun Pisang',     price: 5000,   priceRange: '<50rb',    description: 'Tempe segar dibungkus daun pisang, tebal sempurna untuk digoreng mendoan atau kering.',                                                        thumbColor: '#05472B', clickCount: 89,  hasMarketplaceLink: false, hasWa: true },
  { id: 'p9',  itemType: 'product', businessId: 'b5',  categoryId: 'c5', category: 'Kerajinan',  name: 'Tas Anyaman Pandan Bunga',      price: 175000, priceRange: '>100rb',   description: 'Tas wanita berbahan pandan dengan motif bunga, tali kulit asli, lining katun.',                                                                thumbColor: '#AADCAB', clickCount: 354, hasMarketplaceLink: true,  hasWa: true },
  { id: 'p10', itemType: 'product', businessId: 'b5',  categoryId: 'c5', category: 'Kerajinan',  name: 'Topi Anyaman Pantai',           price: 85000,  priceRange: '50-100rb', description: 'Topi anyaman rotan dengan pita kain batik, ringan dan adem untuk aktivitas outdoor.',                                                           thumbColor: '#CDFF00', clickCount: 122, hasMarketplaceLink: true,  hasWa: true },
  { id: 'p11', itemType: 'product', businessId: 'b10', categoryId: 'c1', category: 'Kuliner',    name: 'Kopi Bubuk Robusta 250gr',      price: 45000,  priceRange: '<50rb',    description: 'Robusta lokal Banjarsari, dipanggang medium-dark. Aroma cokelat dengan body tebal.',                                                           thumbColor: '#013020', clickCount: 201, hasMarketplaceLink: true,  hasWa: true },
  { id: 'p12', itemType: 'product', businessId: 'b11', categoryId: 'c4', category: 'Bumbu',      name: 'Bumbu Rawon Instan',            price: 18000,  priceRange: '<50rb',    description: 'Bumbu kering rawon, tinggal rebus dengan daging. Tahan 6 bulan tanpa pengawet.',                                                               thumbColor: '#05472B', clickCount: 167, hasMarketplaceLink: true,  hasWa: true },
];

// ─── Services ─────────────────────────────────────────────────────────────────
// Fields sesuai PBI-04:
//   item_type, service_category_id, availability_type (Setiap Hari|Janjian),
//   has_portfolio (Boolean), is_negotiable (Boolean), has_marketplace_link (Boolean)

export const mockServices: Service[] = [
  { id: 's1',  itemType: 'service', businessId: 'b6',  categoryId: 'c8',  category: 'Reparasi Elektronik', name: 'Servis AC Panggilan Rumah',   description: 'Cuci AC split 1/2 PK - 2 PK, freon top-up, pengecekan kebocoran. Bergaransi 30 hari setelah servis.',               priceEstimation: 'Rp 80.000 - Rp 150.000',          isNegotiable: false, availability: 'Setiap Hari', serviceType: 'Panggilan', hasPortfolio: true,  clickCount: 423, thumbColor: '#05472B', hasMarketplaceLink: false, hasWa: true },
  { id: 's2',  itemType: 'service', businessId: 'b6',  categoryId: 'c8',  category: 'Reparasi Elektronik', name: 'Bongkar Pasang AC',            description: 'Layanan bongkar-pasang AC karena pindah rumah. Sudah termasuk pipa baru sampai 5 meter.',                           priceEstimation: 'Rp 250.000 - Rp 400.000',         isNegotiable: true,  availability: 'Janjian',      serviceType: 'Panggilan', hasPortfolio: true,  clickCount: 187, thumbColor: '#00C0A3', hasMarketplaceLink: false, hasWa: true },
  { id: 's3',  itemType: 'service', businessId: 'b7',  categoryId: 'c9',  category: 'Kecantikan',          name: 'Potong Rambut & Cuci',         description: 'Potong rambut sesuai model, cuci dengan shampoo premium, blow dry styling.',                                         priceEstimation: 'Rp 35.000 - Rp 50.000',           isNegotiable: false, availability: 'Setiap Hari', serviceType: 'On-Site',   hasPortfolio: true,  clickCount: 298, thumbColor: '#AADCAB', hasMarketplaceLink: false, hasWa: true },
  { id: 's4',  itemType: 'service', businessId: 'b7',  categoryId: 'c9',  category: 'Kecantikan',          name: 'Smoothing Rambut',             description: 'Smoothing rambut dengan produk Matrix atau Loreal, tahan 4-6 bulan.',                                               priceEstimation: 'Rp 350.000 - Rp 750.000',         isNegotiable: true,  availability: 'Janjian',      serviceType: 'On-Site',   hasPortfolio: true,  clickCount: 245, thumbColor: '#CDFF00', hasMarketplaceLink: false, hasWa: true },
  { id: 's5',  itemType: 'service', businessId: 'b8',  categoryId: 'c10', category: 'Kesehatan',           name: 'Pijat Tradisional Jawa',       description: 'Pijat full body 60 menit dengan minyak kelapa hangat. Bisa panggilan ke rumah.',                                    priceEstimation: 'Rp 70.000 - Rp 120.000',          isNegotiable: false, availability: 'Setiap Hari', serviceType: 'Panggilan', hasPortfolio: false, clickCount: 167, thumbColor: '#05472B', hasMarketplaceLink: false, hasWa: true },
  { id: 's6',  itemType: 'service', businessId: 'b9',  categoryId: 'c11', category: 'Rumah Tangga',        name: 'Laundry Kiloan Reguler',       description: 'Cuci + setrika, selesai dalam 2 hari. Antar-jemput gratis area Krajan & Sawahan.',                                  priceEstimation: 'Rp 6.000 / kg',                   isNegotiable: false, availability: 'Setiap Hari', serviceType: 'Panggilan', hasPortfolio: false, clickCount: 312, thumbColor: '#013020', hasMarketplaceLink: false, hasWa: true },
  { id: 's7',  itemType: 'service', businessId: 'b9',  categoryId: 'c11', category: 'Rumah Tangga',        name: 'Laundry Express 6 Jam',        description: 'Cucian selesai dalam 6 jam, untuk kebutuhan mendadak. Maksimal 5 kg per order.',                                   priceEstimation: 'Rp 12.000 / kg',                  isNegotiable: false, availability: 'Setiap Hari', serviceType: 'Panggilan', hasPortfolio: false, clickCount: 198, thumbColor: '#00C0A3', hasMarketplaceLink: false, hasWa: true },
  { id: 's8',  itemType: 'service', businessId: 'b12', categoryId: 'c12', category: 'Konstruksi',          name: 'Pembuatan Pagar Besi',         description: 'Pagar besi minimalis atau klasik sesuai desain. Bisa custom motif dan warna.',                                      priceEstimation: 'Rp 600.000 - Rp 1.200.000 / m²', isNegotiable: true,  availability: 'Janjian',      serviceType: 'On-Site',   hasPortfolio: true,  clickCount: 156, thumbColor: '#05472B', hasMarketplaceLink: false, hasWa: true },
  { id: 's9',  itemType: 'service', businessId: 'b12', categoryId: 'c12', category: 'Konstruksi',          name: 'Kanopi Galvalum',              description: 'Kanopi atap galvalum tahan karat, garansi rangka 5 tahun.',                                                          priceEstimation: 'Rp 280.000 / m²',                 isNegotiable: true,  availability: 'Janjian',      serviceType: 'On-Site',   hasPortfolio: true,  clickCount: 134, thumbColor: '#AADCAB', hasMarketplaceLink: false, hasWa: true },
  { id: 's10', itemType: 'service', businessId: 'b2',  categoryId: 'c5',  category: 'Kerajinan',           name: 'Pemesanan Batik Custom',       description: 'Pemesanan batik custom untuk seragam komunitas, kantor, atau acara keluarga. Minimal 20 helai.',                   priceEstimation: 'Mulai Rp 175.000 / helai',         isNegotiable: true,  availability: 'Janjian',      serviceType: 'Panggilan', hasPortfolio: true,  clickCount: 89,  thumbColor: '#CDFF00', hasMarketplaceLink: false, hasWa: true },
];

export const mockCategories: Category[] = [
  { id: 'c1',  name: 'Makanan',             type: 'product', slug: 'makanan',             icon: '🍚' },
  { id: 'c2',  name: 'Camilan',             type: 'product', slug: 'camilan',             icon: '🥨' },
  { id: 'c3',  name: 'Minuman',             type: 'product', slug: 'minuman',             icon: '🥤' },
  { id: 'c4',  name: 'Bumbu',               type: 'product', slug: 'bumbu',               icon: '🌶️' },
  { id: 'c5',  name: 'Kerajinan',           type: 'product', slug: 'kerajinan',           icon: '🧺' },
  { id: 'c6',  name: 'Fashion',             type: 'product', slug: 'fashion',             icon: '👕' },
  { id: 'c7',  name: 'Sembako',             type: 'product', slug: 'sembako',             icon: '🌾' },
  { id: 'c8',  name: 'Reparasi Elektronik', type: 'service', slug: 'reparasi-elektronik', icon: '🔧' },
  { id: 'c9',  name: 'Kecantikan',          type: 'service', slug: 'kecantikan',          icon: '💇' },
  { id: 'c10', name: 'Kesehatan',           type: 'service', slug: 'kesehatan',           icon: '💆' },
  { id: 'c11', name: 'Rumah Tangga',        type: 'service', slug: 'rumah-tangga',        icon: '🧹' },
  { id: 'c12', name: 'Konstruksi',          type: 'service', slug: 'konstruksi',          icon: '🛠️' },
  { id: 'c13', name: 'Transportasi',        type: 'service', slug: 'transportasi',        icon: '🚗' },
];

export const mockAreas = ['Dusun Krajan', 'Dusun Sawahan', 'Dusun Sukorejo', 'Dusun Tegalrejo'];
