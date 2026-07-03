// Simple browser/Node seeding utility.
// Can be run in a browser console or adapted.
// To keep things simple, we outline the Firestore collections and documents structure
// that can be seeded manually or via this reference script.

const { initializeApp } = require("firebase/app");
const { getFirestore, writeBatch, doc } = require("firebase/firestore");

// Seeding data
const mockBusinesses = [
  {
    name: 'Warung Bu Endang', owner: 'Endang Susanti',
    description: 'Warung makan rumahan menyajikan masakan Jawa khas Banjarsari sejak 2008. Andalan kami adalah rawon, soto, dan pecel lele.',
    address: 'Jl. Mawar No. 14, Dusun Krajan RT 03 / RW 02', area_id: 'Dusun Krajan',
    business_phone: '6281234567801', marketplace_link: '', business_logo_url: '',
    status: 'aktif', createdAt: new Date(), updatedAt: new Date()
  },
  {
    name: 'Batik Sari Asih', owner: 'Sri Wahyuni',
    description: 'Studio batik tulis & cap dengan motif khas Banjarsari. Menerima pesanan custom untuk acara, seragam komunitas, dan oleh-oleh.',
    address: 'Jl. Melati No. 7, Dusun Sawahan RT 01 / RW 04', area_id: 'Dusun Sawahan',
    business_phone: '6281234567802', marketplace_link: 'https://shopee.co.id', business_logo_url: '',
    status: 'aktif', createdAt: new Date(), updatedAt: new Date()
  }
];

const mockProducts = [
  {
    business_id: 'b1', product_name: 'Rawon Daging Komplit', product_category_id: 'c1',
    product_price: 22000, price_range_group: '<50rb',
    product_description: 'Rawon khas Jawa Timur dengan daging sapi empuk, kuah hitam kluwek pekat, lengkap dengan tauge pendek, telur asin, sambal, dan kerupuk.',
    thumbnail_url: '', gallery_images: [], click_count_log: 312, status: 'aktif',
    createdAt: new Date(), updatedAt: new Date()
  }
];

async function seed(config) {
  try {
    const app = initializeApp(config);
    const db = getFirestore(app);
    const batch = writeBatch(db);

    console.log("Starting seeding process...");
    
    // Seed Businesses
    mockBusinesses.forEach((b, idx) => {
      const docRef = doc(db, "toko", `b${idx + 1}`);
      batch.set(docRef, b);
    });

    // Seed Products
    mockProducts.forEach((p, idx) => {
      const docRef = doc(db, "produk", `p${idx + 1}`);
      batch.set(docRef, p);
    });

    await batch.commit();
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

module.exports = { seed };
