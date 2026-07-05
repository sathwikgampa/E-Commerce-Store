// ─── Inventory Module — Type Definitions ───────────────────────────────────

export type TransactionType = 'IN' | 'OUT';

export type OutgoingReason =
  | 'Customer Purchase'
  | 'Damaged'
  | 'Expired'
  | 'Returned to Supplier'
  | 'Internal Use'
  | 'Lost';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

// ─── Core Transaction Record (append-only audit log) ──────────────────────
export interface InventoryTransaction {
  id: string;
  productId: string;
  productTitle: string;
  sku: string;
  type: TransactionType;
  quantity: number;
  previousStock: number;
  currentStock: number;
  reason?: OutgoingReason | string;
  supplier?: string;
  purchaseCost?: number;
  sellingPrice?: number;
  invoiceNumber?: string;
  handledBy: string;
  remarks?: string;
  timestamp: string; // ISO string
  date: string;      // YYYY-MM-DD for easy date filtering
}

// ─── Per-Product Stock Record ─────────────────────────────────────────────
export interface ProductStockRecord {
  productId: string;
  productTitle: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  openingStock: number;
  lowStockThreshold: number;
  lastUpdated: string; // ISO string
  status: StockStatus;
  soldToday: number;
  soldThisMonth: number;
  totalIncoming: number;
  totalOutgoing: number;
  averageCost?: number;
}

// ─── Supplier ─────────────────────────────────────────────────────────────
export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
}

// ─── Form Data Shapes ─────────────────────────────────────────────────────
export interface IncomingStockFormData {
  productId: string;
  quantity: number;
  supplier: string;
  purchaseCost: number;
  sellingPrice?: number;
  invoiceNumber?: string;
  date: string;
  remarks?: string;
  addedBy: string;
}

export interface OutgoingStockFormData {
  productId: string;
  quantity: number;
  reason: OutgoingReason;
  remarks?: string;
  date: string;
  handledBy: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────
export interface InventoryDashboardStats {
  totalProducts: number;
  totalUnitsInStock: number;
  todayIncoming: number;
  todayOutgoing: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  inventoryValue: number;
  recentTransactions: InventoryTransaction[];
}

// ─── Inventory Store State ────────────────────────────────────────────────
export interface InventoryStoreState {
  transactions: InventoryTransaction[];
  stockMap: Record<string, ProductStockRecord>;
  suppliers: Supplier[];
  initialized: boolean;
}
