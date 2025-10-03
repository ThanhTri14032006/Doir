import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import pool from '../config/database';

const setupDatabase = async () => {
  try {
    console.log('🔧 Setting up database...');

    // Support multiple possible schema files
    const candidateFiles = [
      'schema.sql',
      'schema1.sql',
      'account.sql',
      'remoto.sql'
    ];

    const existingFiles = candidateFiles
      .map((name) => ({ name, fullPath: path.join(__dirname, name) }))
      .filter(({ fullPath }) => fs.existsSync(fullPath));

    if (existingFiles.length === 0) {
      throw new Error(`No schema file found. Looked for: ${candidateFiles.join(', ')}`);
    }

    let combinedSql = '';
    for (const { name, fullPath } of existingFiles) {
      console.log(`📄 Loading schema file: ${name}`);
      combinedSql += '\n' + fs.readFileSync(fullPath, 'utf8');
    }

    const statements = combinedSql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await pool.query(statement);
    }
    
    console.log('✅ Database schema created successfully');
    
    // Insert sample data
    await insertSampleData();
    
    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

const insertSampleData = async () => {
  try {
    console.log('📦 Inserting sample data...');
    
    // Insert admin user with hashed password
    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name, role)
      VALUES (1, 'admin@dior.com', ?, 'Admin', 'Dior', 'admin')
    `, [adminPassword]);
    console.log('✅ Admin user created (email: admin@dior.com, password: admin123)');
    
    // Insert test customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    await pool.query(`
      INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, role)
      VALUES (2, 'customer@example.com', ?, 'John', 'Doe', '+1234567890', 'customer')
    `, [customerPassword]);
    console.log('✅ Test customer created (email: customer@example.com, password: customer123)');
    
    // Insert categories
    await pool.query(`
      INSERT IGNORE INTO categories (id, name, slug, description, image_url) VALUES
      (1, 'Women', 'women', 'Elegant women\'s fashion collection', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600'),
      (2, 'Men', 'men', 'Sophisticated men\'s fashion collection', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600'),
      (3, 'Accessories', 'accessories', 'Luxury fashion accessories', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600'),
      (4, 'Bags', 'bags', 'Designer handbags and luggage', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'),
      (5, 'Shoes', 'shoes', 'Premium footwear collection', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600')
    `);
    console.log('✅ Categories inserted');
    
    // Insert products
    const products = [
      // Women's Fashion
      { name: 'Dior Bar Jacket', slug: 'dior-bar-jacket', description: 'Iconic Bar jacket in wool and silk, featuring the signature nipped waist and rounded shoulders', category_id: 1, price: 3500.00, sku: 'DBJ-001', stock: 15, featured: true },
      { name: 'Miss Dior Dress', slug: 'miss-dior-dress', description: 'Elegant silk dress with floral embroidery and pleated skirt', category_id: 1, price: 2800.00, sku: 'MDD-001', stock: 20, featured: true },
      { name: 'Dior Oblique Trench Coat', slug: 'dior-oblique-trench', description: 'Classic trench coat in Dior Oblique jacquard', category_id: 1, price: 4200.00, sku: 'DOT-001', stock: 10, featured: false },
      { name: 'Dior Silk Blouse', slug: 'dior-silk-blouse', description: 'Luxurious silk blouse with bow detail', category_id: 1, price: 1200.00, sku: 'DSB-001', stock: 25, featured: false },
      { name: 'Dior Pleated Skirt', slug: 'dior-pleated-skirt', description: 'Midi pleated skirt in fine wool', category_id: 1, price: 1800.00, sku: 'DPS-001', stock: 18, featured: false },
      
      // Men's Fashion
      { name: 'Dior Homme Suit', slug: 'dior-homme-suit', description: 'Tailored two-piece suit in virgin wool', category_id: 2, price: 3800.00, sku: 'DHS-001', stock: 12, featured: true },
      { name: 'Dior Atelier Shirt', slug: 'dior-atelier-shirt', description: 'Cotton poplin shirt with embroidered bee motif', category_id: 2, price: 850.00, sku: 'DAS-001', stock: 30, featured: false },
      { name: 'Dior Cashmere Sweater', slug: 'dior-cashmere-sweater', description: 'Luxurious cashmere crewneck sweater', category_id: 2, price: 1500.00, sku: 'DCS-001', stock: 22, featured: false },
      { name: 'Dior Wool Coat', slug: 'dior-wool-coat', description: 'Double-breasted wool coat with peak lapels', category_id: 2, price: 3200.00, sku: 'DWC-001', stock: 8, featured: true },
      { name: 'Dior Leather Jacket', slug: 'dior-leather-jacket', description: 'Premium leather bomber jacket', category_id: 2, price: 4500.00, sku: 'DLJ-001', stock: 10, featured: false },
      
      // Bags
      { name: 'Lady Dior Bag', slug: 'lady-dior-bag', description: 'Iconic Lady Dior bag in lambskin with Cannage stitching', category_id: 4, price: 5000.00, sku: 'LDB-001', stock: 8, featured: true },
      { name: 'Dior Saddle Bag', slug: 'dior-saddle-bag', description: 'Signature Saddle bag in Dior Oblique jacquard', category_id: 4, price: 3500.00, sku: 'DSB-002', stock: 12, featured: true },
      { name: 'Dior Book Tote', slug: 'dior-book-tote', description: 'Spacious Book Tote in embroidered canvas', category_id: 4, price: 3000.00, sku: 'DBT-001', stock: 15, featured: true },
      { name: 'Dior Bobby Bag', slug: 'dior-bobby-bag', description: 'Compact Bobby bag in calfskin', category_id: 4, price: 2800.00, sku: 'DBB-001', stock: 20, featured: false },
      { name: 'Dior Caro Bag', slug: 'dior-caro-bag', description: 'Elegant Caro bag with chain strap', category_id: 4, price: 3800.00, sku: 'DCB-001', stock: 10, featured: false },
      
      // Accessories
      { name: 'Dior Sunglasses', slug: 'dior-sunglasses', description: 'Oversized sunglasses with gold-tone details', category_id: 3, price: 450.00, sku: 'DSG-001', stock: 40, featured: false },
      { name: 'Dior Leather Belt', slug: 'dior-leather-belt', description: 'Reversible leather belt with CD buckle', category_id: 3, price: 650.00, sku: 'DLB-001', stock: 35, featured: false },
      { name: 'Dior Silk Scarf', slug: 'dior-silk-scarf', description: 'Square silk scarf with signature print', category_id: 3, price: 390.00, sku: 'DSS-001', stock: 50, featured: false },
      { name: 'Dior Tie', slug: 'dior-tie', description: 'Silk tie with Dior Oblique pattern', category_id: 3, price: 250.00, sku: 'DTI-001', stock: 45, featured: false },
      { name: 'Dior Watch', slug: 'dior-watch', description: 'Luxury timepiece with leather strap', category_id: 3, price: 2500.00, sku: 'DWA-001', stock: 15, featured: true },
      
      // Shoes
      { name: 'Dior B27 Sneakers', slug: 'dior-b27-sneakers', description: 'Low-top sneakers in white calfskin', category_id: 5, price: 1100.00, sku: 'DB27-001', stock: 25, featured: true },
      { name: 'Dior Pumps', slug: 'dior-pumps', description: 'Classic pointed-toe pumps in patent leather', category_id: 5, price: 950.00, sku: 'DPU-001', stock: 30, featured: false },
      { name: 'Dior Loafers', slug: 'dior-loafers', description: 'Leather loafers with CD hardware', category_id: 5, price: 890.00, sku: 'DLO-001', stock: 28, featured: false },
      { name: 'Dior Ankle Boots', slug: 'dior-ankle-boots', description: 'Leather ankle boots with block heel', category_id: 5, price: 1400.00, sku: 'DAB-001', stock: 18, featured: false },
      { name: 'Dior Derby Shoes', slug: 'dior-derby-shoes', description: 'Classic Derby shoes in polished leather', category_id: 5, price: 980.00, sku: 'DDS-001', stock: 22, featured: false }
    ];
    
    for (const product of products) {
      const [result] = await pool.query(
        `INSERT IGNORE INTO products (name, slug, description, category_id, price, sku, stock_quantity, is_featured, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [product.name, product.slug, product.description, product.category_id, product.price, product.sku, product.stock, product.featured]
      );
      
      const productId = (result as any).insertId || (result as any).affectedRows;
      
      if (productId) {
        // Add product images
        await pool.query(
          `INSERT IGNORE INTO product_images (product_id, image_url, alt_text, display_order)
           VALUES (?, ?, ?, 0)`,
          [productId, `https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600`, product.name]
        );
        
        // Add variants for clothing items
        if (product.category_id === 1 || product.category_id === 2) {
          const sizes = ['XS', 'S', 'M', 'L', 'XL'];
          const colors = ['Black', 'White', 'Navy', 'Beige'];
          
          for (let i = 0; i < 2; i++) {
            await pool.query(
              `INSERT IGNORE INTO product_variants (product_id, size, color, sku, stock_quantity)
               VALUES (?, ?, ?, ?, ?)`,
              [productId, sizes[i], colors[i % colors.length], `${product.sku}-${sizes[i]}-${colors[i % colors.length]}`, Math.floor(Math.random() * 10) + 5]
            );
          }
        }
        
        // Add variants for shoes
        if (product.category_id === 5) {
          const sizes = ['36', '37', '38', '39', '40', '41', '42', '43'];
          for (let i = 0; i < 3; i++) {
            await pool.query(
              `INSERT IGNORE INTO product_variants (product_id, size, color, sku, stock_quantity)
               VALUES (?, ?, ?, ?, ?)`,
              [productId, sizes[i + 2], 'Black', `${product.sku}-${sizes[i + 2]}`, Math.floor(Math.random() * 8) + 3]
            );
          }
        }
      }
    }
    
    console.log('✅ Products and variants inserted');
    
    // Insert sample address for test customer
    await pool.query(`
      INSERT IGNORE INTO addresses (user_id, address_line1, city, state, postal_code, country, is_default)
      VALUES (2, '123 Fashion Street', 'Paris', 'Île-de-France', '75001', 'France', 1)
    `);
    console.log('✅ Sample address inserted');
    
    console.log('✅ All sample data inserted successfully');
    console.log('\n📊 Database Summary:');
    console.log('   - 2 users (1 admin, 1 customer)');
    console.log('   - 5 categories');
    console.log('   - 25 products');
    console.log('   - Product variants and images');
    console.log('   - 1 sample address');
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@dior.com / admin123');
    console.log('   Customer: customer@example.com / customer123');
  } catch (error) {
    console.error('❌ Sample data insertion failed:', error);
    throw error;
  }
};

setupDatabase();