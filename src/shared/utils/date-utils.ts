// Date utilities
export function formatDate(date: Date, timezone = 'America/Lima'): string {
  return date.toLocaleString('es-PE', { timeZone: timezone });
}

export function getTimestamp(date: Date = new Date()): number {
  return Math.floor(date.getTime() / 1000);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}