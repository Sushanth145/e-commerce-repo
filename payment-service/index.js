// payment-service/index.js
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Mock payment processing
app.post('/api/payments', (req, res) => {
  const { orderId, amount } = req.body;
  // Process the payment (mocked here)
  setTimeout(() => {
    res.json({ paymentStatus: 'Success', orderId, amount });
  }, 1000);
});

// Get payment status
app.get('/api/payments/status/:id', (req, res) => {
  res.json({ status: 'Success' });
});

app.listen(3004, () => {
  console.log('Payment Service listening on port 3004');
});
