import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Find all products.
   *
   * @return {Promise<Product[]>} A promise that resolves with an array of products.
   */
  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  /**
   * Retrieves a single product by its ID.
   *
   * @param {number} id - The ID of the product.
   * @return {Promise<Product>} A Promise that resolves with the retrieved product.
   */
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  /**
   * Creates a new product.
   *
   * @param {Product} product - The product to be created.
   * @return {Promise<Product>} - The created product.
   */
  @Post()
  create(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }

  /**
   * Updates a product.
   *
   * @param {number} id - The ID of the product.
   * @param {Product} product - The updated product object.
   * @return {Promise<Product>} - The updated product.
   */
  @Put(':id')
  update(@Param('id') id: number, @Body() product: Product): Promise<Product> {
    console.log('id: ', id);
    console.log('product: ', product);
    return this.productService.update(id, product);
  }

  /**
   * Removes a product from the database.
   *
   * @param {string} id - The ID of the product to be removed.
   * @return {Promise<void>} A promise that resolves when the product is successfully removed.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(id);
  }
}
