import 'server-only';
import { z } from 'zod';

/** Пустая строка в .env равна «не задано». */
const optional = z
  .string()
  .trim()
  .transform((v) => v || undefined)
  .optional();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: optional.pipe(z.url().optional()),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET не задан или короче 32 символов'),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

/**
 * Переменные окружения сервера, проверенные по схеме.
 * Разбираются лениво: при `next build` секретов может не быть.
 */
export function env(): Env {
  if (!cached) {
    const result = schema.safeParse(process.env);
    if (!result.success) {
      throw new Error(`Неверные переменные окружения:\n${z.prettifyError(result.error)}`);
    }
    cached = result.data;
  }
  return cached;
}
