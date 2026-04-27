// Register user use case
import type { UserRepository } from '../../domain/repositories/index.js';
import type { UserCreate } from '../../domain/entities/user.js';

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UserCreate): Promise<void> {
    // TODO: Implement user registration logic
  }
}