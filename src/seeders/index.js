require('dotenv').config();
const { pool } = require('../config/database');
const { hashPassword } = require('../utils/password');

const seedDatabase = async () => {
  const connection = await pool.getConnection();
  
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data (in reverse order of dependencies)
    console.log('Clearing existing data...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE reviews');
    await connection.execute('TRUNCATE TABLE favorites');
    await connection.execute('TRUNCATE TABLE order_items');
    await connection.execute('TRUNCATE TABLE orders');
    await connection.execute('TRUNCATE TABLE coffee_products');
    await connection.execute('TRUNCATE TABLE categories');
    await connection.execute('TRUNCATE TABLE users');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Existing data cleared\n');

    // Seed Categories
    console.log('Seeding categories...');
    const categories = [
      { name: 'Coffee', description: 'Classic brewed coffee varieties' },
      { name: 'Cappuccino', description: 'Espresso with steamed milk foam' },
      { name: 'Espresso', description: 'Strong concentrated coffee shots' },
      { name: 'Latte', description: 'Espresso with steamed milk' },
      { name: 'Tea', description: 'Various tea selections' }
    ];

    const categoryIds = {};
    for (const category of categories) {
      const [result] = await connection.execute(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [category.name, category.description]
      );
      categoryIds[category.name] = result.insertId;
      console.log(`  ✓ ${category.name}`);
    }
    console.log('✅ Categories seeded\n');

    // Seed Coffee Products
    console.log('Seeding coffee products...');
    const coffees = [
      // Coffee
      { name: 'House Blend', category: 'Coffee', description: 'Our signature medium roast blend', price: 3.50 },
      { name: 'Dark Roast', category: 'Coffee', description: 'Bold and rich dark roast', price: 3.75 },
      { name: 'Colombian Supreme', category: 'Coffee', description: 'Premium Colombian beans', price: 4.25 },
      { name: 'French Vanilla', category: 'Coffee', description: 'Smooth vanilla flavored coffee', price: 4.00 },
      
      // Cappuccino
      { name: 'Classic Cappuccino', category: 'Cappuccino', description: 'Traditional Italian cappuccino', price: 4.50 },
      { name: 'Caramel Cappuccino', category: 'Cappuccino', description: 'Sweet caramel infused cappuccino', price: 5.00 },
      { name: 'Mocha Cappuccino', category: 'Cappuccino', description: 'Chocolate and espresso blend', price: 5.25 },
      
      // Espresso
      { name: 'Single Espresso', category: 'Espresso', description: 'One shot of pure espresso', price: 2.50 },
      { name: 'Double Espresso', category: 'Espresso', description: 'Two shots of intense espresso', price: 3.50 },
      { name: 'Americano', category: 'Espresso', description: 'Espresso with hot water', price: 3.75 },
      { name: 'Macchiato', category: 'Espresso', description: 'Espresso with a dollop of foam', price: 3.25 },
      
      // Latte
      { name: 'Caffè Latte', category: 'Latte', description: 'Classic espresso and steamed milk', price: 4.75 },
      { name: 'Vanilla Latte', category: 'Latte', description: 'Latte with vanilla syrup', price: 5.25 },
      { name: 'Hazelnut Latte', category: 'Latte', description: 'Nutty hazelnut flavored latte', price: 5.25 },
      { name: 'Caramel Latte', category: 'Latte', description: 'Sweet caramel latte', price: 5.50 },
      
      // Tea
      { name: 'Green Tea', category: 'Tea', description: 'Refreshing green tea', price: 2.75 },
      { name: 'Earl Grey', category: 'Tea', description: 'Classic black tea with bergamot', price: 2.75 },
      { name: 'Chamomile', category: 'Tea', description: 'Soothing herbal tea', price: 3.00 },
      { name: 'Chai Latte', category: 'Tea', description: 'Spiced tea with steamed milk', price: 4.50 }
    ];

    const coffeeIds = [];
    for (const coffee of coffees) {
      const [result] = await connection.execute(
        'INSERT INTO coffee_products (name, category_id, description, price, is_available) VALUES (?, ?, ?, ?, ?)',
        [coffee.name, categoryIds[coffee.category], coffee.description, coffee.price, true]
      );
      coffeeIds.push(result.insertId);
      console.log(`  ✓ ${coffee.name}`);
    }
    console.log('✅ Coffee products seeded\n');

    // Seed Users
    console.log('Seeding users...');
    const users = [
      { email: 'john.doe@example.com', username: 'johndoe', password: 'password123' },
      { email: 'jane.smith@example.com', username: 'janesmith', password: 'password123' },
      { email: 'bob.wilson@example.com', username: 'bobwilson', password: 'password123' },
      { email: 'alice.brown@example.com', username: 'alicebrown', password: 'password123' },
      { email: 'charlie.davis@example.com', username: 'charliedavis', password: 'password123' }
    ];

    const userIds = [];
    for (const user of users) {
      const passwordHash = await hashPassword(user.password);
      const [result] = await connection.execute(
        'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
        [user.email, user.username, passwordHash]
      );
      userIds.push(result.insertId);
      console.log(`  ✓ ${user.username} (${user.email})`);
    }
    console.log('✅ Users seeded\n');

    // Seed Orders
    console.log('Seeding orders...');
    const orders = [
      {
        userId: userIds[0],
        orderNumber: 'ORD-001',
        items: [
          { coffeeId: coffeeIds[0], quantity: 2, cupSize: 'medium', sugarLevel: 'low' },
          { coffeeId: coffeeIds[4], quantity: 1, cupSize: 'large', sugarLevel: 'medium' }
        ],
        status: 'completed'
      },
      {
        userId: userIds[1],
        orderNumber: 'ORD-002',
        items: [
          { coffeeId: coffeeIds[11], quantity: 1, cupSize: 'small', sugarLevel: 'none' }
        ],
        status: 'completed'
      },
      {
        userId: userIds[0],
        orderNumber: 'ORD-003',
        items: [
          { coffeeId: coffeeIds[2], quantity: 3, cupSize: 'medium', sugarLevel: 'medium' },
          { coffeeId: coffeeIds[8], quantity: 2, cupSize: 'small', sugarLevel: 'none' }
        ],
        status: 'completed'
      },
      {
        userId: userIds[2],
        orderNumber: 'ORD-004',
        items: [
          { coffeeId: coffeeIds[5], quantity: 2, cupSize: 'large', sugarLevel: 'high' }
        ],
        status: 'preparing'
      },
      {
        userId: userIds[3],
        orderNumber: 'ORD-005',
        items: [
          { coffeeId: coffeeIds[12], quantity: 1, cupSize: 'medium', sugarLevel: 'low' },
          { coffeeId: coffeeIds[15], quantity: 1, cupSize: 'medium', sugarLevel: 'none' }
        ],
        status: 'ready'
      },
      {
        userId: userIds[1],
        orderNumber: 'ORD-006',
        items: [
          { coffeeId: coffeeIds[6], quantity: 1, cupSize: 'large', sugarLevel: 'medium' },
          { coffeeId: coffeeIds[13], quantity: 1, cupSize: 'medium', sugarLevel: 'low' }
        ],
        status: 'completed'
      },
      {
        userId: userIds[4],
        orderNumber: 'ORD-007',
        items: [
          { coffeeId: coffeeIds[1], quantity: 2, cupSize: 'small', sugarLevel: 'none' }
        ],
        status: 'completed'
      }
    ];

    const orderIds = [];
    for (const order of orders) {
      // Calculate totals
      let totalPrice = 0;
      let totalQuantity = 0;
      const itemsData = [];

      for (const item of order.items) {
        const [coffeeRows] = await connection.execute(
          'SELECT price FROM coffee_products WHERE id = ?',
          [item.coffeeId]
        );
        const basePrice = parseFloat(coffeeRows[0].price);
        const sizeModifiers = { small: 1.0, medium: 1.2, large: 1.6 };
        const unitPrice = parseFloat((basePrice * sizeModifiers[item.cupSize]).toFixed(2));
        const itemTotal = parseFloat((unitPrice * item.quantity).toFixed(2));

        totalPrice += itemTotal;
        totalQuantity += item.quantity;

        itemsData.push({
          ...item,
          unitPrice,
          itemTotal
        });
      }

      // Calculate discount
      const quantityDiscount = totalQuantity >= 5 ? totalPrice * 0.10 : 0;
      const valueDiscount = totalPrice > 15 ? 2.00 : 0;
      const discountAmount = parseFloat(Math.max(quantityDiscount, valueDiscount).toFixed(2));
      const finalPrice = parseFloat((totalPrice - discountAmount).toFixed(2));

      // Create order
      const [orderResult] = await connection.execute(
        'INSERT INTO orders (user_id, order_number, status, total_price, discount_amount, final_price) VALUES (?, ?, ?, ?, ?, ?)',
        [order.userId, order.orderNumber, order.status, totalPrice, discountAmount, finalPrice]
      );
      const orderId = orderResult.insertId;
      orderIds.push(orderId);

      // Create order items
      for (const item of itemsData) {
        await connection.execute(
          'INSERT INTO order_items (order_id, coffee_id, quantity, cup_size, sugar_level, unit_price, item_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [orderId, item.coffeeId, item.quantity, item.cupSize, item.sugarLevel, item.unitPrice, item.itemTotal]
        );
      }

      console.log(`  ✓ ${order.orderNumber} - ${order.status} ($${finalPrice})`);
    }
    console.log('✅ Orders seeded\n');

    // Seed Favorites
    console.log('Seeding favorites...');
    const favorites = [
      { userId: userIds[0], coffeeId: coffeeIds[0], preferredSize: 'medium', preferredSugar: 'low' },
      { userId: userIds[0], coffeeId: coffeeIds[4], preferredSize: 'large', preferredSugar: 'medium' },
      { userId: userIds[1], coffeeId: coffeeIds[11], preferredSize: 'medium', preferredSugar: 'none' },
      { userId: userIds[1], coffeeId: coffeeIds[12], preferredSize: 'large', preferredSugar: 'low' },
      { userId: userIds[2], coffeeId: coffeeIds[5], preferredSize: 'large', preferredSugar: 'high' },
      { userId: userIds[3], coffeeId: coffeeIds[13], preferredSize: 'medium', preferredSugar: 'low' },
      { userId: userIds[4], coffeeId: coffeeIds[1], preferredSize: 'small', preferredSugar: 'none' }
    ];

    for (const favorite of favorites) {
      await connection.execute(
        'INSERT INTO favorites (user_id, coffee_id, preferred_size, preferred_sugar) VALUES (?, ?, ?, ?)',
        [favorite.userId, favorite.coffeeId, favorite.preferredSize, favorite.preferredSugar]
      );
    }
    console.log(`  ✓ ${favorites.length} favorites added`);
    console.log('✅ Favorites seeded\n');

    // Seed Reviews
    console.log('Seeding reviews...');
    const reviews = [
      { userId: userIds[0], coffeeId: coffeeIds[0], orderId: orderIds[0], rating: 5, comment: 'Excellent house blend! Perfect for my morning routine.' },
      { userId: userIds[0], coffeeId: coffeeIds[4], orderId: orderIds[0], rating: 4, comment: 'Great cappuccino, very smooth and creamy.' },
      { userId: userIds[1], coffeeId: coffeeIds[11], orderId: orderIds[1], rating: 5, comment: 'Best latte in town! The milk is perfectly steamed.' },
      { userId: userIds[0], coffeeId: coffeeIds[2], orderId: orderIds[2], rating: 5, comment: 'Colombian Supreme lives up to its name. Rich and flavorful!' },
      { userId: userIds[0], coffeeId: coffeeIds[8], orderId: orderIds[2], rating: 4, comment: 'Strong espresso, just what I needed.' },
      { userId: userIds[2], coffeeId: coffeeIds[5], orderId: orderIds[3], rating: 4, comment: 'Love the caramel flavor, not too sweet.' },
      { userId: userIds[1], coffeeId: coffeeIds[6], orderId: orderIds[5], rating: 5, comment: 'Mocha cappuccino is divine! Perfect chocolate balance.' },
      { userId: userIds[1], coffeeId: coffeeIds[13], orderId: orderIds[5], rating: 4, comment: 'Hazelnut latte is delicious and aromatic.' },
      { userId: userIds[4], coffeeId: coffeeIds[1], orderId: orderIds[6], rating: 5, comment: 'Dark roast is bold and satisfying. My favorite!' },
      { userId: userIds[3], coffeeId: coffeeIds[12], rating: 5, comment: 'Classic latte done right. Smooth and creamy.' },
      { userId: userIds[2], coffeeId: coffeeIds[9], rating: 3, comment: 'Good americano, but could be stronger.' },
      { userId: userIds[4], coffeeId: coffeeIds[15], rating: 4, comment: 'Earl Grey is refreshing and well-balanced.' },
      { userId: userIds[3], coffeeId: coffeeIds[14], rating: 5, comment: 'Vanilla latte is my go-to drink. Always consistent!' },
      { userId: userIds[2], coffeeId: coffeeIds[7], rating: 4, comment: 'Single espresso packs a punch. Great quality beans.' },
      { userId: userIds[4], coffeeId: coffeeIds[3], rating: 4, comment: 'French Vanilla is smooth and not overly sweet.' },
      { userId: userIds[1], coffeeId: coffeeIds[16], rating: 5, comment: 'Green tea is fresh and calming. Perfect afternoon drink.' },
      { userId: userIds[0], coffeeId: coffeeIds[10], rating: 4, comment: 'Macchiato has the perfect espresso to foam ratio.' },
      { userId: userIds[3], coffeeId: coffeeIds[18], rating: 5, comment: 'Chai latte is perfectly spiced and warming.' }
    ];

    for (const review of reviews) {
      await connection.execute(
        'INSERT INTO reviews (user_id, coffee_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [review.userId, review.coffeeId, review.orderId || null, review.rating, review.comment]
      );
    }
    console.log(`  ✓ ${reviews.length} reviews added`);
    console.log('✅ Reviews seeded\n');

    // Update coffee ratings
    console.log('Updating coffee ratings...');
    await connection.execute(`
      UPDATE coffee_products cp
      SET average_rating = (
        SELECT COALESCE(ROUND(AVG(rating), 2), 0.00)
        FROM reviews r
        WHERE r.coffee_id = cp.id
      ),
      total_reviews = (
        SELECT COUNT(*)
        FROM reviews r
        WHERE r.coffee_id = cp.id
      )
    `);
    console.log('✅ Coffee ratings updated\n');

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${coffees.length} coffee products`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${orders.length} orders`);
    console.log(`   - ${favorites.length} favorites`);
    console.log(`   - ${reviews.length} reviews\n`);
    console.log('💡 Test user credentials (all passwords: password123):');
    users.forEach(user => {
      console.log(`   - ${user.email}`);
    });
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
};

// Run seeder
seedDatabase()
  .then(() => {
    console.log('Seeder completed. Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeder failed:', error);
    process.exit(1);
  });

