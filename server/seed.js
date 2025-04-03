const { faker } = require('@faker-js/faker');
const { client, createTables, registerUser, uuid } = require('./db');

// Function to seed database with faker data
const seed = async () => {
  try {
    await client.connect();
    console.log('DB connected');

    await createTables();
    console.log('Tables dropped and recreated');

    // Seed users
    const users = [];
    for (let i = 0; i < 50; i++) {
      const user = await registerUser({
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: '123' // this gets hashed inside registerUser
      });
      users.push(user);
    }
    console.log("users seeded")

    // Seed items
    const items = [];
    for (let i = 0; i < 50; i++) {
      const itemId = uuid.v4();
      const result = await client.query(
        `INSERT INTO items (id, name, description) VALUES ($1, $2, $3) RETURNING *`,
        [itemId, faker.commerce.productName(), faker.commerce.productDescription()]
      );
      items.push(result.rows[0]);
    }

    console.log("items seeded")

    // Seed reviews
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(users);
      const item = faker.helpers.arrayElement(items);
      await client.query(
        `INSERT INTO reviews (id, user_id, item_id, rating, review_text)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          uuid.v4(),
          user.id,
          item.id,
          faker.number.int({ min: 1, max: 5 }),
          faker.lorem.sentences(2)
        ]
      );
    }

    console.log("reviews seeded")

    // Seed comments
    for (let i = 0; i < 50; i++) {
      const user = faker.helpers.arrayElement(users);
      const reviewResult = await client.query(`SELECT id FROM reviews ORDER BY RANDOM() LIMIT 1`);
      const review = reviewResult.rows[0];

      if (!review) continue;

      await client.query(
        `INSERT INTO comments (id, user_id, review_id, comment_text)
          VALUES ($1, $2, $3, $4)`,
        [
          uuid.v4(),
          user.id,
          review.id,
          faker.lorem.sentences(2)
        ]
      );
    }

    console.log("reviews seeded")

    console.log('Database seeded successfully ✅');
    await client.end();
  } catch (err) {
    console.error('Error seeding database:', err);
    await client.end();
  }
};


// Seed database
seed();