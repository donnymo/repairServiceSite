'use server';

import { randomUUID } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { endSession, startSession } from '@/server/auth';
import { prisma } from '@/server/db';
import { hashPassword, verifyPassword } from '@/server/password';

export type LoginState = { error: string; email: string } | null;

const loginSchema = z.object({
  email: z
    .string()
    .nullish()
    .transform((v) => (v ?? '').trim().toLowerCase()),
  password: z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
});

/** Пауза при неверном пароле — подбор становится медленнее. */
const FAILED_LOGIN_DELAY_MS = 600;

/** Хеш случайного пароля той же стоимости, что и настоящие. Считается один раз. */
let dummyHashPromise: Promise<string> | undefined;
const dummyHash = () => (dummyHashPromise ??= hashPassword(randomUUID()));

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const { email, password } = loginSchema.parse(Object.fromEntries(formData));

  const admin = email ? await prisma.admin.findUnique({ where: { email } }) : null;
  // Хеш считаем и для несуществующего email — иначе по времени ответа видно, какие email зарегистрированы.
  const valid = await verifyPassword(password, admin?.passwordHash ?? (await dummyHash()));
  if (!admin || !valid) {
    await sleep(FAILED_LOGIN_DELAY_MS);
    return { error: 'Неверный email или пароль', email };
  }

  await startSession(admin.id);
  redirect('/admin/orders');
}

export async function logout() {
  await endSession();
  redirect('/admin/login');
}
