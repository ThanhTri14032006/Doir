import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const [result] = await pool.query(
      `INSERT INTO customer_contacts (name, email, message) VALUES (?, ?, ?)`,
      [name, email, message]
    );
    // @ts-ignore
    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
};


