import type { Next } from 'hono';
import { cors as honoCors } from 'hono/cors';
import type { Context } from '../config';

const allowedOrigins = [
  'http://localhost:4200',
  'https://lola-banking.cwsoftware.biz',
  'https://lola-banking.waldrickservices.com',
];

export async function cors(ctx: Context, next: Next) {
  const origin = ctx.req.header('origin') ?? '';

  if (!allowedOrigins.includes(origin)) {
    return ctx.text('Not allowed', 403);
  }

  const handler = honoCors({
    origin: origin,
    allowHeaders: ['authorization', 'content-type', 'force-refresh', 'x-filename'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  return handler(ctx, next);
}
