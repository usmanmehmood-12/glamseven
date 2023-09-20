import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Find all products.
   *
   * @return {Promise<Product[]>} A promise that resolves with an array of products.
   */
  findAll(): Promise<Product[]> {
    try {
      return this.productRepository.find();
    } catch (error) {
      console.log('line 22 | product.service.ts | error: ', error);
    }
  }

  /**
   * Decreases the quantity of ordered products.
   *
   * @param {any[]} orderedProducts - An array of ordered products.
   * @return {Promise<void>} - A promise that resolves once the quantity of each ordered product has been decreased.
   */
  async decreaseQuantity(orderedProducts: any[]): Promise<void> {
    try {
      for (const orderedProduct of orderedProducts) {
        const product = await this.productRepository.findOne({
          where: { id: orderedProduct.product_id },
        });

        if (product && product.quantity >= orderedProduct.quantity) {
          product.quantity -= orderedProduct.quantity;
          await this.productRepository.save(product);
        } else {
          // Handle cases where the product is not found or there's insufficient stock
          console.error(
            `Failed to decrease quantity for product ID ${orderedProduct.product_id}.`,
          );
        }
      }
    } catch (error) {
      console.log('line 50 | product.service.ts | error: ', error);
    }
  }

  /**
   * Finds a product by its ID.
   *
   * @param {number} id - The ID of the product.
   * @return {Promise<Product>} A promise that resolves to the product object.
   */
  findOne(id: number): Promise<Product> {
    try {
      return this.productRepository.findOne({ where: { id } });
    } catch (error) {
      console.log('line 64 | product.service.ts | error: ', error);
    }
  }

  /**
   * Remove a product by its ID.
   *
   * @param {string} id - The ID of the product to be removed.
   * @return {Promise<void>} A promise that resolves when the product is removed.
   */
  async remove(id: string): Promise<void> {
    try {
      await this.productRepository.delete(id);
    } catch (error) {
      console.log('line 78 | product.service.ts | error: ', error);
    }
  }

  /**
   * Creates a new product.
   *
   * @param {Product} product - The product to be created.
   * @return {Promise<Product>} - A promise that resolves to the created product.
   */
  create(product: Product): Promise<Product> {
    try {
      return this.productRepository.save(product);
    } catch (error) {
      console.log('line 92 | product.service.ts | error: ', error);
    }
  }

  /**
   * Updates a product with the specified ID.
   *
   * @param {number} id - The ID of the product to update.
   * @param {Product} updatedProduct - The updated product object.
   * @return {Promise<Product>} - The updated product.
   */
  async update(id: number, updatedProduct: Product): Promise<Product> {
    try {
      await this.productRepository.update(id, updatedProduct);
      return this.productRepository.findOne({ where: { id } });
    } catch (error) {
      console.log('line 108 | product.service.ts | error: ', error);
    }
  }

  /**
   * Retrieves a list of quantities by their IDs.
   *
   * @param {number[]} ids - An array of IDs to search for.
   * @return {Promise<{ id: number, quantity: number }[]>} - A promise that resolves to an array of objects containing the ID and quantity.
   */
  async findQuantitiesByIds(
    ids: number[],
  ): Promise<{ id: number; quantity: number }[]> {
    try {
      const products = await this.productRepository.find({
        where: { id: In(ids) },
        select: ['id', 'quantity'],
      });
      return products.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }));
    } catch (error) {
      console.log('line 132 | product.service.ts | error: ', error);
    }
  }
}
