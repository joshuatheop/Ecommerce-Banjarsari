import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ChannelClickType } from '@/lib/firestore/analytics';

/* ============================================================
   Seeder: isi koleksi `analytics` dengan data dummy
   untuk testing dashboard (PBI-18, PBI-19, PBI-20)
   ============================================================ */

const ITEMS = [
  { item: 'Rawon Bu Endang',           biz: 'Warung Bu Endang'       },
  { item: 'Batik Tulis Motif Mahkota', biz: 'Batik Sari Asih'        },
  { item: 'Tas Anyaman Pandan',        biz: 'Kerajinan Ibu PKK'      },
  { item: 'Kopi Sari Banjarsari',      biz: 'Kopi Pak Juhri'         },
  { item: 'Servis AC Pak Bambang',     biz: 'Bengkel Pak Bambang'     },
  { item: 'Tempe Segar Bu Wati',       biz: 'Industri Rumah Bu Wati' },
  { item: 'Keripik Singkong Pedas',    biz: 'UMKM Snack Banjarsari'  },
  { item: 'Pijat Panggilan Bu Rina',   biz: 'Salon Cantika'          },
];

const CHANNELS: ChannelClickType[] = [
  'click_wa',
  'click_marketplace',
  'salin_link',
  'view_item',
  'view_business',
];

// Distribusi frekuensi channel (WA paling banyak)
const CHANNEL_WEIGHTS = [35, 22, 10, 20, 13]; // total ~100

function weightedRandom(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

/**
 * Seed 50 dummy analytics events ke Firestore.
 * Aman dipanggil ulang (menambah, tidak menghapus data lama).
 */
export async function seedAnalytics(count = 50): Promise<void> {
  const col = collection(db, 'analytics');
  const promises: Promise<unknown>[] = [];

  for (let i = 0; i < count; i++) {
    // Pilih item random dengan bobot (item pertama lebih populer)
    const itemWeight = ITEMS.map((_, j) => Math.max(10 - j * 1.2, 1));
    const itemIdx = weightedRandom(itemWeight);
    const { item, biz } = ITEMS[itemIdx];

    const channelIdx = weightedRandom(CHANNEL_WEIGHTS);
    const channel    = CHANNELS[channelIdx];

    promises.push(
      addDoc(col, {
        Total_Visitors:       1,
        Top_Clicked_Item:     item,
        Top_Business_Profile: biz,
        Channel_Click_Type:   channel,
        timestamp:            serverTimestamp(),
      })
    );
  }

  await Promise.all(promises);
  console.log(`[seedAnalytics] ✓ ${count} events berhasil di-seed ke koleksi 'analytics'`);
}
