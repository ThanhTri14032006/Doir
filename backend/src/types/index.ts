import type { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'customer' | 'admin';
  };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category_id: number;
  price: number;
  compare_at_price?: number;
  sku: string;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  image_url?: string;
  created_at: Date;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  shipping_address_id: number;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  variant_id?: number;
  quantity: number;
  created_at: Date;
}