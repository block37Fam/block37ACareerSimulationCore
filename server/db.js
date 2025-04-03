const pg = require('pg');
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const seed = require("./seed.js")
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

//updated(moon): wrapped the 2 params 'email, password' with {}
const loginUser = async ({email, password}) => {
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

//-- User Management --

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

const getAllItems = async () => {
    const SQL = /*SQL*/ `
        SELECT *
        FROM items
    `;
    const response = await client.query(SQL);
    return response.rows;
}; //Fetches all items

const getItemById = async (itemId) => {
    const SQL = /*SQL*/ `
    SELECT * 
    FROM items
    WHERE id = $1;
`;
const response = await client.query(SQL, [itemId]);
return response.rows[0];
}; //Retrieves a single item by ID

// -- Review Management --

const getReviewsByItemId = async (reviewId) => {
    const SQL = /*SQL*/ `
    SELECT * 
    FROM reviews
    WHERE id = $1;
`;
const response = await client.query(SQL, [reviewId]);
return response.rows[0];
}; //Retrieves all reviews for a specific item

const getReviewById = async (review_id) => {
    const SQL = /*SQL*/ `
    SELECT * 
    FROM reviews
    WHERE review_id = $1;
`;
const response = await client.query(SQL, [review_id]);
return response.rows;
}; //Retrieves a specific review

const createReview = async (user_id, item_id, rating, review_text) => {
    const SQL = /*SQL*/ `
    INSERT INTO reviews(id, user_id, item_id, rating, review_text) VALUES($1, $2, $3, $4) RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, item_id, rating, review_text])
  return response.rows[0]
}; //Adds a new review

const deleteReview = async ({ user_id, id }) => { //id is review_id
    const SQL = /*SQL*/ ` 
    DELETE FROM reviews 
    WHERE user_id = $1 AND id = $2;
    `;
    await client.query(SQL, [user_id, id])
}; //Deletes a review

const editReview = async ({ user_id, id, rating, reviewText }) => { // id is review_id
    const SQL = /*SQL*/ ` 
      UPDATE reviews 
      SET rating = $3, review_text = $4, updated_at = NOW()
      WHERE user_id = $1 AND id = $2
      RETURNING *;
    `;
    const { rows } = await client.query(SQL, [user_id, id, rating, reviewText]);
    return rows[0]; // returns the updated review
  };

// -- User Review Management --

const getUserReviews = async (userId) => {
    const SQL = /*sql*/ `
        SELECT * FROM reviews 
        WHERE user_id = $1
    `;
    const { rows } = await client.query(SQL, [userId]);
    return rows;
}; //Fetches all reviews written by a user

// -- Comment Management --

const getCommentsByUser = async (userId) => {
    const SQL = /*sql*/ `
        SELECT * FROM comments 
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const { rows } = await client.query(SQL, [userId]);
    return rows;
}; //Retrieves all comments written by a user

const getCommentsByReviewID = async (reviewId) => {
    const SQL = /*sql*/ `
        SELECT * FROM comments 
        WHERE review_id = $1
    `;
    const { rows } = await client.query(SQL, [reviewId]);
    return rows;
}; //Fetches all comments on a review

const createComment = async (userId, reviewId, commentText) => {
    const SQL = /*sql*/ `
        INSERT INTO comments (user_id, review_id, comment_text)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, review_id, comment_text, created_at;
    `;
    const { rows } = await client.query(SQL, [userId, reviewId, commentText]);
    return rows[0];
}; //Adds a comment

const updateComment = async (userId, commentId, commentText) => {
    const SQL = /*sql*/ `
        UPDATE comments
        SET comment_text = $3, updated_at = NOW()
        WHERE user_id = $1 AND id = $2
        RETURNING *;
    `;
    const { rows } = await client.query(SQL, [userId, commentId, commentText]);
    return rows[0]; // returns the updated comment
}; //Edits a comment

const deleteComment = async (userId, commentId) => {
    const SQL = /*sql*/ `
        DELETE FROM comments
        WHERE user_id = $1 AND id = $2;
    `;
    await client.query(SQL, [userId, commentId]);
}; //Deletes a comment

// -- Utility & Middleware --

const hashPassword = async (password) => {
    const SALT_ROUNDS = 10;
    return await bcrypt.hash(password, SALT_ROUNDS);
}; //Hashes passwords using bcrypt

const comparePasswords = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }; // Compares passwords

  const generateJWT = (user) => {
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET ||'your_jwt_secret', { expiresIn: '1h' });
    return token;
  }; // Generates a JWT for authentication

  const verifyJWT = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
  }; // Verifies and decodes a JWT

module.exports = {
  client,
  createTables,
  registerUser,
  uuid,
  bcrypt,
  getAllItems,
  getItemById,
  getReviewsByItemId,
  getReviewById,
  createReview,
  deleteReview,
  editReview,
  loginUser,
  getUserById,
  getAuthenticatedUser,
  hashPassword,
  comparePasswords,
  generateJWT,
  verifyJWT,
  getUserReviews, 
  getCommentsByUser,
  getCommentsByReviewID,
  createComment,
  updateComment,
  deleteComment,
};
