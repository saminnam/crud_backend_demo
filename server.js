const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_data",
  port: 3306
});

app.use(cors({
  origin: "https://crud-demo-front.netlify.app/", // your Netlify domain
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));


db.connect((err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("DB connected");
});

// ✅ Get all services
app.get("/api/services", (req, res) => {
  db.query("SELECT * FROM services", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ✅ Add a new service
app.post("/api/services", (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query(
    "INSERT INTO services (title, description) VALUES (?, ?)",
    [title, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, title, description });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
