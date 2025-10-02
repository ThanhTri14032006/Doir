import type { Response } from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/database';
import type { AuthRequest } from '../types';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const [items] = await pool.query(
      `SELECT ci.*, p.name, p.price, p.slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as image,
        pv.size, pv.color, pv.price_adjustment
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_variants pv ON ci.variant_id = pv.id
       WHERE ci.user_id = ?`,
      [userId]
    );
    
    res.json(items);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user?.id;
    const { product_id, variant_id, quantity } = req.body;
    
    // Check if item already exists
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))',
      [userId, product_id, variant_id || null, variant_id || null]
    );
    
    if ((existing as any[]).length > 0) {
      // Update quantity
      const newQuantity = (existing as any)[0].quantity + quantity;
      await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, (existing as any)[0].id]
      );
    } else {
      // Insert new item
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
        [userId, product_id, variant_id || null, quantity]
      );
    }
    
    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity } = req.body;
    
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, id, userId]
    );
    
    res.json({ message: 'Cart item updated' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};