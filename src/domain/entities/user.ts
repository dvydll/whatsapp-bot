// User entity
export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  balance: number;
  level: number;
  registeredAt: Date;
  lastSeenAt: Date;
}

export type UserCreate = Omit<User, 'id' | 'registeredAt' | 'lastSeenAt'>;
export type UserUpdate = Partial<Omit<User, 'id'>>;