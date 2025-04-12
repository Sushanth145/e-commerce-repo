// product-service/index.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String
}));

// Add a new product
app.post('/api/products', async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const product = new Product({ name, description, price, stock, category });
  await product.save();
  res.status(201).json(product);
});

// Get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

app.listen(3002, () => {
  console.log('Product Service listening on port 3002');
});
