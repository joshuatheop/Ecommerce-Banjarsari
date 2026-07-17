import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  Timestamp,
  type Unsubscribe,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

/* ============================================================
   Tipe data koleksi `analytics`
   ============================================================ */
export interface AnalyticsEvent {
  id:                    string;
  Total_Visitors:        number;          // PBI-18
  Top_Clicked_Item:      string;          // PBI-19
  Top_Business_Profile:  string;          // PBI-19
  Channel_Click_Type:    ChannelClickType; // PBI-20
  timestamp:             Timestamp | null;
}

export type ChannelClickType =
  | 'click_wa'
  | 'click_marketplace'
  | 'salin_link'
  | 'view_item'
  | 'view_business';

/* ---- Aggregated result types ---- */
export interface DashboardStats {
  totalVisitors:      number;
  topItems:           { name: string; count: number }[];
  topBusinesses:      { name: string; count: number }[];
  channelCounts:      Record<ChannelClickType, number>;
  recentEvents:       AnalyticsEvent[];
}

const ANALYTICS_COL = 'analytics';

/* ============================================================
   Helper: aggregate events → DashboardStats
   ============================================================ */
function aggregateEvents(events: AnalyticsEvent[]): DashboardStats {
  // PBI-18: Total_Visitors
  const totalVisitors = events.reduce((sum, e) => sum + (e.Total_Visitors ?? 0), 0);

  // PBI-19: Top_Clicked_Item
  const itemCount: Record<string, number> = {};
  for (const e of events) {
    if (e.Top_Clicked_Item) {
      itemCount[e.Top_Clicked_Item] = (itemCount[e.Top_Clicked_Item] ?? 0) + 1;
    }
  }
  const topItems = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  // PBI-19: Top_Business_Profile
  const bizCount: Record<string, number> = {};
  for (const e of events) {
    if (e.Top_Business_Profile) {
      bizCount[e.Top_Business_Profile] = (bizCount[e.Top_Business_Profile] ?? 0) + 1;
    }
  }
  const topBusinesses = Object.entries(bizCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // PBI-20: Channel_Click_Type
  const channelCounts: Record<ChannelClickType, number> = {
    click_wa:           0,
    click_marketplace:  0,
    salin_link:         0,
    view_item:          0,
    view_business:      0,
  };
  for (const e of events) {
    if (e.Channel_Click_Type && e.Channel_Click_Type in channelCounts) {
      channelCounts[e.Channel_Click_Type]++;
    }
  }

  // Recent events (already ordered by timestamp desc from query)
  const recentEvents = events.slice(0, 10);

  return { totalVisitors, topItems, topBusinesses, channelCounts, recentEvents };
}

/* ============================================================
   Subscribe realtime ke koleksi analytics
   Memanggil callback setiap ada perubahan data
   ============================================================ */
export function subscribeAnalytics(
  callback: (stats: DashboardStats) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, ANALYTICS_COL),
    orderBy('timestamp', 'desc'),
    limit(200), // ambil 200 event terbaru untuk agregasi
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const events: AnalyticsEvent[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AnalyticsEvent, 'id'>),
      }));
      callback(aggregateEvents(events));
    },
    (err) => {
      console.error('[analytics] snapshot error:', err);
      onError?.(err);
    },
  );
}

/* ============================================================
   One-shot fetch (non-realtime, untuk keperluan export dll)
   ============================================================ */
export async function fetchAnalyticsStats(): Promise<DashboardStats> {
  const q = query(
    collection(db, ANALYTICS_COL),
    orderBy('timestamp', 'desc'),
    limit(200),
  );
  const snapshot = await getDocs(q);
  const events: AnalyticsEvent[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<AnalyticsEvent, 'id'>),
  }));
  return aggregateEvents(events);
}

/* ============================================================
   Track a redirect / click event (PBI-13, PBI-14, PBI-15)
   ============================================================ */
export async function trackClickEvent(
  type: ChannelClickType,
  metadata: {
    itemName?: string;
    businessName?: string;
    waNumber?: string;
    marketplaceUrl?: string;
    socialMedia?: string;
  }
): Promise<void> {
  try {
    const col = collection(db, ANALYTICS_COL);
    await addDoc(col, {
      Total_Visitors: 0,
      Top_Clicked_Item: metadata.itemName || '',
      Top_Business_Profile: metadata.businessName || '',
      Channel_Click_Type: type,
      timestamp: serverTimestamp(),
      Click_Timestamp: serverTimestamp(), // PBI-13, 14, 15
      WA_Number: metadata.waNumber || null,
      Marketplace_URL: metadata.marketplaceUrl || null,
      Media_Sosial: metadata.socialMedia || null,
    });
  } catch (error) {
    console.error('[analytics] trackClickEvent error:', error);
  }
}
