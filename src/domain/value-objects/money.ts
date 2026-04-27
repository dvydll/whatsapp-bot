// Money value object
export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string = 'COINS'
  ) {}

  static create(amount: number, currency: string = 'COINS'): Money {
    if (amount < 0) throw new Error('Amount cannot be negative');
    return new Money(Math.floor(amount), currency);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}