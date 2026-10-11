import { z } from 'zod';
import { requiredTrimmed } from '@/lib/parse';
import { normalizePhone } from '@/lib/phone';

/** Значения формы мастера — как их видит пользователь (телефон в любом формате). */
export type MasterValues = {
  name: string;
  phone: string;
  categoryIds: number[];
  workDays: number[];
  isAvailable: boolean;
};

export const masterSchema = z.object({
  name: requiredTrimmed(100, 'Укажите имя мастера'),
  phone: z.string().transform((value, ctx) => {
    const phone = normalizePhone(value);
    if (!phone) {
      ctx.addIssue({ code: 'custom', message: 'Проверьте телефон: нужен номер из 11 цифр, например +7 900 123-45-67' });
      return z.NEVER;
    }
    return phone;
  }),
  categoryIds: z.array(z.number()).transform((ids) => ids.filter(Number.isInteger)),
  workDays: z
    .array(z.number())
    .transform((days) =>
      [...new Set(days)].filter((d) => Number.isInteger(d) && d >= 0 && d <= 6).sort((a, b) => a - b),
    ),
  isAvailable: z.boolean(),
});
