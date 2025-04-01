const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 3000;
const {
  client,
  // uuid,
  // bcrypt,
  createTables,
  // shouldSeedDatabase,
  seedDatabase,
} = require("./db");

app.use(express.json());
app.use(morgan("dev"));

const init = async () => {
  try {
    console.log("Connecting to database...");
    // await client.connect();
    console.log("Connected to database.");

    await createTables();
    console.log("Created tables.");

    await seedDatabase();
    console.log("databse seeded");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

init();
