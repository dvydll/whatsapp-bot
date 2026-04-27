// Validation error
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class InvalidPhoneError extends ValidationError {
  constructor(phone: string) {
    super(`Invalid phone number: ${phone}`, 'phone');
    this.name = 'InvalidPhoneError';
  }
}

export class InvalidAmountError extends ValidationError {
  constructor(amount: number) {
    super(`Invalid amount: ${amount}`, 'amount');
    this.name = 'InvalidAmountError';
  }
}