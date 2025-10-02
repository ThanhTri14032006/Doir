# Dior Fashion E-Commerce Platform

A full-stack luxury fashion e-commerce website built with React 19, TypeScript, Material-UI v7, Node.js, Express, and MySQL.

## 🚀 Features

### Frontend
- ⚛️ React 19 with TypeScript
- 🎨 Material-UI v7 for elegant UI components
- 🔄 Redux Toolkit for state management
- 🛣️ React Router v7 for navigation
- 💅 Emotion for styling
- 📱 Fully responsive design

### Backend
- 🟢 Node.js + Express.js
- 🔷 TypeScript
- 🗄️ MySQL database
- 🔐 JWT authentication
- ✅ Input validation
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)

### Key Functionality
- 🛍️ Product catalog with filtering and search
- 🛒 Shopping cart management
- 💳 Checkout process
- 👤 User authentication and account management
- 📦 Order tracking
- 👨‍💼 Admin dashboard capabilities

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
cd "a:\vs\IRT-STORE\ban hang"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=dior_fashion
# JWT_SECRET=your_secret_key

# Setup database
npm run db:setup

# Start backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── database/        # Database schema and setup
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript types
│   │   └── server.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── store/           # Redux store and services
    │   ├── App.tsx          # Main app component
    │   ├── main.tsx         # Entry point
    │   └── theme.ts         # MUI theme configuration
    ├── package.json
    └── vite.config.ts
```

## 🗄️ Database Schema

The application uses the following main tables:
- `users` - User accounts
- `products` - Product catalog
- `categories` - Product categories
- `cart_items` - Shopping cart
- `orders` - Customer orders
- `order_items` - Order details
- `addresses` - Shipping addresses
- `reviews` - Product reviews
- `wishlist_items` - User wishlists

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)

## 🎨 Design System

The application uses a luxury-focused design system:
- **Primary Color**: Black (#000000)
- **Secondary Color**: Gold (#D4AF37)
- **Typography**: Playfair Display (headings), Inter (body)
- **Layout**: Clean, minimalist with elegant spacing

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- SQL injection prevention
- XSS protection

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to your hosting service (e.g., Heroku, AWS, DigitalOcean)

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder to your hosting service (e.g., Vercel, Netlify, AWS S3)

## 📝 Default Admin Account

After running `npm run db:setup`, a default admin account is created:
- Email: `admin@dior.com`
- Password: (You need to hash and set this in the setup script)

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server with HMR
```

## 📦 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Material-UI for the component library
- Redux Toolkit for state management
- Express.js for the backend framework
- MySQL for the database

## 📧 Support

For support, email support@diorfashion.com or open an issue in the repository.

---

Built with ❤️ for luxury fashion enthusiasts