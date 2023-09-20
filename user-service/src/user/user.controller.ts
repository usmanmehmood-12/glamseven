import {
  Controller,
  Get,
  Put,
  Param,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Find all users.
   *
   * @return {Promise<User[]>} A promise that resolves to an array of User objects.
   */
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * Find one user by id.
   *
   * @param {number} id - The id of the user.
   * @return {Promise<User>} A promise that resolves to the user with the given id.
   */
  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  /**
   * Creates a new user.
   *
   * @param {User} user - The user object containing the details of the user.
   * @return {Promise<User>} The newly created user object.
   */
  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  /**
   * Updates a user.
   *
   * @param {number} id - The ID of the user to update.
   * @param {User} updatedUser - The updated user object.
   * @return {Promise<User>} The updated user.
   */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatedUser: User,
  ): Promise<User> {
    return this.userService.update(id, updatedUser);
  }

  /**
   * Removes a record with the given ID.
   *
   * @param {string} id - The ID of the record to be removed.
   * @return {Promise<void>} A promise that resolves when the record is successfully removed.
   */
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
