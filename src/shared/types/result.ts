// Result type
export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  ok: true;
  value: T;
}

export interface Failure<E = Error> {
  ok: false;
  error: E;
}

export function success<T>(value: T): Success<T> {
  return { ok: true, value };
}

export function failure<E = Error>(error: E): Failure<E> {
  return { ok: false, error };
}