// Economy service interface
export interface EconomyService {
  getBalance(userId: string): Promise<number>;
  addCoins(userId: string, amount: number): Promise<void>;
  deductCoins(userId: string, amount: number): Promise<boolean>;
  transferCoins(fromUserId: string, toUserId: string, amount: number): Promise<boolean>;
}