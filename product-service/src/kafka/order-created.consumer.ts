import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'product-service',
    brokers: ['kafka-1:19092', 'kafka-2:19093', 'kafka-3:19094']
  });

const consumer = kafka.consumer({ groupId: 'product-group' });

export async function consumeOrderFromKafka() {
    console.log('Attempting to connect to Kafka consumer...');
    try {
        await consumer.connect();
        console.log('Successfully connected to Kafka consumer.');
    } catch (error) {
        console.error('Error connecting to Kafka consumer:', error);
        process.exit(1); // Exit if Kafka connection fails.
    }

    console.log('Attempting to subscribe to topic: order-created...');
    try {
        await consumer.subscribe({ topics: ['order-created'], fromBeginning: true });
        console.log('Successfully subscribed to topic: order-created');
    } catch (error) {
        console.error('Error subscribing to topic:', error);
        process.exit(1); // Exit if subscription fails.
    }

    console.log('Starting consumer runner...');
    try {
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const products = JSON.parse(message.value.toString());
                console.log(`Successfully subscribed to topic: order-created order from topic ${topic} in partition ${partition} with offset ${message.offset}:`, products);
            },
        });
        console.log('Consumer runner started successfully.');
    } catch (error) {
        console.error('Error in consumer runner:', error);
        process.exit(1); // Exit if consumer runner fails.
    }
}

// consumer.on('consumer.group_join', (log) => {
//     console.log(`Consumer joined group. Group ID: ${log.groupId}, Member ID: ${log.memberId}, Leader ID: ${log.leaderId}`);
// });

// consumer.on('consumer.network.request_timeout', (log) => {
//     console.error(`Consumer network request timeout. Broker: ${log.broker}, API Key: ${log.apiKey}`);
// });

// consumer.on('consumer.network.error', (log) => {
//     console.error(`Consumer network error. Broker: ${log.broker}, Error: ${log.error}`);
// });

// consumer.on('consumer.crash', (log) => {
//     console.error(`Consumer crashed. Error: ${log.error}.`);
// });

consumer.on('consumer.heartbeat', () => {
    console.log('Consumer heartbeat event triggered.');
});

consumer.on('consumer.commit_offsets', (log) => {
    console.log('Consumer committed offsets.', log);
});


consumer.on('consumer.group_join', (log) => {
    console.log('Consumer group joined:', log);
});

consumer.on('consumer.fetch', (log) => {
    console.log('Fetching messages:', log);
});


// consumeOrderFromKafka().catch(error => {
//     console.error('Error in initializing Kafka consumer:', error);
// });
