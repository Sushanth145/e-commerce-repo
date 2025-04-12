// api-gateway/index.js
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Sample route to authenticate and forward request to other services
app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body;
  // Handle user authentication here (use JWT for authentication)
  // If valid, forward request to the User Service (for example)
  axios.post('http://user-service:3001/api/users/login', { username, password })
    .then(response => res.json(response.data))
    .catch(error => res.status(500).json({ message: 'User service failed' }));
});

// Add more routes for product, order, payment, etc.

app.listen(3000, () => {
  console.log('API Gateway listening on port 3000');
});
