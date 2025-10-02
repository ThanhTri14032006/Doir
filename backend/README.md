# Dior Fashion Backend API

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dior_fashion

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 3. Setup Database
Make sure MySQL is running, then execute:
```bash
npm run db:setup
```

This will:
- Create all database tables
- Insert sample categories (Women, Men, Accessories, Bags, Shoes)
- Insert 25 sample Dior products with images and variants
- Create test accounts:
  - **Admin**: admin@dior.com / admin123
  - **Customer**: customer@example.com / customer123

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📊 Database Schema

### Tables Created:
- **users** - Customer and admin accounts
- **addresses** - Shipping addresses
- **categories** - Product categories
- **products** - Product catalog
- **product_images** - Product photos
- **product_variants** - Size/color variants
- **cart_items** - Shopping cart
- **orders** - Customer orders
- **order_items** - Order details
- **wishlist_items** - User wishlists
- **reviews** - Product reviews

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals

### Categories
- `GET /api/categories` - List all categories

### Cart (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart

### Orders (Requires Authentication)
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order

## 🧪 Testing the API

### Register a New Account
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Get Featured Products
```bash
curl http://localhost:5000/api/products/featured
```

## 📦 Sample Products Included

The database setup includes 25 luxury Dior products:

### Women's Fashion (5 items)
- Dior Bar Jacket - $3,500
- Miss Dior Dress - $2,800
- Dior Oblique Trench Coat - $4,200
- Dior Silk Blouse - $1,200
- Dior Pleated Skirt - $1,800

### Men's Fashion (5 items)
- Dior Homme Suit - $3,800
- Dior Atelier Shirt - $850
- Dior Cashmere Sweater - $1,500
- Dior Wool Coat - $3,200
- Dior Leather Jacket - $4,500

### Bags (5 items)
- Lady Dior Bag - $5,000
- Dior Saddle Bag - $3,500
- Dior Book Tote - $3,000
- Dior Bobby Bag - $2,800
- Dior Caro Bag - $3,800

### Accessories (5 items)
- Dior Sunglasses - $450
- Dior Leather Belt - $650
- Dior Silk Scarf - $390
- Dior Tie - $250
- Dior Watch - $2,500

### Shoes (5 items)
- Dior B27 Sneakers - $1,100
- Dior Pumps - $950
- Dior Loafers - $890
- Dior Ankle Boots - $1,400
- Dior Derby Shoes - $980

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT authentication
- ✅ Input validation with express-validator
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ SQL injection prevention (parameterized queries)

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run database setup
npm run db:setup

# Start development server (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DB_HOST | MySQL host | localhost |
| DB_PORT | MySQL port | 3306 |
| DB_USER | MySQL user | root |
| DB_PASSWORD | MySQL password | - |
| DB_NAME | Database name | dior_fashion |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | Token expiration | 7d |
| CORS_ORIGIN | Allowed origin | http://localhost:5173 |

## 🐛 Troubleshooting

### Database Connection Failed
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database exists or will be created

### Port Already in Use
- Change PORT in `.env` file
- Or stop the process using port 5000

### Authentication Errors
- Verify JWT_SECRET is set in `.env`
- Check token expiration settings

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Documentation](https://jwt.io/)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)









-- Dior Fashion E-commerce Database Schema


---KIỂM TRA ACCOUNT ------
$body = '{"email":"admin@dior.com","password":"admin123"}'
Invoke-WebRequest -UseBasicParsing -Method POST `
  -Uri http://localhost:5001/api/auth/login `
  -ContentType application/json -Body $body | % Content
----LẤY LAI ACCOUTN --
cd "A:\vs\IRT-STORE\ban hang\backend"
node -e "require('bcryptjs').hash('admin123',10).then(h=>console.log(h))"
---KHỞI ĐỘNG LẠI ACCOUTN TREN MYSQL ----
UPDATE users
SET password_hash = '<DÁN_HASH_VỪA_TẠO>'
WHERE email = 'admin@dior.com';