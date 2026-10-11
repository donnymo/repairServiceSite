import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { z } from 'zod';
import { prisma } from './db';
import { env } from './env';

const COOKIE_NAME = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

const tokenPayload = z.object({ id: z.number().int(), exp: z.number() });

function sign(payload: string): string {
  return createHmac('sha256', env().SESSION_SECRET).update(payload).digest('base64url');
}

function createToken(adminId: number): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ id: adminId, exp })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string): number | null {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const actual = Buffer.from(signature);
  const expected = Buffer.from(sign(payload));
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  try {
    const data = tokenPayload.safeParse(JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')));
    if (!data.success || data.data.exp < Date.now() / 1000) return null;
    return data.data.id;
  } catch {
    return null;
  }
}

export async function startSession(adminId: number) {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(adminId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: env().APP_URL?.startsWith('https://') ?? false,
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Текущий администратор. `cache` — один запрос к БД на рендер, сколько бы раз ни вызвали. */
export const getAdmin = cache(async () => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const id = token ? readToken(token) : null;
  if (!id) return null;
  return prisma.admin.findUnique({ where: { id }, select: { id: true, email: true } });
});

/** Для страниц и серверных действий админки: без сессии — на страницу входа. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}
