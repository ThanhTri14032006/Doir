import pool from '../config/database';

async function main() {
  const email = process.argv[2] || 'admin@dior.com';
  const hash = process.argv[3] || '$2a$10$DbBBev58l8sRayKRajNPIespMScDq89VPuZCXO.D85HHfm7JbQKNm'; // hash for admin123

  try {
    const [res] = await pool.query(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [hash, email]
    );
    console.log('Updated admin password for', email);
    console.log('Result:', res as any);
  } catch (err) {
    console.error('Failed to update admin password:', err);
  } finally {
    process.exit(0);
  }
}

main();


