// Orders placed from this browser. Customer accounts are not connected to the
// backend yet, so this is the only reliable way to show a shopper their own orders
// without exposing other customers' records.

import { Order } from '../types';

const KEY = 'stm_my_orders';

export interface SavedOrder extends Order {
  _id: string;
  createdAt: string;
}

export const getSavedOrders = (): SavedOrder[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveOrder = (order: SavedOrder) => {
  const existing = getSavedOrders().filter((o) => o._id !== order._id);
  localStorage.setItem(KEY, JSON.stringify([order, ...existing].slice(0, 50)));
};
