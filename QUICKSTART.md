# ⚡ Quick Start Guide

Get the Coffee Shop API up and running in 5 minutes!

## Prerequisites Check

Make sure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ MySQL 8.0+ installed and running
- ✅ npm installed (`npm --version`)

## Step-by-Step Setup

### 1️⃣ Install Dependencies (1 minute)

```bash
npm install
```

### 2️⃣ Setup Database (2 minutes)

**Option A: Using MySQL Command Line**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE coffee_shop_db;
exit;

# Import schema
mysql -u root -p coffee_shop_db < database/schema.sql
```

**Option B: Using MySQL Workbench or phpMyAdmin**
1. Create a new database named `coffee_shop_db`
2. Import the `database/schema.sql` file

### 3️⃣ Configure Environment (30 seconds)

The `.env` file is already created with default settings. If you need to change the database password:

```bash
# Edit .env file and update DB_PASSWORD
DB_PASSWORD=your_mysql_password
```

### 4️⃣ Seed Sample Data (30 seconds)

```bash
npm run seed
```

You should see:
```
🎉 Database seeding completed successfully!

📊 Summary:
   - 5 categories
   - 19 coffee products
   - 5 users
   - 7 orders
   - 7 favorites
   - 18 reviews
```

### 5️⃣ Start the Server (10 seconds)

```bash
npm run dev
```

You should see:
```
🚀 Coffee Shop API Server is running
📍 Port: 3000
📚 API Documentation: http://localhost:3000/api-docs
🏥 Health Check: http://localhost:3000/health
```

## 🎯 Test It Out!

### Open API Documentation
Visit: http://localhost:3000/api-docs

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

You'll get a response with a JWT token:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "john.doe@example.com",
      "username": "johndoe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Browse Coffees
```bash
curl http://localhost:3000/api/coffees
```

### Create an Order (use the token from login)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
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

## 🔑 Test Accounts

All test users have password: `password123`

- john.doe@example.com
- jane.smith@example.com
- bob.wilson@example.com
- alice.brown@example.com
- charlie.davis@example.com

## 🐛 Troubleshooting

### Database Connection Error
- Check MySQL is running: `mysql --version`
- Verify credentials in `.env` file
- Ensure database `coffee_shop_db` exists

### Port Already in Use
- Change PORT in `.env` file to another port (e.g., 3001)

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and run `npm install`

## 📚 Next Steps

1. Explore the API documentation at http://localhost:3000/api-docs
2. Read the full README.md for detailed information
3. Try creating orders with different quantities to see the discount system
4. Submit reviews and see ratings update automatically

## 🎉 You're All Set!

The Coffee Shop API is now running and ready to use. Happy coding! ☕

