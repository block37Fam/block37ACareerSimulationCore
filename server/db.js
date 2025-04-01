require("dotenv").config();
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { Client } = require("pg");
const client = new Client({ connectionString: process.env.DATABASE_URL });

const createTables = async () => {
  await client.connect();
  //Users Table
  const SQL =
    /*SQL*/
    `
        /* I commented out this portion because I am unsure if 
         this is how it should be written. */
    
        /*COMMENTS and REVIEWS reference USERS, so they must be dropped first.
        ITEMS and REVIEWS are independent but can reference each other, so ITEMS is dropped first.
        USERS is dropped last.*/

         
         DROP TABLE IF EXISTS comments CASCADE;
         DROP TABLE IF EXISTS reviews CASCADE;
         DROP TABLE IF EXISTS items CASCADE;
         DROP TABLE IF EXISTS users CASCADE; -- Drop users last

    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        average_rating FLOAT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        item_id UUID REFERENCES items(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
        review_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (user_id, item_id) -- Ensures a user can only review an item once
    );

    CREATE TABLE comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
        comment_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`;
  await client.query(SQL); // This executes the query
};

const NUM_USERS = 75;
const NUM_ITEMS = 120;
const NUM_REVIEWS = 200;
const NUM_COMMENTS = 200;

const clothingItems = [...Array(NUM_ITEMS)].map((_, i) => ({
  id: uuidv4(),
  name: `Clothing Item ${i + 1}`,
  description: `Description for clothing item ${i + 1}`,
}));

const users = [...Array(NUM_USERS)].map((_, i) => ({
  id: uuidv4(),
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  password_hash: bcrypt.hashSync("password123", 10),
}));

const reviews = [...Array(NUM_REVIEWS)].map(() => {
  const user = users[Math.floor(Math.random() * NUM_USERS)];
  const item = clothingItems[Math.floor(Math.random() * NUM_ITEMS)];
  return {
    id: uuidv4(),
    user_id: user.id,
    item_id: item.id,
    rating: Math.floor(Math.random() * 5) + 1,
    review_text: `Review text for item ${item.name} by ${user.username}`,
  };
});

const comments = [...Array(NUM_COMMENTS)].map(() => {
  const user = users[Math.floor(Math.random() * NUM_USERS)];
  const review = reviews[Math.floor(Math.random() * NUM_REVIEWS)];
  return {
    id: uuidv4(),
    user_id: user.id,
    review_id: review.id,
    comment_text: `Comment by ${user.username} on review: ${review.review_text}`,
  };
});

async function shouldSeedDatabase() {
  try {
    // Ensure the users table exists before counting rows
    await client.query("SELECT 1 FROM users LIMIT 1");

    const res = await client.query("SELECT COUNT(*) FROM users");
    return parseInt(res.rows[0].count, 10) === 0;
  } catch (error) {
    console.error("Error checking database seed status:", error);
    return false;
  }
}

const seedDatabase = async () => {
  try {
    console.log(" Resetting and seeding database...");

    await client.query(
      "TRUNCATE comments, reviews, items, users RESTART IDENTITY CASCADE"
    );
    console.log(" Tables truncated.");

    //  Seed users and store generated IDs
    const userIds = [];
    for (const user of users) {
      const result = await client.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
        [user.username, user.email, user.password_hash]
      );
      if (result.rows.length === 0) throw new Error("Failed to insert user");
      console.log("Inserted user:", result.rows[0].id);
      userIds.push(result.rows[0].id);
    }
    console.log(" Users seeded:", userIds);

    if (userIds.length === 0) throw new Error("No users found!");

    //  Seed items and store generated IDs
    const itemIds = [];
    for (const item of clothingItems) {
      const result = await client.query(
        "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING id",
        [item.name, item.description]
      );
      if (result.rows.length === 0) throw new Error("Failed to insert item");
      console.log("Inserted item:", result.rows[0].id);
      itemIds.push(result.rows[0].id);
    }
    console.log(" Items seeded:", itemIds);

    if (itemIds.length === 0) throw new Error("No items found!");

    //  Ensure users exist before inserting reviews
    const existingReviews = new Set(); // Track inserted (user_id, item_id) pairs

    for (const review of reviews) {
      let randomUserId, randomItemId, uniquePair;

      // Ensure unique (user_id, item_id) pairs
      do {
        randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
        randomItemId = itemIds[Math.floor(Math.random() * itemIds.length)];
        uniquePair = `${randomUserId}-${randomItemId}`;
      } while (existingReviews.has(uniquePair));

      existingReviews.add(uniquePair); // Store the new pair

      console.log(
        `Inserting review with user_id: ${randomUserId} and item_id: ${randomItemId}`
      );

      await client.query(
        "INSERT INTO reviews (user_id, item_id, rating, review_text) VALUES ($1, $2, $3, $4)",
        [randomUserId, randomItemId, review.rating, review.review_text]
      );
    }
    console.log(" Reviews seeded:");

    //  Seed comments using valid user_id and review_id

    let reviewIds = [];
    const reviewQueryResult = await client.query("SELECT id FROM reviews");
    reviewIds = reviewQueryResult.rows.map((row) => row.id);

    if (reviewIds.length === 0) {
      throw new Error(" Cannot seed comments: No reviews found.");
    }

    for (const comment of comments) {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      const randomReviewId =
        reviewIds[Math.floor(Math.random() * reviewIds.length)];

      if (!randomUserId) throw new Error("No valid user_id found for comments");
      if (!randomReviewId)
        throw new Error("No valid review_id found for comments");

      await client.query(
        "INSERT INTO comments (user_id, review_id, comment_text) VALUES ($1, $2, $3)",
        [randomUserId, randomReviewId, comment.comment_text]
      );
    }
    console.log(" Comments seeded.");

    console.log(" Database seeding complete.");
  } catch (error) {
    console.error(" Error seeding database:", error.message);
  }
};
/*
const registerUser = async (username, email, password) => {}; // Handles user registration

const loginUser = async (email, password) => {}; //Authenticates a user and returns a JWT

const getUserById = async (userId) => {}; //Retrieves user details

const getAuthenticatedUser = async (token) => {}; //Decodes JWT and fetches logged-in user

// -- Item Management --

const getAllItems = async () => {}; //Fetches all items

const getItemById = async (itemid) => {}; //Retrieves a single item by ID

// -- Review Management --

const getReviewsByItemId = async (itemId) => {}; //Retrieves all reviews for a specific item

const getReviewById = async (reviewId) => {}; //Retrieves a specific review

const createReview = async (userId, itemId, rating, reviewText) => {}; //Adds a new review

const deleteReview = async (userId, reviewId) => {}; //Deletes a review

// -- User Review Management --

const getUserReviews = async (userId) => {}; //Fetches all reviews written by a user

// -- Comment Management --

const getCommentsByUser = async (userId) => {}; //Retrieves all comments written by a user

const getCommentsByReviewID = async (reviewId) => {}; //Fetches all comments on a review

const createComment = async (userId, reviewId, commentText) => {}; //Adds a comment

const updateComment = async (userId, commentId, commentText) => {}; //Edits a comment

const deleteComment = async (userId, commentId) => {}; //Deletes a comment

// -- Utility & Middleware --

const hashPassword = async (password) => {}; //Hashes passwords using bcrypt

const comparePasswords = async (plainPassword, hashedPassword) => {}; //Compares passwords

const generateJWT = async (plainPassword, hashedPassword) => {}; //Generates a JWT for authentication

const verifyJWT = async (token) => {}; //Verifies and decodes a JWT
*/

module.exports = {
  client,
  uuid,
  bcrypt,
  createTables,
  shouldSeedDatabase,
  seedDatabase,
};
