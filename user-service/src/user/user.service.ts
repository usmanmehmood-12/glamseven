import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Find all users.
   *
   * @return {Promise<User[]>} The list of users.
   */
  findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (error) {
      console.log('line 22 | user.service.ts | error: ', error);
    }
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {number} id - The ID of the user to retrieve.
   * @return {Promise<User>} A promise that resolves to the user object.
   */
  findOne(id: number): Promise<User> {
    try {
      return this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      console.log('line 36 | user.service.ts | error: ', error);
    }
  }

  /**
   * Removes an item with the specified ID.
   *
   * @param {string} id - The ID of the item to be removed.
   * @return {Promise<void>} A promise that resolves when the item is successfully removed.
   */
  async remove(id: string): Promise<void> {
    try {
      await this.usersRepository.delete(id);
    } catch (error) {
      console.log('line 50 | user.service.ts | error: ', error);
    }
  }

  /**
   * Creates a new user.
   *
   * @param {User} user - The user object to be created.
   * @return {Promise<User>} A promise that resolves with the created user object.
   */
  create(user: User): Promise<User> {
    try {
      return this.usersRepository.save(user);
    } catch (error) {
      console.log('line 64 | user.service.ts | error: ', error);
    }
  }

  /**
   * Updates a user with the given ID and returns the updated user.
   *
   * @param {number} id - The ID of the user to update.
   * @param {User} updatedUser - The updated user object.
   * @return {Promise<User>} The updated user.
   */
  async update(id: number, updatedUser: User): Promise<User> {
    try {
      await this.usersRepository.update(id, updatedUser);
      return this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      console.log('line 80 | user.service.ts | error: ', error);
    }
  }
}
