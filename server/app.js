const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const expressSanitizer = require("express-sanitizer");
const dotenv = require("dotenv").config();
const { MongoClient } = require("mongodb");
const conditionalAuth = require("./middleware/conditionalAuth");

console.log("JWT_ENABLED at startup:", process.env.JWT_ENABLED);
const app = express();

const shopLController = require("./controller/shopL");
const userController = require("./controller/user");

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(cors());

const url = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = "my_shopping_list_app";
let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/shopL", shopLController);
app.use("/user", userController);
