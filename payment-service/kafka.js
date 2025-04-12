// payment-service/kafka.js
const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const Client = kafka.KafkaClient;

const client = new Client({ kafkaHost: 'localhost:9093' });
const consumer = new Consumer(client, [{ topic: 'order_placed', partition: 0 }], {
  autoCommit: true,
});

consumer.on('message', (message) => {
  const order = JSON.parse(message.value);
  console.log('Received Kafka message for order placed:', order);
  // Process the payment for the order here...
});

consumer.on('error', (err) => {
  console.error('Error in Kafka consumer:', err);
});
