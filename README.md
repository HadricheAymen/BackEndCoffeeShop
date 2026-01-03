# ☕ Coffee Shop Backend API

A comprehensive Node.js backend API for a coffee shop application with authentication, order management, favorites, and review system.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Coffee Products**: Browse coffee products organized by categories
- **Order Management**: Place orders with customizable options (cup size, sugar level)
- **Automatic Discounts**: Smart discount system based on quantity and order value
- **Favorites**: Save favorite coffees with preferred settings for quick reordering
- **Reviews & Ratings**: Submit and manage reviews with automatic rating calculations
- **Order History**: Complete order tracking with status updates
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## 📋 Prerequisites

- **Node.js**: v18.x or latest LTS version
- **MySQL**: v8.0 or higher
- **npm**: v9.x or higher

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd BackEndCoffeeShop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE coffee_shop_db;
```

Run the schema file to create tables:

```bash
mysql -u root -p coffee_shop_db < database/schema.sql
```

Or manually execute the SQL file in your MySQL client.

### 4. Environment Configuration

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=coffee_shop_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 5. Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- 5 categories (Coffee, Cappuccino, Espresso, Latte, Tea)
- 19 coffee products
- 5 test users
- 7 sample orders
- 7 favorites
- 18 reviews with ratings

## 🎯 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:

```
http://localhost:3000/api-docs
```

### Health Check

```
GET http://localhost:3000/health
```

## 🔑 Test User Credentials

All test users have the password: `password123`

- john.doe@example.com
- jane.smith@example.com
- bob.wilson@example.com
- alice.brown@example.com
- charlie.davis@example.com

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id/coffees` - Get coffees by category

### Coffees
- `GET /api/coffees` - Get all coffees (with filtering)
- `GET /api/coffees/:id` - Get coffee details

### Orders (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's order history
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

### Favorites (Protected)
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get user's favorites
- `DELETE /api/favorites/:id` - Remove from favorites

### Reviews (Protected)
- `POST /api/reviews` - Submit a review
- `GET /api/reviews/coffee/:coffeeId` - Get reviews for a coffee
- `GET /api/reviews/user` - Get user's reviews
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

## 💡 Usage Examples

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create an Order (requires authentication)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "coffee_id": 1,
        "quantity": 2,
        "cup_size": "medium",
        "sugar_level": "low"
      }
    ]
  }'
```

### Submit a Review (requires authentication)

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "coffee_id": 1,
    "rating": 5,
    "comment": "Excellent coffee!"
  }'
```

## 💰 Discount System

The API automatically applies discounts based on the following rules:

- **Quantity Discount**: 10% off for orders with 5 or more items
- **Value Discount**: $2.00 off for orders over $15.00
- The system applies whichever discount provides greater savings

### Cup Size Pricing

- **Small**: Base price
- **Medium**: Base price × 1.2
- **Large**: Base price × 1.6

## 📁 Project Structure

```
BackEndCoffeeShop/
├── database/
│   └── schema.sql              # Database schema
├── src/
│   ├── config/
│   │   ├── database.js         # Database connection
│   │   └── swagger.js          # Swagger configuration
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── categoryController.js
│   │   ├── coffeeController.js
│   │   ├── orderController.js
│   │   ├── favoriteController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── errorHandler.js     # Error handling
│   │   └── validate.js         # Validation middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Coffee.js
│   │   ├── Order.js
│   │   ├── Favorite.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── coffeeRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── favoriteRoutes.js
│   │   └── reviewRoutes.js
│   ├── seeders/
│   │   └── index.js            # Database seeder
│   ├── utils/
│   │   ├── jwt.js              # JWT utilities
│   │   └── password.js         # Password hashing
│   └── validators/
│       ├── authValidator.js
│       ├── orderValidator.js
│       ├── reviewValidator.js
│       └── favoriteValidator.js
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js                   # Application entry point
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication with 24-hour expiration
- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: 5 login attempts per 15 minutes per IP
- **Input Validation**: express-validator for all endpoints
- **SQL Injection Protection**: Parameterized queries
- **Security Headers**: Helmet.js middleware
- **CORS**: Configurable cross-origin resource sharing

## 🗄️ Database Schema

### Tables

1. **users** - User accounts
2. **categories** - Coffee categories
3. **coffee_products** - Coffee products with ratings
4. **orders** - Customer orders
5. **order_items** - Order line items
6. **favorites** - User favorite coffees
7. **reviews** - Product reviews and ratings

### Key Features

- Foreign key constraints for data integrity
- Indexes on frequently queried fields
- Automatic timestamp tracking
- Cascading deletes where appropriate
- Check constraints for data validation

## 🧪 Testing

You can test the API using:

1. **Swagger UI**: `http://localhost:3000/api-docs`
2. **Postman**: Import the endpoints from Swagger
3. **cURL**: Use the examples provided above
4. **Any HTTP client**: Thunder Client, Insomnia, etc.

## 📝 Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-reload
- `npm run seed` - Seed the database with sample data

## 🐛 Error Handling

The API uses centralized error handling with consistent JSON responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🌟 Features Highlights

### Review System
- Users can review each coffee product once
- Automatic average rating calculation
- Real-time rating updates on coffee products
- Optional order association for verified purchases

### Order Management
- Sequential order number generation (ORD-001, ORD-002, etc.)
- Automatic price calculation with size modifiers
- Smart discount application
- Order status tracking (pending → preparing → ready → completed)

### Favorites
- Quick access to preferred coffees
- Save preferred cup size and sugar level
- One-click reordering capability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using Node.js, Express, and MySQL**

#   B a c k E n d C o f f e e S h o p  
 #   B a c k E n d C o f f e e S h o p  
 