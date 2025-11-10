// server.js
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "replace_this_with_a_strong_secret";
const SALT_ROUNDS = 10;

//  MIDDLEWARE 
app.use(cors());
app.use(bodyParser.json());

//  MYSQL POOL 
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "Aniket@1003",
  database: process.env.DB_NAME || "task_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// JWT HELPERS 
function generateToken(user) {
  const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "6h" });
}

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Missing authorization header" });

  const token = authHeader.split(" ")[1];
  console.log("🧩 Incoming token:", token); 

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await pool.execute(
      "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role || null]
    );

    const [rows] = await pool.execute(
      "SELECT id, name, email, role FROM user WHERE id = ?",
      [result.insertId]
    );
    const user = rows[0];

    const token = generateToken(user);
    res.status(201).json({ message: "User registered", user, token });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Email already registered" });
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password" });

  try {
    const [rows] = await pool.execute("SELECT * FROM user WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = generateToken(safeUser);
    res.json({ message: "Login successful", user: safeUser, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current user
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

//  CRUD ROUTES  
// Create task
app.post("/api/tasks", authenticateToken, async (req, res) => {
  const { name, age, phone, gender, email, role } = req.body;
  try {
    const [result] = await pool.execute(
      "INSERT INTO inform (name, age, phone, gender, email, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, age, phone, gender, email, role]
    );
    res.status(201).json({ message: "Task added successfully", id: result.insertId });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ error: "Database insert error" });
  }
});

// Read all tasks
app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM inform");
    res.json(rows);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Database fetch error" });
  }
});

// Update task
app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, age, phone, gender, email, role } = req.body;
  try {
    await pool.execute(
      "UPDATE inform SET name=?, age=?, phone=?, gender=?, email=?, role=? WHERE id=?",
      [name, age, phone, gender, email, role, id]
    );
    res.json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Database update error" });
  }
});

// Delete task
app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM inform WHERE id=?", [id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Database delete error" });
  }
});

// START SERVER 
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
