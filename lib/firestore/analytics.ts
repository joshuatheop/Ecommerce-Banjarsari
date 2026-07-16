import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AnalyticsEvent, EventType } from './types';

export type { AnalyticsEvent, EventType };

/* ============================================================
   Aggregated result types untuk Dashboard
   ============================================================ */
export interface DashboardStats {
  totalSessions:    number;                       // unique visitor sessions
  totalEvents:      number;                       // total event count
  topProducts:      { name: string; count: number }[];
  topBusinesses:    { name: string; count: number }[];
  eventTypeCounts:  Record<EventType, number>;
  recentEvents:     AnalyticsEvent[];
}

const ANALYTICS_COL = 'analytics_events';

/* ============================================================
   Helper: parse Firestore doc → AnalyticsEvent
   ============================================================ */
function toAnalyticsEvent(id: string, data: Record<string, unknown>): AnalyticsEvent {
  return {
    event_id:        id,
    session_id:      (data.session_id as string) || '',
    business_id:     (data.business_id as string) || null,
    product_id:      (data.product_id as string) || null,
    service_id:      (data.service_id as string) || null,
    event_type:      (data.event_type as EventType) || 'PRODUCT_VIEW',
    destination_url: (data.destination_url as string) || null,
    createdAt:       data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
  };
}

/* ============================================================
   Helper: aggregate events → DashboardStats
   ============================================================ */
function aggregateEvents(events: AnalyticsEvent[]): DashboardStats {
  // Total unique sessions
  const totalSessions = new Set(events.map((e) => e.session_id)).size;
  const totalEvents   = events.length;

  // Event type counts
  const eventTypeCounts: Record<EventType, number> = {
    BUSINESS_VIEW:     0,
    PRODUCT_VIEW:      0,
    SERVICE_VIEW:      0,
    WHATSAPP_CLICK:    0,
    MARKETPLACE_CLICK: 0,
    SHARE_CLICK:       0,
  };

  // Top products (by PRODUCT_VIEW count)
  const productCount: Record<string, number> = {};
  const productNames: Record<string, string> = {};

  // Top businesses (by BUSINESS_VIEW + WHATSAPP_CLICK count)
  const bizCount: Record<string, number> = {};
  const bizNames:  Record<string, string> = {};

  for (const e of events) {
    if (e.event_type in eventTypeCounts) {
      eventTypeCounts[e.event_type]++;
    }

    if ((e.event_type === 'PRODUCT_VIEW' || e.event_type === 'SERVICE_VIEW') && e.product_id) {
      productCount[e.product_id] = (productCount[e.product_id] ?? 0) + 1;
      if (e.destination_url) productNames[e.product_id] = e.destination_url;
    }

    if ((e.event_type === 'BUSINESS_VIEW' || e.event_type === 'WHATSAPP_CLICK') && e.business_id) {
      bizCount[e.business_id] = (bizCount[e.business_id] ?? 0) + 1;
      if (e.destination_url) bizNames[e.business_id] = e.destination_url;
    }
  }

  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id, count]) => ({ name: productNames[id] || id, count }));

  const topBusinesses = Object.entries(bizCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ name: bizNames[id] || id, count }));

  const recentEvents = events.slice(0, 10);

  return { totalSessions, totalEvents, topProducts, topBusinesses, eventTypeCounts, recentEvents };
}

/* ============================================================
   Subscribe realtime ke koleksi analytics_events
   ============================================================ */
export function subscribeAnalytics(
  callback: (stats: DashboardStats) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, ANALYTICS_COL),
    orderBy('createdAt', 'desc'),
    limit(200),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const events: AnalyticsEvent[] = snapshot.docs.map((doc) =>
        toAnalyticsEvent(doc.id, doc.data() as Record<string, unknown>)
      );
      callback(aggregateEvents(events));
    },
    (err) => {
      console.error('[analytics_events] snapshot error:', err);
      onError?.(err);
    },
  );
}

/* ============================================================
   One-shot fetch
   ============================================================ */
export async function fetchAnalyticsStats(): Promise<DashboardStats> {
  const q = query(
    collection(db, ANALYTICS_COL),
    orderBy('createdAt', 'desc'),
    limit(200),
  );
  const snapshot = await getDocs(q);
  const events: AnalyticsEvent[] = snapshot.docs.map((doc) =>
    toAnalyticsEvent(doc.id, doc.data() as Record<string, unknown>)
  );
  return aggregateEvents(events);
}
