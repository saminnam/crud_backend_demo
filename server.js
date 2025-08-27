require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "https://crud-demo-front.netlify.app", // Netlify frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ PostgreSQL connection pool (Neon DB)
const db = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_Sf9nJvGBXD4O@ep-spring-wildflower-aetxakm6-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require", // Neon provides this full URL
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

// ✅ Test DB connection on startup
db.query("SELECT NOW()")
  .then((res) => console.log("✅ DB connected at:", res.rows[0].now))
  .catch((err) => console.error("❌ DB connection error:", err));

// ✅ Get all services
app.get("/api/services", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM services ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new service
app.post("/api/services", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO services (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
