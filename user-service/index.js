// user-service/index.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'your_postgres_user',
  host: 'localhost',
  database: 'ecommerce',
  password: 'your_postgres_password',
  port: 5432,
});

app.use(express.json());

// User registration endpoint
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id', [username, email, hashedPassword]);
  const userId = result.rows[0].id;

  res.status(201).json({ userId });
});

// User login endpoint
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];

  if (user && await bcrypt.compare(password, user.password_hash)) {
    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.listen(3001, () => {
  console.log('User Service listening on port 3001');
});
