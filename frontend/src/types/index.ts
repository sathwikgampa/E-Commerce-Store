export interface Product {
  _id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  inStock: boolean;
  rating: number;
  badge?: string;
  image?: string;
  description?: string;
  desc?: string; // fallback field for short description
  // Inventory fields (populated from inventory store)
  sku?: string;
  stock?: number;
  reservedStock?: number;
  lowStockThreshold?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  _id?: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id?: string;
  name: string;
  phone: string;
  pincode?: string;
  address: string;
  paymentMethod: 'COD' | 'UPI';
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Delivered';
  createdAt?: string;
}

export interface Review {
  _id?: string;
  text: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}
