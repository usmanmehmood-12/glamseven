import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { Order } from './entity/order.entity';
import { OrderProduct } from './entity/order-product.entity';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Find all orders.
   *
   * @return {Promise<Order[]>} A promise that resolves to an array of Order objects.
   */
  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  /**
   * Retrieves a single order by its ID.
   *
   * @param {number} id - The ID of the order to retrieve.
   * @return {Promise<Order>} A promise that resolves to the order object.
   */
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Order> {
    return this.orderService.findOne(id);
  }

  /**
   * Creates a new order using the provided order data.
   *
   * @param {Object} orderData - The order data containing the order and products.
   * @param {Order} orderData.order - The order details.
   * @param {OrderProduct[]} orderData.products - The list of products in the order.
   * @return {Promise<Order>} A promise that resolves to the created order.
   */
  @Post()
  create(
    @Body() orderData: { order: Order; products: OrderProduct[] },
  ): Promise<Order> {
    return this.orderService.create(orderData.order, orderData.products);
  }

  /**
   * Updates an order.
   *
   * @param {number} id - The ID of the order.
   * @param {{ order: Order, products: OrderProduct[] }} orderData - The data for the order and its products.
   * @return {Promise<Order>} A promise that resolves to the updated order.
   */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() orderData: { order: Order; products: OrderProduct[] },
  ): Promise<Order> {
    return this.orderService.updateOrder(id, orderData);
  }

  /**
   * Remove an item.
   *
   * @param {number} id - The id of the item to be removed.
   * @return {Promise<void>} A promise that resolves once the item is removed.
   */
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.orderService.remove(id);
  }
}
