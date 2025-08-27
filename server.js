require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express(); // make sure app is created before using app.get/app.post

app.use(cors());
app.use(express.json());

const db = new Pool({
  host: process.env.DB_HOST || "dpg-d2necg24d50c73e99mdg-a",
  user: process.env.DB_USER || "crud_data_8n2j_user",
  password: process.env.DB_PASSWORD || "sP5ttjyWDcObQPDhbv34atHakub2IFTW",
  database: process.env.DB_NAME || "crud_data_8n2j",
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false } // 🔑 Required by Render Postgres
});

db.connect()
  .then(() => console.log("✅ DB connected"))
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
