USE dior_fashion;
-- Mật khẩu:
-- admin@dior.com / admin123
-- customer@example.com / customer123
-- Hash bcrypt cost=10 đã tạo sẵn
INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name, role)
VALUES
(1, 'admin@dior.com',    '$2a$10$GPr3kH7Wv6p4C2JmQmG1eOl9oQH9O1k5l6gZ5oX5h1yZ1H0lVYF5e', 'Admin',    'Dior', 'admin'),
(2, 'customer@example.com','$2a$10$hUj7vQb9qXQm2Qk5lG4J6e1xv5Yl0mK9nL2sQ3tV8pW4rX6yZ8eMu', 'John', 'Doe',  'customer');
-- Địa chỉ mẫu cho user id=2
INSERT IGNORE INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country, is_default)
VALUES
(2, '123 Fashion Street', NULL, 'Paris', 'Île-de-France', '75001', 'France', TRUE);