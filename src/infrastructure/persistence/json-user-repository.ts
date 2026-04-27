// JSON user repository implementation
import type { UserRepository } from '../../domain/repositories/index.js';
import type { User, UserCreate, UserUpdate } from '../../domain/entities/user.js';

export class JsonUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    // TODO: Load from JSON file
    return null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    // TODO: Load from JSON file
    return null;
  }

  async create(data: UserCreate): Promise<User> {
    // TODO: Save to JSON file
    throw new Error('Not implemented');
  }

  async update(id: string, data: UserUpdate): Promise<User> {
    // TODO: Update JSON file
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    // TODO: Delete from JSON file
  }

  async findAll(): Promise<User[]> {
    // TODO: Load from JSON file
    return [];
  }

  async incrementBalance(id: string, amount: number): Promise<User> {
    // TODO: Load, update, save
    throw new Error('Not implemented');
  }
}