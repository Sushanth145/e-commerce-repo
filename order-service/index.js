const express = require('express');
const { Pool } = require('pg');
const { Kafka } = require('kafkajs');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecom_new',  // Use the correct database name
  password: '9441984210',
  port: 5432,
});

app.use(express.json());

// Initialize Kafka client and producer
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9093'],  // Replace with your Kafka broker address
});

const producer = kafka.producer();

// Connect the Kafka producer
async function startProducer() {
  try {
    await producer.connect();
    console.log('Kafka producer connected successfully');
  } catch (error) {
    console.error('Error connecting to Kafka:', error);
    process.exit(1); // Stop the server if Kafka cannot connect
  }
}

// Start Kafka producer
startProducer().catch(console.error);

// Place an order and send an event to Kafka
app.post('/api/orders', async (req, res) => {
  const { userId, productId, quantity, totalPrice } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, productId, quantity, totalPrice]
    );
    const orderId = result.rows[0].id;

    // Send Kafka event about the new order
    const payload = [
      {
        topic: 'order_placed',
        messages: [
          {
            value: JSON.stringify({
              orderId,
              userId,
              productId,
              quantity,
              totalPrice,
            }),
          },
        ],
      },
    ];

    // Send the message to Kafka
    try {
      const data = await producer.send(payload);
      console.log('Order placed Kafka event sent successfully:', data);
      res.status(201).json({ orderId });
    } catch (err) {
      console.error('Error sending Kafka event:', err);
      res.status(500).json({ message: `Order placed, but error sending Kafka event: ${err.message}` });
    }
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// Graceful shutdown of Kafka producer and Express server
process.on('SIGINT', async () => {
  console.log('Shutting down the server gracefully...');
  await producer.disconnect();
  app.close(() => {
    console.log('Express server stopped');
    process.exit();
  });
});

// Start Express server
const server = app.listen(3003, () => {
  console.log('Order Service listening on port 3003');
});

// Graceful shutdown of the Express server
app.close = function (callback) {
  server.close(callback);
};
