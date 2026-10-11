import { z } from 'zod';
import { findTimeSlot, OTHER_PROBLEM } from '@/lib/constants';
import { isValidIsoDate } from '@/lib/dates';
import { optionalTrimmed, requiredTrimmed, trimmed } from '@/lib/parse';
import { normalizePhone } from '@/lib/phone';

/** Данные заявки с сайта. Проверки, которым нужна БД или текущее время, — в createOrder. */
export const orderSchema = z
  .object({
    categorySlug: requiredTrimmed(50, 'Выберите технику'),
    deviceType: optionalTrimmed(100),
    brand: optionalTrimmed(60),
    problem: requiredTrimmed(100, 'Выберите неисправность'),
    problemDetails: optionalTrimmed(1000),
    city: requiredTrimmed(100, 'Укажите город'),
    street: requiredTrimmed(200, 'Укажите улицу'),
    house: requiredTrimmed(30, 'Укажите дом'),
    flat: optionalTrimmed(20),
    addressComment: optionalTrimmed(500),
    visitDate: trimmed(10).refine(isValidIsoDate, 'Выберите дату выезда из предложенных'),
    timeSlot: z.string().transform((value, ctx) => {
      const slot = findTimeSlot(value);
      if (!slot) {
        ctx.addIssue({ code: 'custom', message: 'Выберите интервал' });
        return z.NEVER;
      }
      return slot;
    }),
    clientName: requiredTrimmed(100, 'Укажите имя'),
    phone: z.string().transform((value, ctx) => {
      const phone = normalizePhone(value);
      if (!phone) {
        ctx.addIssue({ code: 'custom', message: 'Проверьте номер телефона' });
        return z.NEVER;
      }
      return phone;
    }),
    comment: optionalTrimmed(1000),
    /** Скрытое поле-ловушка для ботов: человек его не видит и не заполняет. */
    website: trimmed(100),
  })
  .refine((o) => o.problem !== OTHER_PROBLEM || o.problemDetails, {
    message: 'Опишите проблему',
    path: ['problemDetails'],
  });

export type OrderInput = z.input<typeof orderSchema>;
