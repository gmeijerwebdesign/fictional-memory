const express = require("express");
const axios = require("axios");

const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const DB = mysql
  .createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "portfolio_wp",
  })
  .promise();

DB.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database!");
});

app.get("/api/posts", async (req, res) => {
  try {
    const response = await DB.query(
      "SELECT * FROM wp_posts WHERE post_type = 'post' AND post_status = 'publish';"
    );
    res.status(202).json({ posts: response });
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});

app.get("/api/product", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost/portfolio-wp/wp-json/wp/v2/posts`
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Error fetching product" });
  }
});

// Start de server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
