import { z } from 'zod';

const idSchema = z.coerce.number().int().positive();

/** Положительный целочисленный id из параметра маршрута или поля формы, иначе null. */
export function parseId(value: unknown): number | null {
  const result = idSchema.safeParse(value);
  return result.success ? result.data : null;
}

/** Строка без пробелов по краям, обрезанная до `max` символов. Отсутствующее значение — пустая строка. */
export const trimmed = (max: number) =>
  z
    .string()
    .nullish()
    .transform((v) => (v ?? '').trim().slice(0, max));

/** Как `trimmed`, но пустая строка превращается в null — для необязательных полей БД. */
export const optionalTrimmed = (max: number) => trimmed(max).transform((v) => v || null);

/** Обязательная строка с сообщением об ошибке для пользователя. */
export const requiredTrimmed = (max: number, message: string) => trimmed(max).pipe(z.string().min(1, message));

/** Первое сообщение об ошибке — пользователю показываем по одной. */
export const firstIssue = (error: z.ZodError) => error.issues[0]?.message ?? 'Проверьте введённые данные';
