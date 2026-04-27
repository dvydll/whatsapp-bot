// Validation utilities
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function isValidJid(jid: string): boolean {
  return /^\d+@g\.us$|^\d+@s\.whatsapp\.net$/.test(jid);
}

export function isValidNumber(value: string): boolean {
  return /^\d+$/.test(value);
}