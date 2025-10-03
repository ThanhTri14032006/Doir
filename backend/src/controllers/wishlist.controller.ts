import type { Response } from 'express';
import pool from '../config/database';
import { validationResult } from 'express-validator';
import type { AuthRequest } from '../types';

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const [items] = await pool.query(
      `SELECT wi.id, wi.product_id, p.name, p.slug, p.price,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as main_image
       FROM wishlist_items wi
       JOIN products p ON wi.product_id = p.id
       WHERE wi.user_id = ?
       ORDER BY wi.created_at DESC`,
      [userId]
    );
    res.json(items);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user?.id;
    const { product_id } = req.body as { product_id: number };

    // Upsert-like behavior: ignore if exists
    await pool.query(
      'INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
      [userId, product_id]
    );

    res.status(201).json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    await pool.query(
      'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
};

export const clearWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    await pool.query('DELETE FROM wishlist_items WHERE user_id = ?', [userId]);
    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ message: 'Failed to clear wishlist' });
  }
};



