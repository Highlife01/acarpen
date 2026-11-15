import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  type Query,
  type Unsubscribe,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth, isFirebaseConfigured } from "./firebase";
import {
  type UserRole,
  type RoleDefinition,
  type StaffUserRecord,
  type QuoteLineItem,
  type QuoteRevision,
  type DeliveryProof,
  type QuoteItem,
  type PublicOrderTrackingItem,
  type CustomerRecord,
  type OpportunityStage,
  type OpportunityItem,
  type ActivityItem,
  type InventoryItem,
  type PurchaseOrderItem,
  type QualityInspectionItem,
  type AuditEventItem,
  type ContactMessage,
  type FactoryPriceItem,
  type FactoryServiceItem,
  type CheckInstrumentItem,
  type CashLedgerItem,
} from "./erpTypes";
import {
  ROLE_DEFINITIONS,
  INITIAL_PRICES,
  INITIAL_SERVICES,
  INITIAL_INVENTORY,
  INITIAL_CHECKS,
  INITIAL_CASH_LEDGER,
  LEGACY_MOCK_IDS,
  normalizeUserRole,
} from "./erpSeeds";
import {
  getOrderTrackingDocId,
  getPhoneTrackingDocId,
  normalizeTrPhone10,
  toPublicOrderTrackingItem,
} from "./orderTracking";

export {
  ROLE_DEFINITIONS,
  INITIAL_PRICES,
  INITIAL_SERVICES,
  INITIAL_INVENTORY,
  INITIAL_CHECKS,
  INITIAL_CASH_LEDGER,
  normalizeUserRole,
  toPublicOrderTrackingItem,
};

export type {
  UserRole,
  RoleDefinition,
  StaffUserRecord,
  QuoteLineItem,
  QuoteRevision,
  DeliveryProof,
  QuoteItem,
  PublicOrderTrackingItem,
  CustomerRecord,
  OpportunityStage,
  OpportunityItem,
  ActivityItem,
  InventoryItem,
  PurchaseOrderItem,
  QualityInspectionItem,
  AuditEventItem,
  ContactMessage,
  FactoryPriceItem,
  FactoryServiceItem,
  CheckInstrumentItem,
  CashLedgerItem,
};

export interface AdminAuthState {
  sessionUid: string | null;
  authResolved: boolean;
  isAuthorizedStaff: boolean;
  assignedBackendRole: UserRole | null;
  canSimulateRoles: boolean;
}

const TRANSACTIONAL_QUERY_LIMIT = 250;
const CATALOG_QUERY_LIMIT = 500;
const STAFF_QUERY_LIMIT = 100;

const COLLECTIONS = {
  QUOTES: "acarpen_quotes",
  ORDER_TRACKING: "acarpen_order_tracking",
  MESSAGES: "acarpen_messages",
  PRICES: "acarpen_prices",
  SERVICES: "acarpen_services",
  CUSTOMERS: "acarpen_customers",
  OPPORTUNITIES: "acarpen_opportunities",
  ACTIVITIES: "acarpen_activities",
  INVENTORY: "acarpen_inventory",
  PURCHASES: "acarpen_purchases",
  QUALITY: "acarpen_quality",
  AUDIT_LOGS: "acarpen_audit_logs",
  CHECKS: "acarpen_checks",
  CASH_LEDGER: "acarpen_cash_ledger",
  USERS: "users",
};

function boundedQuery(colName: string, maxDocs: number, orderByCreated = true): Query {
  const colRef = collection(db, colName);
  return orderByCreated
    ? query(colRef, orderBy("createdAt", "desc"), limit(maxDocs))
    : query(colRef, limit(maxDocs));
}

function stripUndefined<T extends object>(obj: T): Record<string, Partial<unknown> | undefined> {
  const clean: Record<string, Partial<unknown> | undefined> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value as Partial<unknown>;
    }
  }
  return clean;
}

export function formatTrNow(): string {
  return new Date().toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusToDefaultStage(status: QuoteItem["status"]): 1 | 2 | 3 | 4 | 5 | 6 {
  switch (status) {
    case "new":
      return 1;
    case "in_review":
      return 2;
    case "quoted":
      return 3;
    case "approved":
      return 4;
    case "completed":
      return 6;
    default:
      return 1;
  }
}

class ActiveDataStore {
  private quotes: QuoteItem[] = [];
  private messages: ContactMessage[] = [];
  private prices: FactoryPriceItem[] = [...INITIAL_PRICES];
  private services: FactoryServiceItem[] = [...INITIAL_SERVICES];
  private customers: CustomerRecord[] = [];
  private opportunities: OpportunityItem[] = [];
  private activities: ActivityItem[] = [];
  private inventory: InventoryItem[] = [...INITIAL_INVENTORY];
  private purchases: PurchaseOrderItem[] = [];
  private qualityInspections: QualityInspectionItem[] = [];
  private auditLogs: AuditEventItem[] = [];
  private checks: CheckInstrumentItem[] = [...INITIAL_CHECKS];
  private cashLedger: CashLedgerItem[] = [...INITIAL_CASH_LEDGER];
  private staffUsers: StaffUserRecord[] = [];

  private sessionUid: string | null = null;
  private authResolved = false;
  private isAuthorizedStaff = false;
  private assignedBackendRole: UserRole | null = null;
  private activeRole: UserRole = "yonetici";

  private pricesSeeded = false;
  private servicesSeeded = false;
  private realtimeUnsubscribers: Unsubscribe[] = [];

  private quoteListeners: Set<(quotes: QuoteItem[]) => void> = new Set();
  private messageListeners: Set<(messages: ContactMessage[]) => void> = new Set();
  private priceListeners: Set<(prices: FactoryPriceItem[]) => void> = new Set();
  private serviceListeners: Set<(services: FactoryServiceItem[]) => void> = new Set();
  private customerListeners: Set<(customers: CustomerRecord[]) => void> = new Set();
  private opportunityListeners: Set<(items: OpportunityItem[]) => void> = new Set();
  private activityListeners: Set<(items: ActivityItem[]) => void> = new Set();
  private inventoryListeners: Set<(items: InventoryItem[]) => void> = new Set();
  private purchaseListeners: Set<(items: PurchaseOrderItem[]) => void> = new Set();
  private qualityListeners: Set<(items: QualityInspectionItem[]) => void> = new Set();
  private auditListeners: Set<(items: AuditEventItem[]) => void> = new Set();
  private checkListeners: Set<(items: CheckInstrumentItem[]) => void> = new Set();
  private cashLedgerListeners: Set<(items: CashLedgerItem[]) => void> = new Set();
  private sessionListeners: Set<(uid: string | null) => void> = new Set();
  private roleListeners: Set<(role: UserRole) => void> = new Set();
  private authStateListeners: Set<(state: AdminAuthState) => void> = new Set();
  private staffUsersListeners: Set<(items: StaffUserRecord[]) => void> = new Set();

  constructor() {
    this.cleanupLegacyFakeCache();
    this.loadLiveLocalPersistence();
    this.initCrossTabStorageListener();
    this.initRealtimeFirebaseSync();
  }

  private saveLocalKey(key: string, data: unknown): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch {
      // Ignore storage quota errors
    }
  }

  private loadLocalKey<T extends { id: string }>(key: string): T[] {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return (parsed as T[]).filter((item) => item && !LEGACY_MOCK_IDS.has(item.id));
        }
      }
    } catch {
      // Ignore parse errors
    }
    return [];
  }

  private loadLiveLocalPersistence(): void {
    this.quotes = this.loadLocalKey<QuoteItem>("acarpen_live_v3_quotes");
    this.messages = this.loadLocalKey<ContactMessage>("acarpen_live_v3_messages");
    this.checks = this.loadLocalKey<CheckInstrumentItem>("acarpen_live_v3_checks");
    this.cashLedger = this.loadLocalKey<CashLedgerItem>("acarpen_live_v3_cash_ledger");
    this.customers = this.loadLocalKey<CustomerRecord>("acarpen_live_v3_customers");
    this.opportunities = this.loadLocalKey<OpportunityItem>("acarpen_live_v3_opportunities");
    this.activities = this.loadLocalKey<ActivityItem>("acarpen_live_v3_activities");
  }

  private initCrossTabStorageListener(): void {
    if (typeof window === "undefined") return;
    window.addEventListener("storage", (e) => {
      if (e.key === "acarpen_live_v3_messages") {
        this.messages = this.loadLocalKey<ContactMessage>("acarpen_live_v3_messages");
        this.messageListeners.forEach((cb) => cb(this.getMessages()));
      } else if (e.key === "acarpen_live_v3_quotes") {
        this.quotes = this.loadLocalKey<QuoteItem>("acarpen_live_v3_quotes");
        this.quoteListeners.forEach((cb) => cb(this.getQuotes()));
      } else if (e.key === "acarpen_live_v3_checks") {
        this.checks = this.loadLocalKey<CheckInstrumentItem>("acarpen_live_v3_checks");
        this.checkListeners.forEach((cb) => cb(this.getChecks()));
      } else if (e.key === "acarpen_live_v3_cash_ledger") {
        this.cashLedger = this.loadLocalKey<CashLedgerItem>("acarpen_live_v3_cash_ledger");
        this.cashLedgerListeners.forEach((cb) => cb(this.getCashLedger()));
      }
    });
  }

  private cleanupLegacyFakeCache(): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("acarpen_quotes_v2");
        localStorage.removeItem("acarpen_messages_v2");
        localStorage.removeItem("acarpen_visitor_telemetry_v1");
        localStorage.removeItem("acarpen_visitor_telemetry_v2");
        localStorage.removeItem("acarpen_react");
      }
    } catch {
      // Ignore storage access errors
    }
  }

  private initRealtimeFirebaseSync(): void {
    if (typeof window === "undefined" || !isFirebaseConfigured) return;

    try {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          this.sessionUid = null;
          this.assignedBackendRole = null;
          this.isAuthorizedStaff = false;
          this.authResolved = true;
          this.staffUsers = [];
          this.activeRole = "yonetici";
          this.detachRealtimeListeners();
          this.notifySession();
          this.notifyAuthState();
          this.notifyRole();
          this.notifyStaffUsers();
          return;
        }

        this.sessionUid = user.uid;
        this.authResolved = false;
        this.notifySession();
        this.notifyAuthState();

        void this.resolveBackendUserRole(user.uid, user.email || "");
      });
    } catch {
      this.authResolved = true;
      this.notifyAuthState();
    }
  }

  private async resolveBackendUserRole(uid: string, email: string): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      const isPrimaryAdmin = email.trim().toLowerCase() === "admin@acarpen.com.tr";

      const [tokenResult, userSnap] = await Promise.all([
        currentUser ? currentUser.getIdTokenResult().catch(() => null) : Promise.resolve(null),
        getDoc(doc(db, COLLECTIONS.USERS, uid)).catch(() => null),
      ]);

      if (auth.currentUser && auth.currentUser.uid !== uid) return;

      const claimRole = normalizeUserRole(tokenResult?.claims?.role);
      const userData = userSnap && userSnap.exists() ? userSnap.data() : null;
      const docActive = userData ? userData.active !== false : false;
      const docRole = userData ? normalizeUserRole(userData.role) : null;

      let resolvedRole: UserRole | null = null;
      let authorized = false;

      if (isPrimaryAdmin) {
        resolvedRole = claimRole || "yonetici";
        authorized = true;
      } else if (userData && userData.active === false) {
        resolvedRole = null;
        authorized = false;
      } else if (claimRole) {
        resolvedRole = claimRole;
        authorized = true;
      } else if (docActive && docRole) {
        resolvedRole = docRole;
        authorized = true;
      }

      this.assignedBackendRole = resolvedRole;
      this.isAuthorizedStaff = authorized;
      this.authResolved = true;
      if (resolvedRole) {
        this.activeRole = resolvedRole;
      }

      this.notifyAuthState();
      this.notifyRole();

      if (authorized) {
        this.detachRealtimeListeners();
        this.attachRealtimeListeners();
      } else {
        this.detachRealtimeListeners();
      }
    } catch {
      this.assignedBackendRole = null;
      this.isAuthorizedStaff = false;
      this.authResolved = true;
      this.notifyAuthState();
    }
  }

  private detachRealtimeListeners(): void {
    if (this.realtimeUnsubscribers.length === 0) return;
    this.realtimeUnsubscribers.forEach((unsub) => {
      try {
        unsub();
      } catch {
        // Ignore unsubscribe error
      }
    });
    this.realtimeUnsubscribers = [];
  }

  private attachRealtimeListeners(): void {
    if (this.realtimeUnsubscribers.length > 0 || !isFirebaseConfigured || !this.isAuthorizedStaff) {
      return;
    }

    try {
      // 1. Quotes & Orders (bounded newest 250)
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.QUOTES, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const remoteMap = new Map<string, QuoteItem>();
            snapshot.forEach((docSnap) => {
              const docId = docSnap.id;
              if (LEGACY_MOCK_IDS.has(docId)) {
                deleteDoc(doc(db, COLLECTIONS.QUOTES, docId)).catch(() => {});
                return;
              }
              const data = docSnap.data() as QuoteItem;
              remoteMap.set(data.id || docId, { ...data, id: data.id || docId });
            });
            this.quotes.forEach((localItem) => {
              if (!remoteMap.has(localItem.id)) {
                remoteMap.set(localItem.id, localItem);
              }
            });
            const merged = Array.from(remoteMap.values());
            merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.quotes = merged;
            this.notifyQuotes();
          },
          () => {}
        )
      );

      // 2. Contact Messages (bounded newest 250)
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.MESSAGES, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const remoteMap = new Map<string, ContactMessage>();
            snapshot.forEach((docSnap) => {
              const docId = docSnap.id;
              if (LEGACY_MOCK_IDS.has(docId)) {
                deleteDoc(doc(db, COLLECTIONS.MESSAGES, docId)).catch(() => {});
                return;
              }
              const data = docSnap.data() as ContactMessage;
              remoteMap.set(data.id || docId, { ...data, id: data.id || docId });
            });
            this.messages.forEach((localItem) => {
              if (!remoteMap.has(localItem.id)) {
                remoteMap.set(localItem.id, localItem);
              }
            });
            const merged = Array.from(remoteMap.values());
            merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.messages = merged;
            this.notifyMessages();
          },
          () => {}
        )
      );

      // 3. Factory Unit Prices
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.PRICES, CATALOG_QUERY_LIMIT, false),
          (snapshot) => {
            if (snapshot.empty) {
              if (!this.pricesSeeded && this.canEditPrices()) {
                this.pricesSeeded = true;
                INITIAL_PRICES.forEach((item) => {
                  setDoc(doc(db, COLLECTIONS.PRICES, item.id), stripUndefined(item)).catch(() => {});
                });
              }
              return;
            }
            const items: FactoryPriceItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as FactoryPriceItem;
              items.push({
                category: "Özel Cam",
                stock: "Mevcut",
                version: "2026-Liste-v1",
                ...data,
                id: data.id || docSnap.id,
              });
            });
            const orderMap = new Map(INITIAL_PRICES.map((p, idx) => [p.id, idx]));
            items.sort((a, b) => {
              const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
              const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
              return idxA - idxB;
            });
            this.prices = items;
            this.notifyPrices();
          },
          () => {}
        )
      );

      // 4. Extra Services
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.SERVICES, CATALOG_QUERY_LIMIT, false),
          (snapshot) => {
            if (snapshot.empty) {
              if (!this.servicesSeeded && this.canEditPrices()) {
                this.servicesSeeded = true;
                INITIAL_SERVICES.forEach((item) => {
                  setDoc(doc(db, COLLECTIONS.SERVICES, item.id), stripUndefined(item)).catch(() => {});
                });
              }
              return;
            }
            const items: FactoryServiceItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as FactoryServiceItem;
              items.push({
                birim: "İşlem",
                ...data,
                id: data.id || docSnap.id,
              });
            });
            const orderMap = new Map(INITIAL_SERVICES.map((s, idx) => [s.id, idx]));
            items.sort((a, b) => {
              const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
              const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
              return idxA - idxB;
            });
            this.services = items;
            this.notifyServices();
          },
          () => {}
        )
      );

      // 5. Customers (CRM 360)
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.CUSTOMERS, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const items: CustomerRecord[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as CustomerRecord;
              items.push({ ...data, id: data.id || docSnap.id });
            });
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.customers = items;
            this.notifyCustomers();
          },
          () => {}
        )
      );

      // 6. Opportunities (Sales Funnel)
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.OPPORTUNITIES, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const items: OpportunityItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as OpportunityItem;
              items.push({ ...data, id: data.id || docSnap.id });
            });
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.opportunities = items;
            this.notifyOpportunities();
          },
          () => {}
        )
      );

      // 7. Activities
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.ACTIVITIES, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const items: ActivityItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as ActivityItem;
              items.push({ ...data, id: data.id || docSnap.id });
            });
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.activities = items;
            this.notifyActivities();
          },
          () => {}
        )
      );

      // 8. Inventory
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.INVENTORY, CATALOG_QUERY_LIMIT, false),
          (snapshot) => {
            const items: InventoryItem[] = [];
            snapshot.forEach((docSnap) => {
              const docId = docSnap.id;
              if (LEGACY_MOCK_IDS.has(docId)) {
                deleteDoc(doc(db, COLLECTIONS.INVENTORY, docId)).catch(() => {});
                return;
              }
              const data = docSnap.data() as InventoryItem;
              items.push({ ...data, id: data.id || docId });
            });
            this.inventory = items;
            this.notifyInventory();
          },
          () => {}
        )
      );

      // 9. Purchases
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.PURCHASES, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const items: PurchaseOrderItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as PurchaseOrderItem;
              items.push({ ...data, id: data.id || docSnap.id });
            });
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.purchases = items;
            this.notifyPurchases();
          },
          () => {}
        )
      );

      // 10. Quality Inspections
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.QUALITY, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const items: QualityInspectionItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as QualityInspectionItem;
              items.push({ ...data, id: data.id || docSnap.id });
            });
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.qualityInspections = items;
            this.notifyQuality();
          },
          () => {}
        )
      );

      // 11. Audit Logs
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.AUDIT_LOGS, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const items: AuditEventItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as AuditEventItem;
              items.push({ ...data, id: data.id || docSnap.id });
            });
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.auditLogs = items;
            this.notifyAuditLogs();
          },
          () => {}
        )
      );

      // 12. Checks Portfolio
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.CHECKS, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const items: CheckInstrumentItem[] = [];
            snapshot.forEach((docSnap) => {
              const docId = docSnap.id;
              if (LEGACY_MOCK_IDS.has(docId)) {
                deleteDoc(doc(db, COLLECTIONS.CHECKS, docId)).catch(() => {});
                return;
              }
              const data = docSnap.data() as CheckInstrumentItem;
              items.push({ ...data, id: data.id || docId });
            });
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.checks = items;
            this.notifyChecks();
          },
          () => {}
        )
      );

      // 13. Cash & Bank Ledger
      this.realtimeUnsubscribers.push(
        onSnapshot(
          boundedQuery(COLLECTIONS.CASH_LEDGER, TRANSACTIONAL_QUERY_LIMIT),
          (snapshot) => {
            const items: CashLedgerItem[] = [];
            snapshot.forEach((docSnap) => {
              const docId = docSnap.id;
              if (LEGACY_MOCK_IDS.has(docId)) {
                deleteDoc(doc(db, COLLECTIONS.CASH_LEDGER, docId)).catch(() => {});
                return;
              }
              const data = docSnap.data() as CashLedgerItem;
              items.push({ ...data, id: data.id || docId });
            });
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            this.cashLedger = items;
            this.notifyCashLedger();
          },
          () => {}
        )
      );

      // 14. Staff Users (Only readable/writable by yonetici)
      if (this.assignedBackendRole === "yonetici") {
        this.realtimeUnsubscribers.push(
          onSnapshot(
            boundedQuery(COLLECTIONS.USERS, STAFF_QUERY_LIMIT, false),
            (snapshot) => {
              const list: StaffUserRecord[] = [];
              snapshot.forEach((docSnap) => {
                const raw = docSnap.data() as Partial<StaffUserRecord>;
                const role = normalizeUserRole(raw.role) || "satis";
                list.push({
                  uid: raw.uid || docSnap.id,
                  email: raw.email || "",
                  displayName: raw.displayName || raw.email || docSnap.id,
                  role,
                  active: raw.active !== false,
                  updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
                });
              });
              list.sort((a, b) => b.updatedAt - a.updatedAt);
              this.staffUsers = list;
              this.notifyStaffUsers();
            },
            () => {}
          )
        );
      }
    } catch {
      // Fallback cleanly to local state
    }
  }

  private canEditPrices(): boolean {
    return ROLE_DEFINITIONS[this.activeRole].permissions.canEditPrices;
  }

  /** Sync sanitized order projection to public tracking collection without leaking PII/financials. */
  private syncPublicOrderTracking(quote: QuoteItem, allowOverwrite: boolean): void {
    if (!isFirebaseConfigured) return;

    const trackingItem = toPublicOrderTrackingItem(quote);
    const orderDocId = getOrderTrackingDocId(quote.id);
    if (orderDocId) {
      const orderRef = doc(db, COLLECTIONS.ORDER_TRACKING, orderDocId);
      const cleanPayload = stripUndefined(trackingItem);
      if (allowOverwrite) {
        setDoc(orderRef, cleanPayload, { merge: true }).catch(() => {});
      } else {
        setDoc(orderRef, cleanPayload).catch(() => {});
      }
    }

    const phoneDocId = getPhoneTrackingDocId(quote.phone);
    if (phoneDocId) {
      const phoneRef = doc(db, COLLECTIONS.ORDER_TRACKING, phoneDocId);
      void (async () => {
        try {
          const snap = await getDoc(phoneRef);
          if (!snap.exists()) {
            await setDoc(phoneRef, {
              kind: "phone",
              latestOrderId: trackingItem.orderId,
              entries: {
                [trackingItem.orderId]: stripUndefined(trackingItem),
              },
              updatedAt: trackingItem.updatedAt,
            });
          } else {
            await updateDoc(phoneRef, {
              latestOrderId: trackingItem.orderId,
              [`entries.${trackingItem.orderId}`]: stripUndefined(trackingItem),
              updatedAt: trackingItem.updatedAt,
            });
          }
        } catch {
          // Ignore sync failure if offline or rule prevents unauthorized public overwrite
        }
      })();
    }
  }

  // --- Session, Auth & Active Role Management ---
  public getSession(): string | null {
    return this.sessionUid;
  }

  public setSession(uid: string | null): void {
    this.sessionUid = uid;
    if (!uid) {
      this.assignedBackendRole = null;
      this.isAuthorizedStaff = false;
      this.authResolved = true;
    }
    this.notifySession();
    this.notifyAuthState();
  }

  public subscribeSession(callback: (uid: string | null) => void): () => void {
    this.sessionListeners.add(callback);
    callback(this.sessionUid);
    return () => this.sessionListeners.delete(callback);
  }

  private notifySession(): void {
    const current = this.sessionUid;
    this.sessionListeners.forEach((cb) => cb(current));
  }

  public getAuthState(): AdminAuthState {
    return {
      sessionUid: this.sessionUid,
      authResolved: this.authResolved,
      isAuthorizedStaff: this.isAuthorizedStaff,
      assignedBackendRole: this.assignedBackendRole,
      canSimulateRoles:
        this.sessionUid === null || this.assignedBackendRole === "yonetici",
    };
  }

  public subscribeAuthState(callback: (state: AdminAuthState) => void): () => void {
    this.authStateListeners.add(callback);
    callback(this.getAuthState());
    return () => this.authStateListeners.delete(callback);
  }

  private notifyAuthState(): void {
    const current = this.getAuthState();
    this.authStateListeners.forEach((cb) => cb(current));
  }

  public getRole(): UserRole {
    return this.activeRole;
  }

  public setRole(role: UserRole): { ok: boolean; error?: string } {
    if (this.sessionUid !== null && this.assignedBackendRole !== "yonetici") {
      this.logAuditEvent(
        "RBAC_DENIED",
        "ROLE_SWITCH",
        `${ROLE_DEFINITIONS[this.activeRole].label} hesabından istemci rolü "${ROLE_DEFINITIONS[role].label}" olarak değiştirilmeye çalışıldı ve engellendi.`
      );
      return {
        ok: false,
        error:
          "YETKİ ENGELİ: Rol simülasyonu yalnızca backend'de Yönetici (yonetici) yetkisine sahip hesaplarla kullanılabilir.",
      };
    }

    this.activeRole = role;
    const current = this.activeRole;
    this.roleListeners.forEach((cb) => cb(current));
    return { ok: true };
  }

  private notifyRole(): void {
    const current = this.activeRole;
    this.roleListeners.forEach((cb) => cb(current));
  }

  public subscribeRole(callback: (role: UserRole) => void): () => void {
    this.roleListeners.add(callback);
    callback(this.activeRole);
    return () => this.roleListeners.delete(callback);
  }

  // --- Staff User Role Administration (`users/{uid}`) ---
  public getStaffUsers(): StaffUserRecord[] {
    return [...this.staffUsers];
  }

  public saveStaffUser(record: Omit<StaffUserRecord, "updatedAt">): { ok: boolean; error?: string } {
    if (this.assignedBackendRole !== "yonetici" && this.sessionUid !== null) {
      return { ok: false, error: "Personel yetkilerini yalnızca Yönetici düzenleyebilir." };
    }
    const cleanUid = record.uid.trim();
    if (!cleanUid) {
      return { ok: false, error: "Firebase Auth UID boş olamaz." };
    }
    const normalized: StaffUserRecord = {
      uid: cleanUid,
      email: record.email.trim(),
      displayName: record.displayName.trim() || record.email.trim(),
      role: record.role,
      active: record.active,
      updatedAt: Date.now(),
    };
    this.staffUsers = [normalized, ...this.staffUsers.filter((u) => u.uid !== cleanUid)];
    this.notifyStaffUsers();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.USERS, cleanUid), stripUndefined(normalized), { merge: true }).catch(
        () => {}
      );
    }
    this.logAuditEvent(
      "STAFF_ROLE_CHANGE",
      cleanUid,
      `${normalized.email || cleanUid} rolü "${ROLE_DEFINITIONS[normalized.role].label}" (${
        normalized.active ? "Aktif" : "Pasif"
      }) olarak güncellendi.`
    );
    return { ok: true };
  }

  public deleteStaffUser(uid: string): { ok: boolean; error?: string } {
    if (this.assignedBackendRole !== "yonetici" && this.sessionUid !== null) {
      return { ok: false, error: "Personel kaydını yalnızca Yönetici silebilir." };
    }
    this.staffUsers = this.staffUsers.filter((u) => u.uid !== uid);
    this.notifyStaffUsers();
    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.USERS, uid)).catch(() => {});
    }
    return { ok: true };
  }

  public subscribeStaffUsers(callback: (items: StaffUserRecord[]) => void): () => void {
    this.staffUsersListeners.add(callback);
    callback(this.getStaffUsers());
    return () => this.staffUsersListeners.delete(callback);
  }

  private notifyStaffUsers(): void {
    const current = this.getStaffUsers();
    this.staffUsersListeners.forEach((cb) => cb(current));
  }

  // --- Audit Log Recording ---
  public getAuditLogs(): AuditEventItem[] {
    return [...this.auditLogs];
  }

  public logAuditEvent(
    actionType: AuditEventItem["actionType"],
    targetId: string,
    summary: string,
    actorEmail?: string
  ): AuditEventItem {
    const now = Date.now();
    const entry: AuditEventItem = {
      id: `AUD-${now}-${Math.floor(Math.random() * 900 + 100)}`,
      actionType,
      actorEmail: actorEmail || auth.currentUser?.email || "yetkili@acarpen.com.tr",
      actorRole: this.activeRole,
      targetId,
      summary,
      timestamp: formatTrNow(),
      createdAt: now,
    };
    this.auditLogs = [entry, ...this.auditLogs];
    this.notifyAuditLogs();

    if (isFirebaseConfigured && this.sessionUid) {
      setDoc(doc(db, COLLECTIONS.AUDIT_LOGS, entry.id), stripUndefined(entry)).catch(() => {});
    }
    return entry;
  }

  public subscribeAuditLogs(callback: (items: AuditEventItem[]) => void): () => void {
    this.auditListeners.add(callback);
    callback(this.getAuditLogs());
    return () => this.auditListeners.delete(callback);
  }

  private notifyAuditLogs(): void {
    const current = this.getAuditLogs();
    this.auditListeners.forEach((cb) => cb(current));
  }

  // --- Quotes & Orders Operations ---
  public getQuotes(): QuoteItem[] {
    return [...this.quotes];
  }

  public addQuote(quote: Omit<QuoteItem, "id" | "date"> & { id?: string }): QuoteItem {
    const now = Date.now();
    const generatedId =
      quote.id || `TKF-${new Date().getFullYear()}-${now.toString().slice(-6)}`;
    const estimatedCost =
      quote.estimatedCost ?? Math.round((quote.estimatedPrice || 0) * 0.68);
    const isStaffWrite = Boolean(this.sessionUid && this.isAuthorizedStaff);
    const newQuote: QuoteItem = {
      paymentStatus: "unpaid",
      paidAmount: 0,
      discountRate: 0,
      extraCost: 0,
      version: 1,
      priceListVersion: "2026-Liste-v1",
      approvalStatus:
        (quote.discountRate || 0) > ROLE_DEFINITIONS[this.activeRole].maxDiscountPct
          ? "pending_approval"
          : "approved",
      routeSteps: [1, 2, 3, 4, 5, 6],
      productionStage: quote.productionStage || statusToDefaultStage(quote.status),
      stationStatus: "waiting",
      estimatedCost,
      actualCost: estimatedCost,
      ...quote,
      id: generatedId,
      createdAt: now,
      date: formatTrNow(),
    };
    this.quotes = [newQuote, ...this.quotes.filter((q) => q.id !== generatedId)];
    this.notifyQuotes();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.QUOTES, newQuote.id), stripUndefined(newQuote)).catch(() => {});
      this.syncPublicOrderTracking(newQuote, isStaffWrite);
    }
    return newQuote;
  }

  public updateQuoteStatus(id: string, status: QuoteItem["status"]): { ok: boolean; error?: string } {
    const existing = this.quotes.find((q) => q.id === id);
    if (!existing) return { ok: false, error: "Sipariş bulunamadı." };

    if (existing.qualityHold && status === "completed") {
      this.logAuditEvent(
        "RBAC_DENIED",
        id,
        `Kalite blokajı (${existing.qualityHoldReason || "Karantina"}) bulunan siparişin teslim/sevk edilmesi engellendi.`
      );
      return {
        ok: false,
        error: `KABUL TESTİ #5 ENGELİ: ${id} siparişinde aktif KALİTE BLOKAJI (${existing.qualityHoldReason || "Uygunsuzluk"}) var! Kalite modülünden serbest bırakılmadan sevkiyata/teslime kapatılamaz.`,
      };
    }

    const nextStage = statusToDefaultStage(status);
    const orderSnapshotAt =
      status === "approved" && !existing.orderSnapshotAt ? formatTrNow() : existing.orderSnapshotAt;

    const updated: QuoteItem = { ...existing, status, productionStage: nextStage, orderSnapshotAt };
    this.quotes = this.quotes.map((q) => (q.id === id ? updated : q));
    this.notifyQuotes();

    if (isFirebaseConfigured) {
      updateDoc(
        doc(db, COLLECTIONS.QUOTES, id),
        stripUndefined({
          status,
          productionStage: nextStage,
          orderSnapshotAt,
        })
      ).catch(() => {});
      this.syncPublicOrderTracking(updated, true);
    }
    return { ok: true };
  }

  public updateQuote(
    id: string,
    fields: Partial<QuoteItem>,
    revisionReason?: string
  ): { ok: boolean; error?: string } {
    const existing = this.quotes.find((q) => q.id === id);
    if (!existing) return { ok: false, error: "Kayıt bulunamadı." };

    const targetStage = fields.productionStage ?? existing.productionStage;
    const isStillHeld = fields.qualityHold !== undefined ? fields.qualityHold : existing.qualityHold;
    if (isStillHeld && targetStage && targetStage >= 5 && fields.qualityHold !== false) {
      this.logAuditEvent(
        "RBAC_DENIED",
        id,
        `Kalite blokajlı ürünün Sevkiyat (Aşama ${targetStage}) adımına ilerletilmesi engellendi.`
      );
      return {
        ok: false,
        error: `KALİTE BLOKAJI ENGELİ: Bu sipariş karantinada olduğu için Sevkiyat / Teslimat aşamasına geçirilemez!`,
      };
    }

    let updatedRevisions = existing.revisions ? [...existing.revisions] : [];
    let nextVersion = existing.version || 1;

    const priceChanged =
      fields.estimatedPrice !== undefined && fields.estimatedPrice !== existing.estimatedPrice;
    const areaChanged =
      fields.totalArea !== undefined && fields.totalArea !== existing.totalArea;
    const dimChanged =
      fields.dimensions !== undefined && fields.dimensions !== existing.dimensions;

    if (priceChanged || areaChanged || dimChanged || revisionReason) {
      const revEntry: QuoteRevision = {
        version: nextVersion,
        date: existing.date || formatTrNow(),
        updatedBy: auth.currentUser?.email || ROLE_DEFINITIONS[this.activeRole].label,
        previousTotal: existing.estimatedPrice || 0,
        previousArea: existing.totalArea || 0,
        dimensionsSummary: existing.dimensions || "-",
        discountRate: existing.discountRate || 0,
        priceListVersion: existing.priceListVersion || "2026-Liste-v1",
        reason: revisionReason || "Teklif kalem / fiyat revizyonu",
      };
      updatedRevisions = [revEntry, ...updatedRevisions];
      nextVersion += 1;

      this.logAuditEvent(
        "QUOTE_REVISION",
        id,
        `v${revEntry.version} (₺${revEntry.previousTotal.toLocaleString("tr-TR")}) -> v${nextVersion} (₺${(fields.estimatedPrice ?? existing.estimatedPrice).toLocaleString("tr-TR")}) revize edildi.`
      );
    }

    const merged: QuoteItem = {
      ...existing,
      ...fields,
      version: nextVersion,
      revisions: updatedRevisions,
    };

    this.quotes = this.quotes.map((q) => (q.id === id ? merged : q));
    this.notifyQuotes();

    if (isFirebaseConfigured) {
      updateDoc(
        doc(db, COLLECTIONS.QUOTES, id),
        stripUndefined({
          ...fields,
          version: nextVersion,
          revisions: updatedRevisions,
        })
      ).catch(() => {});
      this.syncPublicOrderTracking(merged, true);
    }
    return { ok: true };
  }

  public cancelQuoteWithReason(id: string, reason: string): void {
    const existing = this.quotes.find((q) => q.id === id);
    if (!existing) return;
    const cancelledBy = auth.currentUser?.email || ROLE_DEFINITIONS[this.activeRole].label;
    this.updateQuote(id, {
      status: "cancelled",
      cancelReason: reason,
      cancelledBy,
    });
    this.logAuditEvent("ORDER_CANCEL", id, `Kayıt gerekçeli olarak iptal edildi: "${reason}"`);
  }

  public deleteQuote(id: string): void {
    this.quotes = this.quotes.filter((q) => q.id !== id);
    this.notifyQuotes();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.QUOTES, id)).catch(() => {});
      const orderDocId = getOrderTrackingDocId(id);
      if (orderDocId) {
        deleteDoc(doc(db, COLLECTIONS.ORDER_TRACKING, orderDocId)).catch(() => {});
      }
    }
  }

  public subscribeQuotes(callback: (quotes: QuoteItem[]) => void): () => void {
    this.quoteListeners.add(callback);
    callback(this.getQuotes());
    return () => this.quoteListeners.delete(callback);
  }

  private notifyQuotes(): void {
    const current = this.getQuotes();
    this.saveLocalKey("acarpen_live_v3_quotes", current);
    this.quoteListeners.forEach((cb) => cb(current));
  }

  // --- Customers (CRM 360) Operations ---
  public getCustomers(): CustomerRecord[] {
    return [...this.customers];
  }

  public saveCustomer(
    record: Omit<CustomerRecord, "id" | "createdAt"> & { id?: string }
  ): CustomerRecord {
    const now = Date.now();
    const id = record.id || `MUS-${now.toString().slice(-6)}`;
    const fullRecord: CustomerRecord = {
      ...record,
      id,
      createdAt: now,
    };
    this.customers = [fullRecord, ...this.customers.filter((c) => c.id !== id)];
    this.notifyCustomers();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.CUSTOMERS, id), stripUndefined(fullRecord)).catch(() => {});
    }
    return fullRecord;
  }

  public subscribeCustomers(callback: (customers: CustomerRecord[]) => void): () => void {
    this.customerListeners.add(callback);
    callback(this.getCustomers());
    return () => this.customerListeners.delete(callback);
  }

  private notifyCustomers(): void {
    const current = this.getCustomers();
    this.saveLocalKey("acarpen_live_v3_customers", current);
    this.customerListeners.forEach((cb) => cb(current));
  }

  // --- Opportunities (CRM Funnel) Operations ---
  public getOpportunities(): OpportunityItem[] {
    return [...this.opportunities];
  }

  public addOpportunity(
    item: Omit<OpportunityItem, "id" | "createdAt" | "date"> & { id?: string }
  ): OpportunityItem {
    const now = Date.now();
    const id = item.id || `FRS-${now.toString().slice(-6)}`;
    const created: OpportunityItem = {
      ...item,
      id,
      createdAt: now,
      date: formatTrNow(),
    };
    this.opportunities = [created, ...this.opportunities];
    this.notifyOpportunities();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.OPPORTUNITIES, id), stripUndefined(created)).catch(() => {});
    }
    return created;
  }

  public updateOpportunity(id: string, fields: Partial<OpportunityItem>): void {
    this.opportunities = this.opportunities.map((o) => (o.id === id ? { ...o, ...fields } : o));
    this.notifyOpportunities();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.OPPORTUNITIES, id), stripUndefined(fields)).catch(() => {});
    }
  }

  public subscribeOpportunities(callback: (items: OpportunityItem[]) => void): () => void {
    this.opportunityListeners.add(callback);
    callback(this.getOpportunities());
    return () => this.opportunityListeners.delete(callback);
  }

  private notifyOpportunities(): void {
    const current = this.getOpportunities();
    this.saveLocalKey("acarpen_live_v3_opportunities", current);
    this.opportunityListeners.forEach((cb) => cb(current));
  }

  // --- Activities Operations ---
  public getActivities(): ActivityItem[] {
    return [...this.activities];
  }

  public addActivity(item: Omit<ActivityItem, "id" | "createdAt">): ActivityItem {
    const now = Date.now();
    const created: ActivityItem = {
      ...item,
      id: `AKT-${now.toString().slice(-6)}`,
      createdAt: now,
    };
    this.activities = [created, ...this.activities];
    this.notifyActivities();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.ACTIVITIES, created.id), stripUndefined(created)).catch(() => {});
    }
    return created;
  }

  public toggleActivityCompleted(id: string): void {
    const target = this.activities.find((a) => a.id === id);
    if (!target) return;
    const nextState = !target.completed;
    this.activities = this.activities.map((a) =>
      a.id === id ? { ...a, completed: nextState } : a
    );
    this.notifyActivities();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.ACTIVITIES, id), { completed: nextState }).catch(() => {});
    }
  }

  public subscribeActivities(callback: (items: ActivityItem[]) => void): () => void {
    this.activityListeners.add(callback);
    callback(this.getActivities());
    return () => this.activityListeners.delete(callback);
  }

  private notifyActivities(): void {
    const current = this.getActivities();
    this.saveLocalKey("acarpen_live_v3_activities", current);
    this.activityListeners.forEach((cb) => cb(current));
  }

  // --- Inventory & Stock Operations ---
  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  public updateInventoryItem(
    id: string,
    fields: Partial<InventoryItem>,
    reason = "Stok hareketi / düzeltme"
  ): { ok: boolean; error?: string } {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canAdjustStock) {
      this.logAuditEvent(
        "RBAC_DENIED",
        id,
        `${ROLE_DEFINITIONS[this.activeRole].label} rolü ile yetkisiz stok düzeltme denemesi engellendi.`
      );
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Bu rol ile stok düzeltme işlemi yapılamaz.",
      };
    }

    this.inventory = this.inventory.map((item) =>
      item.id === id ? { ...item, ...fields, updatedAt: formatTrNow() } : item
    );
    this.notifyInventory();

    const target = this.inventory.find((i) => i.id === id);
    if (target && isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.INVENTORY, id), stripUndefined(target), { merge: true }).catch(
        () => {}
      );
    }
    this.logAuditEvent("STOCK_ADJUSTMENT", id, `${target?.name || id}: ${reason}`);
    return { ok: true };
  }

  public addInventoryItem(item: Omit<InventoryItem, "id">): InventoryItem {
    const id = `stk-${Date.now().toString().slice(-6)}`;
    const created: InventoryItem = { ...item, id, updatedAt: formatTrNow() };
    this.inventory = [...this.inventory, created];
    this.notifyInventory();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.INVENTORY, id), stripUndefined(created)).catch(() => {});
    }
    this.logAuditEvent("STOCK_ADJUSTMENT", id, `Yeni stok kartı açıldı: ${created.name} (${created.lotNo})`);
    return created;
  }

  public subscribeInventory(callback: (items: InventoryItem[]) => void): () => void {
    this.inventoryListeners.add(callback);
    callback(this.getInventory());
    return () => this.inventoryListeners.delete(callback);
  }

  private notifyInventory(): void {
    const current = this.getInventory();
    this.inventoryListeners.forEach((cb) => cb(current));
  }

  // --- Purchase Orders Operations ---
  public getPurchases(): PurchaseOrderItem[] {
    return [...this.purchases];
  }

  public addPurchaseOrder(
    po: Omit<PurchaseOrderItem, "id" | "createdAt" | "date">
  ): PurchaseOrderItem {
    const now = Date.now();
    const created: PurchaseOrderItem = {
      ...po,
      id: `SAT-${now.toString().slice(-6)}`,
      createdAt: now,
      date: formatTrNow(),
    };
    this.purchases = [created, ...this.purchases];
    this.notifyPurchases();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.PURCHASES, created.id), stripUndefined(created)).catch(() => {});
    }
    return created;
  }

  public updatePurchaseOrder(id: string, fields: Partial<PurchaseOrderItem>): void {
    this.purchases = this.purchases.map((p) => (p.id === id ? { ...p, ...fields } : p));
    this.notifyPurchases();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.PURCHASES, id), stripUndefined(fields)).catch(() => {});
    }
  }

  public subscribePurchases(callback: (items: PurchaseOrderItem[]) => void): () => void {
    this.purchaseListeners.add(callback);
    callback(this.getPurchases());
    return () => this.purchaseListeners.delete(callback);
  }

  private notifyPurchases(): void {
    const current = this.getPurchases();
    this.purchaseListeners.forEach((cb) => cb(current));
  }

  // --- Quality Control Operations ---
  public getQualityInspections(): QualityInspectionItem[] {
    return [...this.qualityInspections];
  }

  public addQualityInspection(
    q: Omit<QualityInspectionItem, "id" | "createdAt" | "date">
  ): QualityInspectionItem {
    const now = Date.now();
    const created: QualityInspectionItem = {
      ...q,
      id: `KAL-${now.toString().slice(-6)}`,
      createdAt: now,
      date: formatTrNow(),
    };
    this.qualityInspections = [created, ...this.qualityInspections];
    this.notifyQuality();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.QUALITY, created.id), stripUndefined(created)).catch(() => {});
    }

    if (q.orderId) {
      const shouldHold = q.result === "Karantina (Blokaj)" || q.result === "Hurda / Yeniden İşleme";
      this.updateQuote(q.orderId, {
        qualityHold: shouldHold,
        qualityHoldReason: shouldHold ? q.defectReason || "Kalite uygunsuzluğu" : "",
        qualityDisposition: shouldHold ? "Bekliyor" : "Serbest",
        qualityInspector: q.inspector,
        qualityCheckedAt: created.date,
        stationStatus: shouldHold ? "quality_hold" : "running",
      });
      this.logAuditEvent(
        shouldHold ? "QUALITY_HOLD" : "QUALITY_RELEASE",
        q.orderId,
        `${q.inspectionType} sonucu: ${q.result} (${q.defectReason || "Uygun"})`
      );
    }

    return created;
  }

  public releaseOrderQualityHold(
    orderId: string,
    disposition: "Yeniden İşleme" | "Şartlı Kabul" | "Müşteri Onayı" | "Serbest",
    note: string
  ): { ok: boolean; error?: string } {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canReleaseQualityHold) {
      this.logAuditEvent(
        "RBAC_DENIED",
        orderId,
        `${ROLE_DEFINITIONS[this.activeRole].label} rolü ile yetkisiz kalite blokajı kaldırma denemesi engellendi.`
      );
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Kalite blokajını yalnızca Kalite Kontrol Uzmanı veya Yönetici kaldırabilir.",
      };
    }

    this.updateQuote(orderId, {
      qualityHold: false,
      qualityDisposition: disposition,
      qualityHoldReason: note,
      stationStatus: "running",
    });

    this.logAuditEvent(
      "QUALITY_RELEASE",
      orderId,
      `Kalite blokajı "${disposition}" kararıyla serbest bırakıldı: ${note}`
    );
    return { ok: true };
  }

  public subscribeQuality(callback: (items: QualityInspectionItem[]) => void): () => void {
    this.qualityListeners.add(callback);
    callback(this.getQualityInspections());
    return () => this.qualityListeners.delete(callback);
  }

  private notifyQuality(): void {
    const current = this.getQualityInspections();
    this.qualityListeners.forEach((cb) => cb(current));
  }

  // --- Messages Operations ---
  public getMessages(): ContactMessage[] {
    return [...this.messages];
  }

  public addMessage(msg: Omit<ContactMessage, "id" | "date" | "isRead">): ContactMessage {
    const now = Date.now();
    const newMsg: ContactMessage = {
      ...msg,
      id: `MSG-${now.toString().slice(-6)}`,
      createdAt: now,
      date: formatTrNow(),
      isRead: false,
    };
    this.messages = [newMsg, ...this.messages];
    this.notifyMessages();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.MESSAGES, newMsg.id), stripUndefined(newMsg)).catch(() => {});
    }
    return newMsg;
  }

  public markMessageAsRead(id: string): void {
    this.messages = this.messages.map((m) => (m.id === id ? { ...m, isRead: true } : m));
    this.notifyMessages();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.MESSAGES, id), { isRead: true }).catch(() => {});
    }
  }

  public deleteMessage(id: string): void {
    this.messages = this.messages.filter((m) => m.id !== id);
    this.notifyMessages();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.MESSAGES, id)).catch(() => {});
    }
  }

  public subscribeMessages(callback: (messages: ContactMessage[]) => void): () => void {
    this.messageListeners.add(callback);
    callback(this.getMessages());
    return () => this.messageListeners.delete(callback);
  }

  private notifyMessages(): void {
    const current = this.getMessages();
    this.saveLocalKey("acarpen_live_v3_messages", current);
    this.messageListeners.forEach((cb) => cb(current));
  }

  // --- Prices Operations (RBAC Protected) ---
  public getPrices(): FactoryPriceItem[] {
    return [...this.prices];
  }

  public updatePrice(id: string, newPrice: number): { ok: boolean; error?: string } {
    if (!this.canEditPrices()) {
      this.logAuditEvent(
        "RBAC_DENIED",
        id,
        `${ROLE_DEFINITIONS[this.activeRole].label} rolü ile yetkisiz fiyat değiştirme denemesi engellendi.`
      );
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Mevcut rolünüz fiyat listesini değiştirmeye yetkili değildir.",
      };
    }

    const oldItem = this.prices.find((p) => p.id === id);
    this.prices = this.prices.map((p) => (p.id === id ? { ...p, m2Price: newPrice } : p));
    this.notifyPrices();

    if (isFirebaseConfigured) {
      const target = this.prices.find((p) => p.id === id);
      if (target) {
        setDoc(doc(db, COLLECTIONS.PRICES, id), stripUndefined(target), { merge: true }).catch(() => {});
      }
    }
    this.logAuditEvent(
      "PRICE_CHANGE",
      id,
      `${oldItem?.name || id} birim fiyatı ₺${oldItem?.m2Price || 0} -> ₺${newPrice} olarak güncellendi.`
    );
    return { ok: true };
  }

  public updatePriceItem(id: string, fields: Partial<FactoryPriceItem>): { ok: boolean; error?: string } {
    if (!this.canEditPrices()) {
      this.logAuditEvent("RBAC_DENIED", id, "Yetkisiz fiyat kartı güncelleme denemesi engellendi.");
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Mevcut rolünüz fiyat kartlarını değiştiremez.",
      };
    }

    this.prices = this.prices.map((p) => (p.id === id ? { ...p, ...fields } : p));
    this.notifyPrices();

    if (isFirebaseConfigured) {
      const target = this.prices.find((p) => p.id === id);
      if (target) {
        setDoc(doc(db, COLLECTIONS.PRICES, id), stripUndefined(target), { merge: true }).catch(() => {});
      }
    }
    return { ok: true };
  }

  public applyBulkPricePercentage(percentChange: number): { ok: boolean; error?: string } {
    if (!this.canEditPrices()) {
      this.logAuditEvent("RBAC_DENIED", "ALL_PRICES", "Yetkisiz toplu fiyat güncelleme denemesi engellendi.");
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Toplu fiyat güncellemesi için Yönetici veya Satış Yöneticisi yetkisi gereklidir.",
      };
    }

    const factor = 1 + percentChange / 100;
    this.prices = this.prices.map((p) => ({
      ...p,
      m2Price: Math.max(10, Math.round((p.m2Price * factor) / 5) * 5),
    }));
    this.notifyPrices();

    if (isFirebaseConfigured) {
      this.prices.forEach((item) => {
        setDoc(doc(db, COLLECTIONS.PRICES, item.id), stripUndefined(item), { merge: true }).catch(() => {});
      });
    }
    this.logAuditEvent(
      "PRICE_CHANGE",
      "BULK_PRICES",
      `Tüm cam birim fiyatlarına toplu %${percentChange > 0 ? `+${percentChange}` : percentChange} güncelleme uygulandı.`
    );
    return { ok: true };
  }

  public addPriceItem(item: Omit<FactoryPriceItem, "id"> & { id?: string }): FactoryPriceItem | null {
    if (!this.canEditPrices()) {
      this.logAuditEvent("RBAC_DENIED", "NEW_PRICE", "Yetkisiz yeni fiyat kalemi ekleme denemesi engellendi.");
      return null;
    }

    const slugId =
      item.id ||
      item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
        "-" +
        Date.now().toString().slice(-4);
    const created: FactoryPriceItem = {
      category: "Özel Cam",
      stock: "Mevcut",
      version: "2026-Liste-v1",
      ...item,
      id: slugId,
    };
    this.prices = [...this.prices, created];
    this.notifyPrices();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.PRICES, created.id), stripUndefined(created)).catch(() => {});
    }
    this.logAuditEvent("PRICE_CHANGE", created.id, `Yeni cam fiyat kartı eklendi: ${created.name} (₺${created.m2Price}/m²)`);
    return created;
  }

  public deletePriceItem(id: string): void {
    if (!this.canEditPrices()) return;
    this.prices = this.prices.filter((p) => p.id !== id);
    this.notifyPrices();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.PRICES, id)).catch(() => {});
    }
  }

  public subscribePrices(callback: (prices: FactoryPriceItem[]) => void): () => void {
    this.priceListeners.add(callback);
    callback(this.getPrices());
    return () => this.priceListeners.delete(callback);
  }

  private notifyPrices(): void {
    const current = this.getPrices();
    this.priceListeners.forEach((cb) => cb(current));
  }

  // --- Extra Services Operations ---
  public getServices(): FactoryServiceItem[] {
    return [...this.services];
  }

  public updateService(id: string, fields: Partial<FactoryServiceItem>): void {
    if (!this.canEditPrices()) return;
    this.services = this.services.map((s) => (s.id === id ? { ...s, ...fields } : s));
    this.notifyServices();

    if (isFirebaseConfigured) {
      const target = this.services.find((s) => s.id === id);
      if (target) {
        setDoc(doc(db, COLLECTIONS.SERVICES, id), stripUndefined(target), { merge: true }).catch(() => {});
      }
    }
  }

  public addService(item: Omit<FactoryServiceItem, "id"> & { id?: string }): FactoryServiceItem | null {
    if (!this.canEditPrices()) return null;
    const slugId =
      item.id ||
      "srv-" +
        item.ad
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") +
        "-" +
        Date.now().toString().slice(-4);
    const created: FactoryServiceItem = {
      birim: "İşlem",
      ...item,
      id: slugId,
    };
    this.services = [...this.services, created];
    this.notifyServices();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.SERVICES, created.id), stripUndefined(created)).catch(() => {});
    }
    return created;
  }

  public deleteService(id: string): void {
    if (!this.canEditPrices()) return;
    this.services = this.services.filter((s) => s.id !== id);
    this.notifyServices();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.SERVICES, id)).catch(() => {});
    }
  }

  public subscribeServices(callback: (services: FactoryServiceItem[]) => void): () => void {
    this.serviceListeners.add(callback);
    callback(this.getServices());
    return () => this.serviceListeners.delete(callback);
  }

  private notifyServices(): void {
    const current = this.getServices();
    this.serviceListeners.forEach((cb) => cb(current));
  }

  // --- Checks Portfolio Operations ---
  public getChecks(): CheckInstrumentItem[] {
    return [...this.checks];
  }

  public addCheck(
    item: Omit<CheckInstrumentItem, "id" | "createdAt" | "issueDate"> & { issueDate?: string }
  ): CheckInstrumentItem {
    const now = Date.now();
    const prefix = item.direction === "received" ? "CEK-AL" : "CEK-VER";
    const created: CheckInstrumentItem = {
      ...item,
      id: `${prefix}-${now.toString().slice(-6)}`,
      issueDate: item.issueDate || formatTrNow().slice(0, 10),
      createdAt: now,
    };
    this.checks = [created, ...this.checks];
    this.notifyChecks();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.CHECKS, created.id), stripUndefined(created)).catch(() => {});
    }
    this.logAuditEvent(
      "INVOICE_ISSUE",
      created.id,
      `${item.direction === "received" ? "Alınan Çek" : "Kesilen Çek"} kaydedildi: ${created.counterparty} — ₺${created.amount.toLocaleString("tr-TR")} (Vade: ${created.dueDate})`
    );
    return created;
  }

  public updateCheck(id: string, fields: Partial<CheckInstrumentItem>): void {
    this.checks = this.checks.map((c) => (c.id === id ? { ...c, ...fields } : c));
    this.notifyChecks();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.CHECKS, id), stripUndefined(fields)).catch(() => {});
    }
  }

  public deleteCheck(id: string): void {
    this.checks = this.checks.filter((c) => c.id !== id);
    this.notifyChecks();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.CHECKS, id)).catch(() => {});
    }
  }

  public subscribeChecks(callback: (items: CheckInstrumentItem[]) => void): () => void {
    this.checkListeners.add(callback);
    callback(this.getChecks());
    return () => this.checkListeners.delete(callback);
  }

  private notifyChecks(): void {
    const current = this.getChecks();
    this.saveLocalKey("acarpen_live_v3_checks", current);
    this.checkListeners.forEach((cb) => cb(current));
  }

  // --- Cash & Bank Ledger Operations ---
  public getCashLedger(): CashLedgerItem[] {
    return [...this.cashLedger];
  }

  public addCashLedgerEntry(
    item: Omit<CashLedgerItem, "id" | "createdAt" | "date">
  ): CashLedgerItem {
    const now = Date.now();
    const created: CashLedgerItem = {
      ...item,
      id: `KASA-${now.toString().slice(-6)}`,
      date: formatTrNow(),
      createdAt: now,
    };
    this.cashLedger = [created, ...this.cashLedger];
    this.notifyCashLedger();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.CASH_LEDGER, created.id), stripUndefined(created)).catch(() => {});
    }
    this.logAuditEvent(
      "INVOICE_ISSUE",
      created.id,
      `Kasa/Banka (${created.accountName}) ${created.type === "in" ? "GİRİŞ" : "ÇIKIŞ"}: ₺${created.amount.toLocaleString("tr-TR")} — ${created.counterparty}`
    );
    return created;
  }

  public deleteCashLedgerEntry(id: string): void {
    this.cashLedger = this.cashLedger.filter((e) => e.id !== id);
    this.notifyCashLedger();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.CASH_LEDGER, id)).catch(() => {});
    }
  }

  public subscribeCashLedger(callback: (items: CashLedgerItem[]) => void): () => void {
    this.cashLedgerListeners.add(callback);
    callback(this.getCashLedger());
    return () => this.cashLedgerListeners.delete(callback);
  }

  private notifyCashLedger(): void {
    const current = this.getCashLedger();
    this.saveLocalKey("acarpen_live_v3_cash_ledger", current);
    this.cashLedgerListeners.forEach((cb) => cb(current));
  }

  public purgeAllTransactionalData(): void {
    const quoteIds = this.quotes.map((q) => q.id);
    const msgIds = this.messages.map((m) => m.id);
    const custIds = this.customers.map((c) => c.id);
    const oppIds = this.opportunities.map((o) => o.id);
    const actIds = this.activities.map((a) => a.id);
    const invIds = this.inventory.map((i) => i.id);
    const purIds = this.purchases.map((p) => p.id);
    const qualIds = this.qualityInspections.map((q) => q.id);
    const chkIds = this.checks.map((c) => c.id);
    const cashIds = this.cashLedger.map((c) => c.id);

    this.quotes = [];
    this.messages = [];
    this.customers = [];
    this.opportunities = [];
    this.activities = [];
    this.inventory = [];
    this.purchases = [];
    this.qualityInspections = [];
    this.checks = [];
    this.cashLedger = [];

    this.notifyQuotes();
    this.notifyMessages();
    this.notifyCustomers();
    this.notifyOpportunities();
    this.notifyActivities();
    this.notifyInventory();
    this.notifyPurchases();
    this.notifyQuality();
    this.notifyChecks();
    this.notifyCashLedger();
    this.cleanupLegacyFakeCache();

    if (isFirebaseConfigured) {
      quoteIds.forEach((id) => {
        deleteDoc(doc(db, COLLECTIONS.QUOTES, id)).catch(() => {});
        const orderDocId = getOrderTrackingDocId(id);
        if (orderDocId) {
          deleteDoc(doc(db, COLLECTIONS.ORDER_TRACKING, orderDocId)).catch(() => {});
        }
      });
      msgIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.MESSAGES, id)).catch(() => {}));
      custIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.CUSTOMERS, id)).catch(() => {}));
      oppIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.OPPORTUNITIES, id)).catch(() => {}));
      actIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.ACTIVITIES, id)).catch(() => {}));
      invIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.INVENTORY, id)).catch(() => {}));
      purIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.PURCHASES, id)).catch(() => {}));
      qualIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.QUALITY, id)).catch(() => {}));
      chkIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.CHECKS, id)).catch(() => {}));
      cashIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.CASH_LEDGER, id)).catch(() => {}));
      LEGACY_MOCK_IDS.forEach((id) => {
        deleteDoc(doc(db, COLLECTIONS.QUOTES, id)).catch(() => {});
        deleteDoc(doc(db, COLLECTIONS.MESSAGES, id)).catch(() => {});
        deleteDoc(doc(db, COLLECTIONS.INVENTORY, id)).catch(() => {});
        deleteDoc(doc(db, COLLECTIONS.CHECKS, id)).catch(() => {});
        deleteDoc(doc(db, COLLECTIONS.CASH_LEDGER, id)).catch(() => {});
      });
    }
  }
}

export const liveStore = new ActiveDataStore();
export const purgeAllAdminTransactionalData = () => liveStore.purgeAllTransactionalData();

export const getAdminChecks = () => liveStore.getChecks();
export const addAdminCheck = (
  item: Omit<CheckInstrumentItem, "id" | "createdAt" | "issueDate"> & { issueDate?: string }
) => liveStore.addCheck(item);
export const updateAdminCheck = (id: string, fields: Partial<CheckInstrumentItem>) =>
  liveStore.updateCheck(id, fields);
export const deleteAdminCheck = (id: string) => liveStore.deleteCheck(id);
export const subscribeAdminChecks = (cb: (items: CheckInstrumentItem[]) => void) =>
  liveStore.subscribeChecks(cb);

export const getAdminCashLedger = () => liveStore.getCashLedger();
export const addAdminCashLedgerEntry = (item: Omit<CashLedgerItem, "id" | "createdAt" | "date">) =>
  liveStore.addCashLedgerEntry(item);
export const deleteAdminCashLedgerEntry = (id: string) => liveStore.deleteCashLedgerEntry(id);
export const subscribeAdminCashLedger = (cb: (items: CashLedgerItem[]) => void) =>
  liveStore.subscribeCashLedger(cb);

export const getAdminQuotes = () => liveStore.getQuotes();
export const addAdminQuote = (q: Omit<QuoteItem, "id" | "date"> & { id?: string }) =>
  liveStore.addQuote(q);
export const updateQuoteStatus = (id: string, status: QuoteItem["status"]) =>
  liveStore.updateQuoteStatus(id, status);
export const updateAdminQuote = (id: string, fields: Partial<QuoteItem>, reason?: string) =>
  liveStore.updateQuote(id, fields, reason);
export const cancelAdminQuoteWithReason = (id: string, reason: string) =>
  liveStore.cancelQuoteWithReason(id, reason);
export const deleteAdminQuote = (id: string) => liveStore.deleteQuote(id);
export const subscribeAdminQuotes = (cb: (quotes: QuoteItem[]) => void) =>
  liveStore.subscribeQuotes(cb);

export const getAdminMessages = () => liveStore.getMessages();
export const addAdminMessage = (m: Omit<ContactMessage, "id" | "date" | "isRead">) =>
  liveStore.addMessage(m);
export const markMessageAsRead = (id: string) => liveStore.markMessageAsRead(id);
export const deleteAdminMessage = (id: string) => liveStore.deleteMessage(id);
export const subscribeAdminMessages = (cb: (messages: ContactMessage[]) => void) =>
  liveStore.subscribeMessages(cb);

export const getAdminPrices = () => liveStore.getPrices();
export const updateAdminPrice = (id: string, price: number) => liveStore.updatePrice(id, price);
export const updateAdminPriceItem = (id: string, fields: Partial<FactoryPriceItem>) =>
  liveStore.updatePriceItem(id, fields);
export const applyBulkAdminPricePercentage = (percent: number) =>
  liveStore.applyBulkPricePercentage(percent);
export const addAdminPrice = (item: Omit<FactoryPriceItem, "id"> & { id?: string }) =>
  liveStore.addPriceItem(item);
export const deleteAdminPrice = (id: string) => liveStore.deletePriceItem(id);
export const subscribeAdminPrices = (cb: (prices: FactoryPriceItem[]) => void) =>
  liveStore.subscribePrices(cb);

export const getAdminServices = () => liveStore.getServices();
export const updateAdminService = (id: string, fields: Partial<FactoryServiceItem>) =>
  liveStore.updateService(id, fields);
export const addAdminService = (item: Omit<FactoryServiceItem, "id"> & { id?: string }) =>
  liveStore.addService(item);
export const deleteAdminService = (id: string) => liveStore.deleteService(id);
export const subscribeAdminServices = (cb: (services: FactoryServiceItem[]) => void) =>
  liveStore.subscribeServices(cb);

export const getAdminCustomers = () => liveStore.getCustomers();
export const saveAdminCustomer = (c: Omit<CustomerRecord, "id" | "createdAt"> & { id?: string }) =>
  liveStore.saveCustomer(c);
export const subscribeAdminCustomers = (cb: (customers: CustomerRecord[]) => void) =>
  liveStore.subscribeCustomers(cb);

export const getAdminOpportunities = () => liveStore.getOpportunities();
export const addAdminOpportunity = (
  o: Omit<OpportunityItem, "id" | "createdAt" | "date"> & { id?: string }
) => liveStore.addOpportunity(o);
export const updateAdminOpportunity = (id: string, fields: Partial<OpportunityItem>) =>
  liveStore.updateOpportunity(id, fields);
export const subscribeAdminOpportunities = (cb: (items: OpportunityItem[]) => void) =>
  liveStore.subscribeOpportunities(cb);

export const getAdminActivities = () => liveStore.getActivities();
export const addAdminActivity = (a: Omit<ActivityItem, "id" | "createdAt">) =>
  liveStore.addActivity(a);
export const toggleAdminActivity = (id: string) => liveStore.toggleActivityCompleted(id);
export const subscribeAdminActivities = (cb: (items: ActivityItem[]) => void) =>
  liveStore.subscribeActivities(cb);

export const getAdminInventory = () => liveStore.getInventory();
export const updateAdminInventory = (id: string, fields: Partial<InventoryItem>, reason?: string) =>
  liveStore.updateInventoryItem(id, fields, reason);
export const addAdminInventory = (item: Omit<InventoryItem, "id">) => liveStore.addInventoryItem(item);
export const subscribeAdminInventory = (cb: (items: InventoryItem[]) => void) =>
  liveStore.subscribeInventory(cb);

export const getAdminPurchases = () => liveStore.getPurchases();
export const addAdminPurchase = (po: Omit<PurchaseOrderItem, "id" | "createdAt" | "date">) =>
  liveStore.addPurchaseOrder(po);
export const updateAdminPurchase = (id: string, fields: Partial<PurchaseOrderItem>) =>
  liveStore.updatePurchaseOrder(id, fields);
export const subscribeAdminPurchases = (cb: (items: PurchaseOrderItem[]) => void) =>
  liveStore.subscribePurchases(cb);

export const getAdminQuality = () => liveStore.getQualityInspections();
export const addAdminQuality = (q: Omit<QualityInspectionItem, "id" | "createdAt" | "date">) =>
  liveStore.addQualityInspection(q);
export const releaseAdminQualityHold = (
  orderId: string,
  disposition: "Yeniden İşleme" | "Şartlı Kabul" | "Müşteri Onayı" | "Serbest",
  note: string
) => liveStore.releaseOrderQualityHold(orderId, disposition, note);
export const subscribeAdminQuality = (cb: (items: QualityInspectionItem[]) => void) =>
  liveStore.subscribeQuality(cb);

export const getAdminAuditLogs = () => liveStore.getAuditLogs();
export const recordAdminAudit = (
  actionType: AuditEventItem["actionType"],
  targetId: string,
  summary: string
) => liveStore.logAuditEvent(actionType, targetId, summary);
export const subscribeAdminAuditLogs = (cb: (items: AuditEventItem[]) => void) =>
  liveStore.subscribeAuditLogs(cb);

export const getActiveUserRole = () => liveStore.getRole();
export const setActiveUserRole = (role: UserRole) => liveStore.setRole(role);
export const subscribeActiveUserRole = (cb: (role: UserRole) => void) => liveStore.subscribeRole(cb);

export const getLiveSession = () => liveStore.getSession();
export const setLiveSession = (uid: string | null) => liveStore.setSession(uid);
export const subscribeLiveSession = (cb: (uid: string | null) => void) => liveStore.subscribeSession(cb);

export const getAdminAuthState = () => liveStore.getAuthState();
export const subscribeAdminAuthState = (cb: (state: AdminAuthState) => void) =>
  liveStore.subscribeAuthState(cb);

export const getStaffUsers = () => liveStore.getStaffUsers();
export const saveStaffUser = (record: Omit<StaffUserRecord, "updatedAt">) =>
  liveStore.saveStaffUser(record);
export const deleteStaffUser = (uid: string) => liveStore.deleteStaffUser(uid);
export const subscribeStaffUsers = (cb: (items: StaffUserRecord[]) => void) =>
  liveStore.subscribeStaffUsers(cb);

/**
 * Resolve sanitized public order tracking status from Firestore (`acarpen_order_tracking`)
 * by order ID (`ORDER_<ID>`) or canonical hashed phone (`PHONE_<SHA256>`), with safe local fallback.
 */
export async function fetchPublicOrderTracking(
  queryStr: string
): Promise<PublicOrderTrackingItem[]> {
  const clean = (queryStr || "").trim();
  if (!clean) return [];

  const canonicalPhone10 = normalizeTrPhone10(clean);
  const orderDocId = getOrderTrackingDocId(clean);
  const phoneDocId = canonicalPhone10 ? getPhoneTrackingDocId(canonicalPhone10) : null;

  if (isFirebaseConfigured) {
    if (orderDocId) {
      try {
        const orderSnap = await getDoc(doc(db, COLLECTIONS.ORDER_TRACKING, orderDocId));
        if (orderSnap.exists()) {
          const item = orderSnap.data() as PublicOrderTrackingItem;
          return [{ ...item, orderId: item.orderId || clean.toUpperCase() }];
        }
      } catch {
        // Ignore network/permission errors and try phone hash / local fallback
      }
    }

    if (phoneDocId) {
      try {
        const phoneSnap = await getDoc(doc(db, COLLECTIONS.ORDER_TRACKING, phoneDocId));
        if (phoneSnap.exists()) {
          const data = phoneSnap.data() as {
            entries?: Record<string, PublicOrderTrackingItem>;
          };
          const entriesMap = data.entries || {};
          const items = Object.values(entriesMap);
          items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          if (items.length > 0) return items;
        }
      } catch {
        // Ignore network/permission errors
      }
    }
  }

  // Fallback for current-session locally created orders or offline dev tests
  const lower = clean.toLowerCase();
  const localMatches = liveStore
    .getQuotes()
    .filter((q) => {
      if (q.id.toLowerCase() === lower) return true;
      if (canonicalPhone10 && normalizeTrPhone10(q.phone) === canonicalPhone10) return true;
      return false;
    })
    .map(toPublicOrderTrackingItem);

  return localMatches;
}

/** @deprecated Prefer fetchPublicOrderTracking returning non-PII projections array. */
export async function fetchPublicQuoteById(id: string): Promise<PublicOrderTrackingItem | null> {
  const results = await fetchPublicOrderTracking(id);
  return results[0] || null;
}
