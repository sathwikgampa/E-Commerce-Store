import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInventoryStore } from '../store/inventoryStore';
import type { IncomingStockFormData, OutgoingStockFormData } from '../types/inventory';

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export const useInventoryDashboardStats = () => {
  const getDashboardStats = useInventoryStore((s) => s.getDashboardStats);
  return useQuery({
    queryKey: ['inventory', 'dashboard'],
    queryFn: () => getDashboardStats(),
    staleTime: 30_000,
  });
};

// ─── All Transactions ─────────────────────────────────────────────────────────

export const useInventoryTransactions = () => {
  const transactions = useInventoryStore((s) => s.transactions);
  return useQuery({
    queryKey: ['inventory', 'transactions'],
    queryFn: () => transactions,
    staleTime: 0,
  });
};

// ─── Stock Map (all products) ─────────────────────────────────────────────────

export const useStockMap = () => {
  const stockMap = useInventoryStore((s) => s.stockMap);
  return useQuery({
    queryKey: ['inventory', 'stockMap'],
    queryFn: () => Object.values(stockMap),
    staleTime: 0,
  });
};

// ─── Single Product Stock ─────────────────────────────────────────────────────

export const useProductStock = (productId: string) => {
  const getStockForProduct = useInventoryStore((s) => s.getStockForProduct);
  return useQuery({
    queryKey: ['inventory', 'stock', productId],
    queryFn: () => getStockForProduct(productId) ?? null,
    enabled: !!productId,
  });
};

// ─── Low Stock Products ───────────────────────────────────────────────────────

export const useLowStockProducts = () => {
  const getLowStockProducts = useInventoryStore((s) => s.getLowStockProducts);
  return useQuery({
    queryKey: ['inventory', 'lowStock'],
    queryFn: () => getLowStockProducts(),
    staleTime: 60_000,
  });
};

// ─── Suppliers ────────────────────────────────────────────────────────────────

export const useSuppliers = () => {
  const suppliers = useInventoryStore((s) => s.suppliers);
  return useQuery({
    queryKey: ['inventory', 'suppliers'],
    queryFn: () => suppliers,
  });
};

// ─── Add Incoming Stock Mutation ──────────────────────────────────────────────

export const useAddIncomingStock = () => {
  const queryClient = useQueryClient();
  const addIncomingStock = useInventoryStore((s) => s.addIncomingStock);

  return useMutation({
    mutationFn: async (data: IncomingStockFormData) => {
      return addIncomingStock(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

// ─── Add Outgoing Stock Mutation ──────────────────────────────────────────────

export const useAddOutgoingStock = () => {
  const queryClient = useQueryClient();
  const addOutgoingStock = useInventoryStore((s) => s.addOutgoingStock);

  return useMutation({
    mutationFn: async (data: OutgoingStockFormData) => {
      const result = addOutgoingStock(data);
      if (!result.success) throw new Error(result.error);
      return result.transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

// ─── Set Low Stock Threshold Mutation ─────────────────────────────────────────

export const useSetLowStockThreshold = () => {
  const queryClient = useQueryClient();
  const setLowStockThreshold = useInventoryStore((s) => s.setLowStockThreshold);

  return useMutation({
    mutationFn: async ({ productId, threshold }: { productId: string; threshold: number }) => {
      setLowStockThreshold(productId, threshold);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};
