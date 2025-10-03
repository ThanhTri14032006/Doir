-- Tạo database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS dior_fashion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Nếu bạn muốn dùng root với mật khẩu:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_mysql_password';
FLUSH PRIVILEGES;

-- Hoặc tạo user riêng thay vì root:
CREATE USER IF NOT EXISTS 'dior_user'@'localhost' IDENTIFIED BY 'StrongPass123!';
GRANT ALL PRIVILEGES ON dior_fashion.* TO 'dior_user'@'localhost';
FLUSH PRIVILEGES;