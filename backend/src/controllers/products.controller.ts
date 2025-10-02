import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/database';
// Removed direct Product generic usage on mysql2 query to satisfy typings

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sort = 'created_at', 
      order = 'DESC',
      page = 1,
      limit = 12
    } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as main_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    
    const params: any[] = [];
    
    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }
    
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ` ORDER BY p.${sort} ${order}`;
    
    const offset = (Number(page) - 1) * Number(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);
    
    const [products] = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1';
    const countParams: any[] = [];
    
    if (category) {
      countQuery += ' AND c.slug = ?';
      countParams.push(category);
    }
    
    if (minPrice) {
      countQuery += ' AND p.price >= ?';
      countParams.push(minPrice);
    }
    
    if (maxPrice) {
      countQuery += ' AND p.price <= ?';
      countParams.push(maxPrice);
    }
    
    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    
    const [countResult] = await pool.query(countQuery, countParams);
    const total = (countResult as any)[0].total;
    
    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [products] = await pool.query<import('mysql2/promise').RowDataPacket[]>(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ? AND p.is_active = 1`,
      [id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get images
    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
      [id]
    );
    
    // Get variants
    const [variants] = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = ?',
      [id]
    );
    
    res.json({
      ...products[0],
      images,
      variants
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    const [products] = await pool.query(
      `SELECT p.*, c.name as category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as main_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_featured = 1 AND p.is_active = 1
       ORDER BY p.created_at DESC
       LIMIT 8`
    );
    
    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Failed to fetch featured products' });
  }
};

export const getNewArrivals = async (_req: Request, res: Response) => {
  try {
    const [products] = await pool.query(
      `SELECT p.*, c.name as category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as main_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = 1
       ORDER BY p.created_at DESC
       LIMIT 12`
    );
    
    res.json(products);
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json({ message: 'Failed to fetch new arrivals' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      name,
      slug,
      description,
      category_id,
      price,
      compare_at_price,
      sku,
      stock_quantity,
      is_featured,
      images,
      variants
    } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO products (name, slug, description, category_id, price, compare_at_price, sku, stock_quantity, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, category_id, price, compare_at_price || null, sku, stock_quantity || 0, is_featured || false]
    );
    
    const productId = (result as any).insertId;
    
    // Insert images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES (?, ?, ?, ?)',
          [productId, images[i].url, images[i].alt || name, i]
        );
      }
    }
    
    // Insert variants
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await pool.query(
          'INSERT INTO product_variants (product_id, size, color, sku, price_adjustment, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)',
          [productId, variant.size, variant.color, variant.sku, variant.price_adjustment || 0, variant.stock_quantity || 0]
        );
      }
    }
    
    res.status(201).json({
      message: 'Product created successfully',
      productId
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates)
      .filter(key => !['images', 'variants'].includes(key))
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.keys(updates)
      .filter(key => !['images', 'variants'].includes(key))
      .map(key => updates[key]);
    
    await pool.query(
      `UPDATE products SET ${fields} WHERE id = ?`,
      [...values, id]
    );
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};