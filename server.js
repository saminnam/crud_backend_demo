require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(cors({
  origin: "https://crud-demo-front.netlify.app", // your Netlify frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// PostgreSQL connection pool
const db = new Pool({
  host: process.env.DB_HOST || "dpg-d2necg24d50c73e99mdg-a",
  user: process.env.DB_USER || "crud_data_8n2j_user",
  password: process.env.DB_PASSWORD || "sP5ttjyWDcObQPDhbv34atHakub2IFTW",
  database: process.env.DB_NAME || "crud_data_8n2j",
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } // 🔑 Required by Render Postgres
});

// ✅ Test DB connection on startup
db.query("SELECT NOW()")
  .then(res => console.log("✅ DB connected at:", res.rows[0].now))
  .catch(err => console.error("❌ DB connection error:", err));

// ✅ Get all services
app.get("/api/services", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM services");
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
