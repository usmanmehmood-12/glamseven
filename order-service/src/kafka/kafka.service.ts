import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: any;
  private producer: any;
  private responseEmitter = new EventEmitter();

  constructor() {
    this.kafka = new Kafka({
      clientId: 'order-service',
      brokers: ['kafka-1:19092', 'kafka-2:19093', 'kafka-3:19094'],
    });
    this.consumer = this.kafka.consumer({ groupId: 'order-response-group' });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.connectProducer();
    await this.consumeProductQuantitiesResponse();
  }

  /**
   * Connects the producer to Kafka.
   *
   * @return {Promise<void>} Promise that resolves when the connection is successful.
   */
  private async connectProducer() {
    try {
      await this.producer.connect();
      console.log('line 34 | kafka.service.ts | Successfully connected to Kafka producer.');
    } catch (error) {
      console.error('line 36 | kafka.service.ts | Error connecting to Kafka producer:', error);
      process.exit(1);
    }
  }

  /**
   * Sends the given products to Kafka.
   *
   * @param {Array} products - The products to be sent to Kafka.
   * @return {Promise} A promise that resolves when the products are successfully sent to Kafka.
   */
  async sendOrderToKafka(products) {
    console.log('line 48 | kafka.service.ts | Preparing to send products to Kafka:', products);
    try {
      console.log('line 50 | kafka.service.ts | Producing message to topic order-created.');
      await this.producer.send({
        topic: 'order-created',
        messages: [{ value: JSON.stringify(products) }],
      });
      console.log('line 55 | kafka.service.ts | Successfully produced message to topic order-created.');
    } catch (error) {
      console.error('line 57 | kafka.service.ts | Error producing message to Kafka:', error);
      throw error;
    }
  }

  /**
   * Sends a request for product quantities to Kafka.
   *
   * @param {number} orderId - The ID of the order.
   * @param {number[]} productIds - The IDs of the products.
   * @return {Promise<any>} A promise that resolves with the response data.
   */
  async requestProductQuantities(
    orderId: number,
    productIds: number[],
  ): Promise<any> {
    console.log('line 73 | kafka.service.ts | Preparing to send productIds to Kafka:', productIds);
    try {
      console.log('line 75 | kafka.service.ts | Requesting product quantities from Kafka.');
      await this.producer.send({
        topic: 'request-product-quantities',
        messages: [{ value: JSON.stringify({ orderId, productIds }) }],
      });
      console.log(
        'line 81 | kafka.service.ts | Successfully produced message to topic request-product-quantities.',
      );

      // Wait for a response using the responseEmitter
      return new Promise((resolve, reject) => {
        // Set timeout for the response
        const timeout = setTimeout(() => {
          reject(new Error('line 88 | kafka.service.ts | Response timeout for orderId: ' + orderId));
        }, 30000); // 30 seconds

        this.responseEmitter.once(
          `response-product-quantities`,
          (responseData) => {
            clearTimeout(timeout); // Clear the timeout
            resolve(responseData);
          },
        );
      });
    } catch (error) {
      console.error('line 100 | kafka.service.ts | Error producing message to Kafka:', error);
      throw error;
    }
  }

  /**
   * Consume the response of product quantities from Kafka.
   *
   * @private
   * @async
   * @return {Promise<void>}
   */
  private async consumeProductQuantitiesResponse() {
    console.log('line 113 | kafka.service.ts | Attempting to connect to Kafka consumer...');
    try {
      await this.consumer.connect();
      console.log('line 116 | kafka.service.ts | Successfully connected to Kafka consumer.');
    } catch (error) {
      console.error('line 118 | kafka.service.ts | Error connecting to Kafka consumer:', error);
      process.exit(1);
    }

    try {
      await this.consumer.subscribe({
        topic: 'response-product-quantities',
        fromBeginning: true,
      });
      console.log('line 127 | kafka.service.ts | Starting consumer runner...');
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const responseData = JSON.parse(message.value.toString());
          console.log(
            `line 132 | kafka.service.ts | Received product responseData from topic ${topic}  in partition ${partition} with offset ${message.offset}:`,
            responseData,
          );
          // updating the order based on the quantities received
          this.responseEmitter.emit(
            `response-product-quantities`,
            responseData,
          );
        },
      });
    } catch (error) {
      console.error('line 143 | kafka.service.ts | Error in consumer runner:', error);
      process.exit(1);
    }
  }
}
