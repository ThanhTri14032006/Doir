import type { Response } from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/database';
import type { AuthRequest } from '../types';

const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user?.id;
    const { shipping_address_id, payment_method } = req.body;
    
    // Get cart items
    const [cartItems] = await pool.query(
      `SELECT ci.*, p.price, pv.price_adjustment
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_variants pv ON ci.variant_id = pv.id
       WHERE ci.user_id = ?`,
      [userId]
    );
    
    if ((cartItems as any[]).length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate totals
    let subtotal = 0;
    for (const item of cartItems as any[]) {
      const itemPrice = item.price + (item.price_adjustment || 0);
      subtotal += itemPrice * item.quantity;
    }
    
    const tax = subtotal * 0.1; // 10% tax
    const shipping_cost = 10; // Fixed shipping
    const total = subtotal + tax + shipping_cost;
    
    const order_number = generateOrderNumber();
    
    // Create order
    const [orderResult] = await pool.query(
      `INSERT INTO orders (user_id, order_number, status, subtotal, tax, shipping_cost, total, shipping_address_id, payment_method)
       VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?)`,
      [userId, order_number, subtotal, tax, shipping_cost, total, shipping_address_id, payment_method]
    );
    
    const orderId = (orderResult as any).insertId;
    
    // Create order items
    for (const item of cartItems as any[]) {
      const itemPrice = item.price + (item.price_adjustment || 0);
      const totalPrice = itemPrice * item.quantity;
      
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, variant_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.variant_id || null, item.quantity, itemPrice, totalPrice]
      );
      
      // Update stock
      if (item.variant_id) {
        await pool.query(
          'UPDATE product_variants SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.variant_id]
        );
      } else {
        await pool.query(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
    }
    
    // Clear cart
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    
    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        order_number,
        total
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const [orders] = await pool.query(
      `SELECT o.*, a.address_line1, a.city, a.state, a.postal_code
       FROM orders o
       LEFT JOIN addresses a ON o.shipping_address_id = a.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );
    
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const [orders] = await pool.query<import('mysql2/promise').RowDataPacket[]>(
      `SELECT o.*, a.address_line1, a.address_line2, a.city, a.state, a.postal_code, a.country
       FROM orders o
       LEFT JOIN addresses a ON o.shipping_address_id = a.id
       WHERE o.id = ? AND o.user_id = ?`,
      [id, userId]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Get order items
    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as image,
        pv.size, pv.color
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       LEFT JOIN product_variants pv ON oi.variant_id = pv.id
       WHERE oi.order_id = ?`,
      [id]
    );
    
    res.json({
      ...orders[0],
      items
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT o.*, u.email, u.first_name, u.last_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    
    const params: any[] = [];
    
    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), offset);
    
    const [orders] = await pool.query(query, params);
    
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};