require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const apiRouter = require('./api');

const { 
  client,
  createTables,
} = require("./db");

app.use(express.json());
app.use(morgan("dev"));
app.use('/api', apiRouter);

const init = async () => {
  // Connect to the database
  const PORT = process.env.PORT || 3000;
  console.log("Connecting to database...");
  await client.connect();
  console.log("Connected to database.");
  await createTables();
  console.log("Created tables.");

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  })
};

init();
