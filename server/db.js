const pg = require('pg');
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/review_site_db');

const createTables = async () => {
  //Users Table
  const SQL =
    /*SQL*/
    `    
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS items;
    DROP TABLE IF EXISTS users;

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
    `
    await client.query(SQL);

};

const registerUser = async ({ username, email, password }) => {
    const password_hash = await hashPassword(password);
    const SQL = /*sql*/`
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at;
    `
    const { rows } = await client.query(SQL, [username, email, password_hash]);
    return rows[0];
};

const loginUser = async (email, password) => {
    const SQL = /*sql*/ `
        SELECT * FROM users WHERE email = $1
    `;
    const { rows } = await client.query(SQL, [email]);

    const user = rows[0];
    if (!user) throw new Error("User not found");

    const isValid = await comparePasswords(password, user.password_hash);
    if (!isValid) throw new Error("Invalid password");

    const token = generateJWT(user); 
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token,
    };
};

const getUserById = async (userId) => {
    const SQL = /*sql*/`
        SELECT id, username, email, created_at FROM users WHERE id = $1
    `;
    const { rows } = await client.query(SQL, [userId]);
    return rows[0];
};

const getAuthenticatedUser = async (token) => {
    const payload = verifyJWT(token);
    return await getUserById(payload.id);
}; 

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

module.exports = {
  client,
  uuid,
  bcrypt,
  createTables,
  registerUser,
  loginUser,
  getUserById,
  getAuthenticatedUser,
  hashPassword,
  comparePasswords,
  generateJWT,
  verifyJWT,
  
};
