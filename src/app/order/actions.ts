'use server';

import { BOOKING_DAYS, isSlotPast, OTHER_CATEGORY_SLUG, OTHER_PROBLEM } from '@/lib/constants';
import { addDaysIso, formatVisitDate, isoToDate, nowInAppTz } from '@/lib/dates';
import { capitalize } from '@/lib/format';
import { firstIssue } from '@/lib/parse';
import { prisma } from '@/server/db';
import { orderSchema, type OrderInput } from './schema';

export type OrderResult = { ok: true; number: number; visitLabel: string } | { ok: false; error: string };

const fail = (error: string): OrderResult => ({ ok: false, error });

export async function createOrder(input: OrderInput): Promise<OrderResult> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error));
  const data = parsed.data;

  if (data.website) return fail('Не удалось отправить заявку. Позвоните нам.');

  const category = await prisma.category.findFirst({
    where: { slug: data.categorySlug, isActive: true },
    include: { problems: { select: { name: true } } },
  });
  if (!category) return fail('Выберите технику');

  const isOtherCategory = category.slug === OTHER_CATEGORY_SLUG;
  if (isOtherCategory && !data.deviceType) return fail('Укажите, какая техника');
  if (!category.problems.some((p) => p.name === data.problem)) return fail('Выберите неисправность');

  const today = nowInAppTz();
  if (data.visitDate < today.iso || data.visitDate > addDaysIso(today.iso, BOOKING_DAYS - 1)) {
    return fail('Выберите дату выезда из предложенных');
  }
  if (isSlotPast(data.timeSlot, data.visitDate, today)) {
    return fail('Этот интервал сегодня уже прошёл — выберите другой');
  }

  const order = await prisma.order.create({
    data: {
      categoryId: category.id,
      deviceType: isOtherCategory ? data.deviceType : null,
      brand: data.brand,
      problem: data.problem,
      // Описание есть только у «Другой проблемы»: после смены неисправности в форме оно скрыто, но остаётся в данных.
      problemDetails: data.problem === OTHER_PROBLEM ? data.problemDetails : null,
      city: data.city,
      street: data.street,
      house: data.house,
      flat: data.flat,
      addressComment: data.addressComment,
      visitDate: isoToDate(data.visitDate),
      timeSlot: data.timeSlot.value,
      clientName: data.clientName,
      phone: data.phone,
      comment: data.comment,
      history: { create: { status: 'NEW', message: 'Заявка создана на сайте', author: 'Сайт' } },
    },
  });

  return {
    ok: true,
    number: order.id,
    visitLabel: capitalize(`${formatVisitDate(order.visitDate)}, ${order.timeSlot}`),
  };
}
