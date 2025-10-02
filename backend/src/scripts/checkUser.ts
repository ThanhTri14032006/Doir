import pool from '../config/database';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.argv[2] || 'admin@dior.com';
  const password = process.argv[3] || 'admin123';

  try {
    const [rows] = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const users = rows as any[];
    if (users.length === 0) {
      console.log('No user found for email:', email);
      process.exit(0);
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    console.log('User:', { id: user.id, email: user.email, role: user.role });
    console.log('Hash prefix:', String(user.password_hash).slice(0, 10));
    console.log('Password matches input?', match);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

main();


