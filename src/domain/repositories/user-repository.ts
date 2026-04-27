// User repository interface
import type { User, UserCreate, UserUpdate } from '../entities/user.js';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  create(data: UserCreate): Promise<User>;
  update(id: string, data: UserUpdate): Promise<User>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
  incrementBalance(id: string, amount: number): Promise<User>;
}