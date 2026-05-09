declare module 'mime-types' {
  export function extension(mime: string): string | false;
  export function lookup(path: string): string | false;
}