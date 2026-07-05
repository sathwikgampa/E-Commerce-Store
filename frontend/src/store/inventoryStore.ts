import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InventoryStoreState,
  InventoryTransaction,
  ProductStockRecord,
  Supplier,
  IncomingStockFormData,
  OutgoingStockFormData,
  StockStatus,
} from '../types/inventory';

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateId(): string {
  return `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateSku(productId: string, title: string): string {
  const prefix = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  const suffix = productId.replace(/[^a-z0-9]/gi, '').slice(-4).toUpperCase();
  return `STB-${prefix}${suffix}`;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function computeStatus(stock: number, threshold: number): StockStatus {
  if (stock === 0) return 'Out of Stock';
  if (stock <= threshold) return 'Low Stock';
  return 'In Stock';
}

// ─── Seed data for the 10 fallback products ─────────────────────────────────

const SEED_STOCK: Record<
  string,
  { title: string; initialStock: number; threshold: number; cost: number }
> = {
  'tb-1': { title: 'NCERT Physics Class 12',         initialStock: 42, threshold: 10, cost: 180 },
  'tb-2': { title: 'NCERT Mathematics Class 10',     initialStock: 58, threshold: 12, cost: 110 },
  'nb-1': { title: 'Classmate Premium Notebook',     initialStock: 8,  threshold: 15, cost: 250 },
  'nb-2': { title: 'Sri Thirumala Practical Register',initialStock: 30, threshold: 8,  cost: 60  },
  'ss-1': { title: 'Maped Geometry Box',             initialStock: 25, threshold: 10, cost: 130 },
  'eng-1':{ title: 'Higher Engineering Mathematics', initialStock: 15, threshold: 5,  cost: 620 },
  'qb-1': { title: 'VGS SSC Question Bank',          initialStock: 0,  threshold: 10, cost: 100 },
  'comp-1':{ title: 'Quantitative Aptitude R.S. Aggarwal', initialStock: 20, threshold: 8, cost: 420 },
  'comp-2':{ title: 'TSPSC Group-IV Study Guide',    initialStock: 12, threshold: 6,  cost: 230 },
  'bag-1': { title: 'Skybags School Backpack',        initialStock: 7,  threshold: 5,  cost: 850 },
  'bag-2': { title: 'Wildcraft College Backpack',     initialStock: 5,  threshold: 4,  cost: 1100},
};

function buildSeedStockMap(): Record<string, ProductStockRecord> {
  const map: Record<string, ProductStockRecord> = {};
  for (const [productId, data] of Object.entries(SEED_STOCK)) {
    const sku = generateSku(productId, data.title);
    map[productId] = {
      productId,
      productTitle: data.title,
      sku,
      currentStock: data.initialStock,
      reservedStock: 0,
      openingStock: data.initialStock,
      lowStockThreshold: data.threshold,
      lastUpdated: new Date().toISOString(),
      status: computeStatus(data.initialStock, data.threshold),
      soldToday: 0,
      soldThisMonth: 0,
      totalIncoming: data.initialStock,
      totalOutgoing: 0,
      averageCost: data.cost,
    };
  }
  return map;
}

function buildSeedTransactions(
  stockMap: Record<string, ProductStockRecord>
): InventoryTransaction[] {
  const txns: InventoryTransaction[] = [];
  for (const [productId, data] of Object.entries(SEED_STOCK)) {
    if (data.initialStock === 0) continue;
    const record = stockMap[productId];
    txns.push({
      id: generateId(),
      productId,
      productTitle: data.title,
      sku: record.sku,
      type: 'IN',
      quantity: data.initialStock,
      previousStock: 0,
      currentStock: data.initialStock,
      reason: 'Initial Stock',
      supplier: 'Opening Balance',
      purchaseCost: data.cost,
      handledBy: 'Admin',
      remarks: 'Initial inventory seed',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  }
  return txns;
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface InventoryActions {
  // Initialize a product in the stock map if not present
  ensureProductStock: (
    productId: string,
    productTitle: string,
    sku?: string
  ) => ProductStockRecord;

  // Add incoming stock
  addIncomingStock: (data: IncomingStockFormData) => InventoryTransaction;

  // Deduct outgoing stock
  addOutgoingStock: (
    data: OutgoingStockFormData
  ) => { success: true; transaction: InventoryTransaction } | { success: false; error: string };

  // Update low stock threshold
  setLowStockThreshold: (productId: string, threshold: number) => void;

  // Update reserved stock (e.g. pending orders)
  setReservedStock: (productId: string, reserved: number) => void;

  // Add/update a supplier
  upsertSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'> & { id?: string }) => void;

  // Seed data (called once on first init)
  seedInitialData: () => void;

  // Getters
  getStockForProduct: (productId: string) => ProductStockRecord | undefined;
  getLowStockProducts: () => ProductStockRecord[];
  getTransactionsForProduct: (productId: string) => InventoryTransaction[];
  getDashboardStats: () => {
    totalProducts: number;
    totalUnitsInStock: number;
    todayIncoming: number;
    todayOutgoing: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    inventoryValue: number;
    recentTransactions: InventoryTransaction[];
  };
}

type InventoryStore = InventoryStoreState & InventoryActions;

// ─── Zustand Store ───────────────────────────────────────────────────────────

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ────────────────────────────────────────────────────
      transactions: [],
      stockMap: {},
      suppliers: [
        { id: 's-1', name: 'DC Books Distributor', contactPerson: 'Ravi Kumar', phone: '9876543210', email: 'ravi@dcbooks.com', address: 'Hyderabad', createdAt: new Date().toISOString() },
        { id: 's-2', name: 'NCERT Regional Office', contactPerson: 'Meera Sharma', phone: '9123456789', email: 'meera@ncert.nic.in', address: 'New Delhi', createdAt: new Date().toISOString() },
        { id: 's-3', name: 'ITC Classmate Depot', contactPerson: 'Suresh Babu', phone: '9988776655', email: 'depot@classmate.in', address: 'Vijayawada', createdAt: new Date().toISOString() },
      ],
      initialized: false,

      // ── Seed Initial Data ────────────────────────────────────────────────
      seedInitialData: () => {
        const { initialized } = get();
        if (initialized) return;
        const stockMap = buildSeedStockMap();
        const transactions = buildSeedTransactions(stockMap);
        set({ stockMap, transactions, initialized: true });
      },

      // ── Ensure Product Stock Entry ───────────────────────────────────────
      ensureProductStock: (productId, productTitle, sku) => {
        const { stockMap } = get();
        if (stockMap[productId]) return stockMap[productId];
        const newSku = sku ?? generateSku(productId, productTitle);
        const newRecord: ProductStockRecord = {
          productId,
          productTitle,
          sku: newSku,
          currentStock: 0,
          reservedStock: 0,
          openingStock: 0,
          lowStockThreshold: 10,
          lastUpdated: new Date().toISOString(),
          status: 'Out of Stock',
          soldToday: 0,
          soldThisMonth: 0,
          totalIncoming: 0,
          totalOutgoing: 0,
          averageCost: 0,
        };
        set({ stockMap: { ...stockMap, [productId]: newRecord } });
        return newRecord;
      },

      // ── Add Incoming Stock ───────────────────────────────────────────────
      addIncomingStock: (data) => {
        const { stockMap, transactions } = get();
        const existing = stockMap[data.productId];
        if (!existing) throw new Error('Product not found in stock map');

        const prevStock = existing.currentStock;
        const newStock = prevStock + data.quantity;
        const now = new Date().toISOString();

        // Weighted average cost update
        const prevTotalCost = (existing.averageCost ?? 0) * prevStock;
        const newTotalCost = prevTotalCost + data.purchaseCost * data.quantity;
        const newAvgCost = newStock > 0 ? newTotalCost / newStock : data.purchaseCost;

        const transaction: InventoryTransaction = {
          id: generateId(),
          productId: data.productId,
          productTitle: existing.productTitle,
          sku: existing.sku,
          type: 'IN',
          quantity: data.quantity,
          previousStock: prevStock,
          currentStock: newStock,
          supplier: data.supplier,
          purchaseCost: data.purchaseCost,
          sellingPrice: data.sellingPrice,
          invoiceNumber: data.invoiceNumber,
          handledBy: data.addedBy,
          remarks: data.remarks,
          timestamp: now,
          date: data.date,
        };

        const updatedRecord: ProductStockRecord = {
          ...existing,
          currentStock: newStock,
          lastUpdated: now,
          status: computeStatus(newStock, existing.lowStockThreshold),
          totalIncoming: existing.totalIncoming + data.quantity,
          averageCost: newAvgCost,
        };

        set({
          stockMap: { ...stockMap, [data.productId]: updatedRecord },
          transactions: [transaction, ...transactions],
        });
        return transaction;
      },

      // ── Add Outgoing Stock ───────────────────────────────────────────────
      addOutgoingStock: (data) => {
        const { stockMap, transactions } = get();
        const existing = stockMap[data.productId];
        if (!existing) return { success: false, error: 'Product not found in stock map' };

        const available = existing.currentStock - existing.reservedStock;
        if (data.quantity > available) {
          return { success: false, error: `Cannot deduct ${data.quantity} units. Only ${available} units available.` };
        }

        const prevStock = existing.currentStock;
        const newStock = prevStock - data.quantity;
        const now = new Date().toISOString();
        const isToday = data.date === today();
        const isThisMonth = data.date.startsWith(now.substring(0, 7));

        const transaction: InventoryTransaction = {
          id: generateId(),
          productId: data.productId,
          productTitle: existing.productTitle,
          sku: existing.sku,
          type: 'OUT',
          quantity: data.quantity,
          previousStock: prevStock,
          currentStock: newStock,
          reason: data.reason,
          handledBy: data.handledBy,
          remarks: data.remarks,
          timestamp: now,
          date: data.date,
        };

        const isSale = data.reason === 'Customer Purchase';
        const updatedRecord: ProductStockRecord = {
          ...existing,
          currentStock: newStock,
          lastUpdated: now,
          status: computeStatus(newStock, existing.lowStockThreshold),
          totalOutgoing: existing.totalOutgoing + data.quantity,
          soldToday: isToday && isSale ? existing.soldToday + data.quantity : existing.soldToday,
          soldThisMonth: isThisMonth && isSale ? existing.soldThisMonth + data.quantity : existing.soldThisMonth,
        };

        set({
          stockMap: { ...stockMap, [data.productId]: updatedRecord },
          transactions: [transaction, ...transactions],
        });
        return { success: true, transaction };
      },

      // ── Set Low Stock Threshold ──────────────────────────────────────────
      setLowStockThreshold: (productId, threshold) => {
        const { stockMap } = get();
        const existing = stockMap[productId];
        if (!existing) return;
        set({
          stockMap: {
            ...stockMap,
            [productId]: {
              ...existing,
              lowStockThreshold: threshold,
              status: computeStatus(existing.currentStock, threshold),
            },
          },
        });
      },

      // ── Set Reserved Stock ───────────────────────────────────────────────
      setReservedStock: (productId, reserved) => {
        const { stockMap } = get();
        const existing = stockMap[productId];
        if (!existing) return;
        set({ stockMap: { ...stockMap, [productId]: { ...existing, reservedStock: reserved } } });
      },

      // ── Upsert Supplier ──────────────────────────────────────────────────
      upsertSupplier: (supplierData) => {
        const { suppliers } = get();
        if (supplierData.id) {
          set({
            suppliers: suppliers.map((s) =>
              s.id === supplierData.id ? { ...s, ...supplierData } as Supplier : s
            ),
          });
        } else {
          const newSupplier: Supplier = {
            ...supplierData,
            id: `s-${Date.now()}`,
            createdAt: new Date().toISOString(),
          };
          set({ suppliers: [newSupplier, ...suppliers] });
        }
      },

      // ── Getters ──────────────────────────────────────────────────────────
      getStockForProduct: (productId) => get().stockMap[productId],

      getLowStockProducts: () =>
        Object.values(get().stockMap).filter(
          (r) => r.status === 'Low Stock' || r.status === 'Out of Stock'
        ),

      getTransactionsForProduct: (productId) =>
        get().transactions.filter((t) => t.productId === productId),

      getDashboardStats: () => {
        const { stockMap, transactions } = get();
        const todayStr = today();
        const records = Object.values(stockMap);

        const totalUnitsInStock = records.reduce((s, r) => s + r.currentStock, 0);
        const lowStockProducts = records.filter((r) => r.status === 'Low Stock').length;
        const outOfStockProducts = records.filter((r) => r.status === 'Out of Stock').length;
        const inventoryValue = records.reduce(
          (s, r) => s + r.currentStock * (r.averageCost ?? 0),
          0
        );

        const todayTxns = transactions.filter((t) => t.date === todayStr);
        const todayIncoming = todayTxns
          .filter((t) => t.type === 'IN')
          .reduce((s, t) => s + t.quantity, 0);
        const todayOutgoing = todayTxns
          .filter((t) => t.type === 'OUT')
          .reduce((s, t) => s + t.quantity, 0);

        return {
          totalProducts: records.length,
          totalUnitsInStock,
          todayIncoming,
          todayOutgoing,
          lowStockProducts,
          outOfStockProducts,
          inventoryValue,
          recentTransactions: transactions.slice(0, 25),
        };
      },
    }),
    {
      name: 'inventory_data',
      version: 1,
    }
  )
);
