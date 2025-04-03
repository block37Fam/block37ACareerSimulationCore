require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const apiRrouter = require('./api');

const { 
  client,
  createTables,
} = require("./db");

app.use(express.json());
app.use(morgan("dev"));
app.use('/api', apiRrouter);

const init = async () => {
  // Connect to the database
  const PORT = process.env.PORT || 3000;
  console.log("Connecting to database...");
  await client.connect();
  console.log("Connected to database.");
  await createTables();
  console.log("Created tables.");

  const users = Array.from({ length: 50 }, (_, i) => ({
    id: uuid.v4(),
    username: `user${i + 1}`,
    email: `user${i + 1}@example.com`,
    password: '123' // plain text for now; should be hashed in registerUser
  }));

  const items = Array.from({ length: 50 }, (_, i) => ({
    id: uuid.v4(),
    name: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}.`
  }));
  
  const reviews = Array.from({ length: 50 }, () => {
    const user = users[Math.floor(Math.random() * users.length)];
    const item = items[Math.floor(Math.random() * items.length)];
    return {
      id: uuid.v4(),
      user_id: user.id,
      item_id: item.id,
      rating: Math.ceil(Math.random() * 5),
      review_text: "This is a review."
    };
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  })
};

init();
