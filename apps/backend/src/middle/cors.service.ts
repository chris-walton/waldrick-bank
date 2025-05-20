import type { Next } from 'hono';
import { cors as honoCors } from 'hono/cors';
import type { Context } from '../config';

export async function cors(ctx: Context, next: Next) {
  const handler = honoCors({
    origin: 'http://localhost:4200',
    allowHeaders: ['authorization', 'content-type', 'force-refresh', 'x-filename'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  return handler(ctx, next);
}
