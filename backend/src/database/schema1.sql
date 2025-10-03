-- Tạo DB và dùng DB
CREATE DATABASE IF NOT EXISTS dior_fashion
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE dior_fashion;

-- Bảng users
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer','admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Bảng addresses
CREATE TABLE IF NOT EXISTS addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Bảng categories
CREATE TABLE IF NOT EXISTS categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id INT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_parent_id (parent_id)
);

-- Bảng products
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  category_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE NOT NULL,
  stock_quantity INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_slug (slug),
  INDEX idx_category_id (category_id),
  INDEX idx_is_featured (is_featured),
  INDEX idx_is_active (is_active)
);

-- Bảng product_images
CREATE TABLE IF NOT EXISTS product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id)
);

-- Bảng product_variants
CREATE TABLE IF NOT EXISTS product_variants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  size VARCHAR(20),
  color VARCHAR(50),
  sku VARCHAR(100) UNIQUE NOT NULL,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  stock_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_sku (sku)
);

-- Bảng cart_items
CREATE TABLE IF NOT EXISTS cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  UNIQUE KEY unique_cart_item (user_id, product_id, variant_id)
);

-- Bảng orders
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  shipping_address_id INT NOT NULL,
  payment_method VARCHAR(50),
  payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE RESTRICT,
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status)
);

-- Bảng order_items
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  variant_id INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT,
  INDEX idx_order_id (order_id)
);

-- Bảng wishlist_items
CREATE TABLE IF NOT EXISTS wishlist_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  UNIQUE KEY unique_wishlist_item (user_id, product_id)
);

-- Bảng reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_user_id (user_id)
);

-- Bảng lưu liên hệ khách hàng từ trang Liên hệ
CREATE TABLE IF NOT EXISTS customer_contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DỮ LIỆU MẪU
-- Categories
INSERT IGNORE INTO categories (id, name, slug, description, image_url) VALUES
(1, 'Women', 'women', 'Elegant women''s fashion collection', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600'),
(2, 'Men', 'men', 'Sophisticated men''s fashion collection', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600'),
(3, 'Accessories', 'accessories', 'Luxury fashion accessories', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600'),
(4, 'Bags', 'bags', 'Designer handbags and luggage', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'),
(5, 'Shoes', 'shoes', 'Premium footwear collection', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600');

-- Users mẫu (mật khẩu hash bcrypt của 'admin123' và 'customer123' cần thay tay nếu không dùng backend hash)
-- Ở đây để trống để bạn tự thêm qua ứng dụng; hoặc có thể chèn hash nếu có sẵn.

-- Products (một vài mẫu)
INSERT IGNORE INTO products (id, name, slug, description, category_id, price, compare_at_price, sku, stock_quantity, is_featured, is_active) VALUES
(1, 'Dior Bar Jacket', 'dior-bar-jacket', 'Iconic Bar jacket in wool and silk', 1, 3500.00, NULL, 'DBJ-001', 15, 1, 1),
(2, 'Dior Homme Suit', 'dior-homme-suit', 'Tailored two-piece suit in virgin wool', 2, 3800.00, 4200.00, 'DHS-001', 12, 1, 1),
(3, 'Lady Dior Bag', 'lady-dior-bag', 'Iconic Lady Dior bag in lambskin', 4, 5000.00, NULL, 'LDB-001', 8, 1, 1);

-- Ảnh sản phẩm
INSERT IGNORE INTO product_images (product_id, image_url, alt_text, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600', 'Dior Bar Jacket', 0),
(2, 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600', 'Dior Homme Suit', 0),
(3, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', 'Lady Dior Bag', 0);

-- Variants ví dụ
INSERT IGNORE INTO product_variants (product_id, size, color, sku, price_adjustment, stock_quantity) VALUES
(1, 'M', 'Navy', 'DBJ-001-M-NV', 0, 5),
(2, '50', 'Black', 'DHS-001-50-BK', 0, 4);

-- Địa chỉ mẫu (nếu có user id=2)
-- INSERT INTO addresses (user_id, address_line1, city, state, postal_code, country, is_default)
-- VALUES (2, '123 Fashion Street', 'Paris', 'Île-de-France', '75001', 'France', 1); 