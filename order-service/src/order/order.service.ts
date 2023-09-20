import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { OrderProduct } from './entity/order-product.entity';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    private readonly kafkaService: KafkaService, // Inject the KafkaService
  ) {}

  /**
   * Creates a new order and saves it to the database.
   *
   * @param {Order} order - The order to be created.
   * @param {OrderProduct[]} products - The products associated with the order.
   * @return {Promise<Order>} - The newly created order.
   */
  async create(order: Order, products: OrderProduct[]): Promise<Order> {
    try {
      const savedOrder = await this.orderRepository.save(order);
      products.forEach((product) => (product.order = savedOrder));
      await this.orderProductRepository.save(products);

      // Publish the products to Kafka
      this.kafkaService.sendOrderToKafka(products);
      return savedOrder;
    } catch (error) {
      console.log('line 35 | order.service.ts | error: ', error);
    }
  }

  /**
   * Finds and returns a single order by its id.
   *
   * @param {number} id - The id of the order to find.
   * @return {Promise<Order>} The order object.
   */
  async findOne(id: number): Promise<Order> {
    try {
      return await this.orderRepository.findOne({
        where: { id: id },
        relations: ['orderProducts'],
      });
    } catch (error) {
      console.log('line 52 | order.service.ts | error: ', error);
    }
  }

  /**
   * Removes an order and its associated OrderProduct records from the database.
   *
   * @param {number} id - The ID of the order to be removed.
   * @return {Promise<void>} A promise that resolves when the order and associated records are successfully removed.
   */
  async remove(id: number): Promise<void> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: id },
        relations: ['orderProducts'],
      });

      if (!order) {
        throw new Error('line 70 | order.Service.ts | Order not found');
      }

      // First, delete the associated OrderProduct records
      await this.orderProductRepository.remove(order.orderProducts);

      // Then, delete the order itself
      await this.orderRepository.delete(id);
    } catch (error) {
      console.log('line 79 | order.service.ts | error: ', error);
    }
  }

  /**
   * Updates an order with the given order ID and updated order data.
   *
   * @param {number} orderId - The ID of the order to be updated.
   * @param {Object} updatedOrderData - The updated order data.
   * @param {Order} updatedOrderData.order - The updated order object.
   * @param {OrderProduct[]} updatedOrderData.products - The updated order products array.
   * @return {Promise<Order>} The updated order.
   */
  async updateOrder(
    orderId: number,
    updatedOrderData: { order: Order; products: OrderProduct[] },
  ): Promise<Order> {
    try {
      // Extract product IDs from the updated order data
      const productIds = updatedOrderData.products.map(
        (product) => product.product_id,
      );

      // Request product quantities and wait for the response
      const productQuantitiesResponse =
        await this.kafkaService.requestProductQuantities(orderId, productIds);

      // Map the products from the response
      const productQuantitiesMap = new Map<number, number>();
      productQuantitiesResponse.products.forEach((product) => {
        productQuantitiesMap.set(product.id, product.quantity);
      });

      // Check if the quantities are sufficient
      for (const product of updatedOrderData.products) {
        const availableQuantity =
          productQuantitiesMap.get(product.product_id) || 0;
        if (availableQuantity <= 0 || availableQuantity < product.quantity) {
          throw new Error(
            `line 118 | order.Service.ts | Insufficient quantity for product ID ${product.product_id}.`,
          );
        }
      }

      // If quantities are sufficient, proceed with the order update
      const orderToUpdate = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['orderProducts'],
      });
      if (!orderToUpdate) {
        throw new Error('line 129 | order.Service.ts | Order not found');
      }

      // Update the order products
      for (const product of updatedOrderData.products) {
        const orderProduct = orderToUpdate.orderProducts.find(
          (op) => op.product_id === product.product_id,
        );
        if (orderProduct && product.quantity > 0) {
          orderProduct.quantity = product.quantity; // update the quantity
          await this.orderProductRepository.save(orderProduct);
        }
      }
      return orderToUpdate;
    } catch (error) {
      console.log('line 144 | order.Service.ts | error: ', error);
    }
  }

  /**
   * Retrieves all orders from the order repository.
   *
   * @return {Promise<Order[]>} A promise that resolves to an array of orders.
   */
  findAll(): Promise<Order[]> {
    try {
      return this.orderRepository.find();
    } catch (error) {
      console.log('line 157 | order.service.ts | error: ', error);
    }
  }
}
