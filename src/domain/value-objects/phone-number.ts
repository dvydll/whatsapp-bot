// Phone number value object
export class PhoneNumber {
  private constructor(public readonly value: string) {}

  static create(value: string): PhoneNumber {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 10) throw new Error('Invalid phone number');
    return new PhoneNumber(cleaned);
  }

  toJid(): string {
    return `${this.value}@s.whatsapp.net`;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}