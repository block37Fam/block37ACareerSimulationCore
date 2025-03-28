const createTables = async () => {
  //Users Table
  const SQL =
    /*SQL*/
    `
        /* I commented out this porrtion because I am unsure if 
         this is how it should be written. */
         
   -- DROP TABLE IF EXISTS users;
   -- DROP TABLE IF EXISTS items;
   -- DROP TABLE IF EXISTS reviews;
   -- DROP TABLE IF EXISTS comments;

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
};

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

const updateReview = async (userId, reviewId, rating, reviewText) => {}; //Edits an existing review

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
