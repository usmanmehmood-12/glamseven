import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: any;
  private producer: any;

  constructor(private readonly productService: ProductService) {
    this.kafka = new Kafka({
      clientId: 'product-service',
      brokers: ['kafka-1:19092', 'kafka-2:19093', 'kafka-3:19094'],
    });
    this.consumer = this.kafka.consumer({ groupId: 'product-group' });
    this.producer = this.kafka.producer(); // Initialize the producer
  }

  /**
   * Asynchronously initializes the module.
   *
   * @return {Promise<void>} Returns a promise that resolves when the module is initialized.
   */
  async onModuleInit() {
    await this.consumeOrderFromKafka();

    // Connect the producer
    try {
      await this.producer.connect();
      console.log(
        'line 32 | kafka-consumer.service.ts | Successfully connected to Kafka producer.',
      );
    } catch (error) {
      console.error(
        'line 36 | kafka-consumer.service.ts | Error connecting to Kafka producer:',
        error,
      );
      process.exit(1);
    }
  }

  /**
   * Consumes orders from Kafka and performs necessary actions based on the received messages.
   *
   * @private
   * @async
   * @returns {Promise<void>}
   */
  private async consumeOrderFromKafka() {
    console.log(
      'line 52 | kafka-consumer.service.ts | Attempting to connect to Kafka consumer...',
    );

    try {
      await this.consumer.connect();

      console.log(
        'line 59 | kafka-consumer.service.ts | Successfully connected to Kafka consumer.',
      );
    } catch (error) {
      console.error(
        'line 63 | kafka-consumer.service.ts | Error connecting to Kafka consumer:',
        error,
      );
      process.exit(1); // Exit if Kafka connection fails.
    }

    console.log(
      'line 70 | kafka-consumer.service.ts | Attempting to subscribe to topic: order-created...',
    );

    try {
      await this.consumer.subscribe({
        topics: ['order-created'],
        fromBeginning: true,
      });
      await this.consumer.subscribe({
        topics: ['request-product-quantities'],
        fromBeginning: true,
      });
      await this.consumer.subscribe({
        topics: ['response-1'],
        fromBeginning: true,
      });

      console.log(
        'line 88 | kafka-consumer.service.ts | Successfully subscribed to topic: order-created',
      );

      console.log(
        'line 92 | kafka-consumer.service.ts | Successfully subscribed to topic: request-product-quantities',
      );

      console.log(
        'line 86 | kafka-consumer.service.ts | Successfully subscribed to topic: response-1',
      );
    } catch (error) {
      console.error(
        'line 100 | kafka-consumer.service.ts | Error subscribing to topic:',
        error,
      );
      process.exit(1); // Exit if subscription fails.
    }

    console.log(
      'line 107 | kafka-consumer.service.ts | Starting consumer runner...',
    );

    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          switch (topic) {
            case 'order-created': {
              const products = JSON.parse(message.value.toString());

              console.log(
                `line 118 | kafka-consumer.service.ts | Received order products from topic ${topic} in partition ${partition} with offset ${message.offset}:`,
                products,
              );

              await this.productService.decreaseQuantity(products);
              break;
            }

            case 'request-product-quantities': {
              try {
                const { orderId, productIds } = JSON.parse(
                  message.value.toString(),
                );

                console.log(
                  'line 133 | kafka-consimer.service.ts | productIds: ',
                  productIds,
                );

                console.log(
                  'line 138 | kafka-consimer.service.ts | orderId: ',
                  orderId,
                );

                const products = await this.productService.findQuantitiesByIds(
                  productIds,
                );

                console.log(
                  'line 147 | kafka-consimer.service.ts | products: ',
                  products,
                );

                await this.producer.send({
                  topic: `response-product-quantities`,
                  messages: [{ value: JSON.stringify({ orderId, products }) }],
                });

                console.log(
                  'line 157 | kafka-consumer.service.ts | Successfully produced message to topic response-product-quantities.',
                );
              } catch (error) {
                console.error('line 160 | kafka-consumer.service.ts | Error producing message to Kafka:', error);
              }
              break;
            }
          }
        },
      });

      console.log('line 168 | kafka-consumer.service.ts | Consumer runner started successfully.');
    } catch (error) {
      console.error('line 170 | kafka-consumer.service.ts | Error in consumer runner:', error);
      process.exit(1); // Exit if consumer runner fails.
    }
  }
}
