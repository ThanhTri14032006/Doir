import type { Request, Response } from 'express';
import pool from '../config/database';
// Removed direct Category generic usage on mysql2 query to satisfy typings

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const [categories] = await pool.query(
      'SELECT * FROM categories ORDER BY name'
    );
    
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [categories] = await pool.query<import('mysql2/promise').RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(categories[0]);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, parent_id, image_url } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, parent_id, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, slug, description, parent_id || null, image_url || null]
    );
    
    res.status(201).json({
      message: 'Category created successfully',
      categoryId: (result as any).insertId
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    await pool.query(
      `UPDATE categories SET ${fields} WHERE id = ?`,
      [...values, id]
    );
    
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Failed to delete category' });
  }
};