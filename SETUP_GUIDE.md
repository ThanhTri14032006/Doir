# 🚀 Dior Fashion E-Commerce - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** package manager

## 🔧 Step-by-Step Setup

### Step 1: Install MySQL

1. Download and install MySQL from the official website
2. During installation, set a root password (remember this!)
3. Start MySQL service:
   - **Windows**: MySQL should start automatically
   - **Mac**: `brew services start mysql`
   - **Linux**: `sudo systemctl start mysql`

4. Verify MySQL is running:
```bash
mysql --version
```

### Step 2: Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create environment file**:
```bash
# Copy the example file
cp .env.example .env

# Or create manually with this content:
```

Edit `.env` file with your MySQL credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=dior_fashion

# JWT Configuration
JWT_SECRET=dior_fashion_secret_key_2024
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

4. **Setup Database** (This creates tables and adds sample data):
```bash
npm run db:setup
```

You should see output like:
```
🔧 Setting up database...
✅ Database schema created successfully
📦 Inserting sample data...
✅ Admin user created (email: admin@dior.com, password: admin123)
✅ Test customer created (email: customer@example.com, password: customer123)
✅ Categories inserted
✅ Products and variants inserted
✅ Sample address inserted
✅ All sample data inserted successfully

📊 Database Summary:
   - 2 users (1 admin, 1 customer)
   - 5 categories
   - 25 products
   - Product variants and images
   - 1 sample address

🔐 Login Credentials:
   Admin: admin@dior.com / admin123
   Customer: customer@example.com / customer123
```

5. **Start backend server**:
```bash
npm run dev
```

The backend should now be running on `http://localhost:5000`

### Step 3: Frontend Setup

1. **Open a new terminal** and navigate to frontend directory:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start frontend development server**:
```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`

### Step 4: Test the Application

1. **Open your browser** and go to: `http://localhost:5173`

2. **Test Registration**:
   - Click "Register" or "Login" in the header
   - Click "Register" link
   - Fill in the form:
     - First Name: Your Name
     - Last Name: Your Last Name
     - Email: yourname@example.com
     - Phone: +1234567890 (optional)
     - Password: password123
   - Click "Register"
   - You should be automatically logged in and redirected to the home page

3. **Test Login with Pre-created Accounts**:
   - **Customer Account**:
     - Email: customer@example.com
     - Password: customer123
   
   - **Admin Account**:
     - Email: admin@dior.com
     - Password: admin123

4. **Browse Products**:
   - Click "Shop" in the navigation
   - You should see 25 Dior products
   - Try filtering by category (Women, Men, Accessories, etc.)
   - Click on a product to see details

5. **Test Shopping Cart**:
   - Add products to cart
   - View cart
   - Update quantities
   - Proceed to checkout

## 🗄️ Database Verification

To verify your database was set up correctly:

1. **Connect to MySQL**:
```bash
mysql -u root -p
```

2. **Check the database**:
```sql
USE dior_fashion;

-- Check users
SELECT id, email, first_name, last_name, role FROM users;

-- Check categories
SELECT * FROM categories;

-- Check products count
SELECT COUNT(*) as total_products FROM products;

-- Check a few products
SELECT id, name, price, category_id FROM products LIMIT 5;
```

## 🔍 Troubleshooting

### Problem: "Cannot connect to MySQL"
**Solution**:
- Verify MySQL is running: `mysql --version`
- Check your password in `.env` file
- Try connecting manually: `mysql -u root -p`

### Problem: "Port 5000 already in use"
**Solution**:
- Change PORT in backend `.env` to 5001 or another port
- Update CORS_ORIGIN if needed

### Problem: "Database setup failed"
**Solution**:
- Drop the database and try again:
```sql
mysql -u root -p
DROP DATABASE IF EXISTS dior_fashion;
```
- Then run `npm run db:setup` again

### Problem: "Frontend can't connect to backend"
**Solution**:
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify CORS_ORIGIN in backend `.env` matches frontend URL

### Problem: "Products not showing"
**Solution**:
- Check if database setup completed successfully
- Verify products exist: `SELECT COUNT(*) FROM products;`
- Check browser console for API errors

## 📊 What's Included

### Database Content:
- **5 Categories**: Women, Men, Accessories, Bags, Shoes
- **25 Products**: Luxury Dior items with prices ranging from $250 to $5,000
- **Product Variants**: Different sizes and colors for clothing and shoes
- **Product Images**: Placeholder images for all products
- **2 Test Users**: Admin and Customer accounts

### Features Working:
- ✅ User Registration & Login
- ✅ Product Catalog with Filtering
- ✅ Product Details
- ✅ Shopping Cart
- ✅ Checkout Process
- ✅ Order Management
- ✅ User Account Pages

## 🎯 Next Steps

1. **Customize Products**: Edit products in the database or through admin panel
2. **Add Real Images**: Replace placeholder images with actual product photos
3. **Configure Payment**: Integrate payment gateway (Stripe, PayPal, etc.)
4. **Deploy**: Deploy to production server

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages in terminal
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

## 🎉 Success!

If you can:
- ✅ Register a new account
- ✅ Login successfully
- ✅ See 25 products in the catalog
- ✅ Add items to cart
- ✅ View your account page

**Congratulations! Your Dior Fashion E-Commerce platform is fully set up and running!** 🎊