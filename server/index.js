const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT;
const { client, uuid, bcrypt, createTables } = require("./db");

pp.use(express.json());
app.use(morgan("dev"));

const init = async () => {
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected to database.");
    await createTables();
    console.log("Created tables.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

init();
