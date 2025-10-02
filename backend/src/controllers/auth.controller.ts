import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { sign, verify, type Secret, type SignOptions } from 'jsonwebtoken';
import pool from '../config/database';
// Removed direct User generic usage on mysql2 query to satisfy typings

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    
    const { email, password, first_name, last_name, phone } = req.body;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    // Check if user exists
    const [existingUsers] = await pool.query<import('mysql2/promise').RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered. Please use a different email or login.' });
    }
    
    // Hash password with bcrypt (10 rounds)
    const password_hash = await bcrypt.hash(password, 10);
    
    // Create user in database
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [email, password_hash, first_name, last_name, phone || null, 'customer']
    );
    
    const userId = (result as any).insertId;
    
    console.log(`✅ New user registered: ${email} (ID: ${userId})`);
    
    // Generate JWT token
    const token = sign(
      { id: userId, email, role: 'customer' },
      (process.env.JWT_SECRET || 'secret') as Secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );
    
    res.status(201).json({
      message: 'Account created successfully! Welcome to Dior Fashion.',
      token,
      user: {
        id: userId,
        email,
        first_name,
        last_name,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Registration failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { email, password } = req.body;
    
    // Find user
    const [users] = await pool.query<import('mysql2/promise').RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      (process.env.JWT_SECRET || 'secret') as Secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }
    
    const decoded = verify(token, (process.env.JWT_SECRET || 'secret') as Secret) as {
      id: number;
      email: string;
      role: 'customer' | 'admin';
    };
    
    const newToken = sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      (process.env.JWT_SECRET || 'secret') as Secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );
    
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};