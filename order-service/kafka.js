// order-service/kafka.js
const kafka = require('kafka-node');
const Producer = kafka.Producer;
const Client = kafka.KafkaClient;

const client = new Client({ kafkaHost: 'localhost:9093' });
const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Kafka producer is ready');
});

producer.on('error', (err) => {
  console.error('Error in Kafka producer:', err);
});

module.exports = producer;
