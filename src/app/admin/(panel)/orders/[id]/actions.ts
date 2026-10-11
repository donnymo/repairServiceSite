'use server';

import type { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { findTimeSlot, isOrderStatus } from '@/lib/constants';
import { formatVisitDate, isoToDate, isValidIsoDate } from '@/lib/dates';
import { parseId } from '@/lib/parse';
import { requireAdmin } from '@/server/auth';
import { prisma } from '@/server/db';

/** Код ошибки в query-параметре карточки. Тексты — в page.tsx. */
export type OrderActionError = 'status' | 'no-master' | 'master' | 'time' | 'note';

/** Статусы, в которых у заявки обязательно есть мастер. */
const MASTER_REQUIRED: readonly OrderStatus[] = ['MASTER_ASSIGNED', 'MASTER_ON_WAY'];

/**
 * Вернуться на карточку заявки. Сбрасываем кеш всей админки,
 * иначе счётчик новых заявок в меню устареет.
 */
function backToOrder(id: number, error?: OrderActionError): never {
  revalidatePath('/admin', 'layout');
  redirect(`/admin/orders/${id}${error ? `?error=${error}` : ''}`);
}

/** Проверка сессии и загрузка заявки из скрытого поля orderId. */
async function authorize(formData: FormData) {
  const admin = await requireAdmin();
  const id = parseId(formData.get('orderId'));
  const order = id ? await prisma.order.findUnique({ where: { id } }) : null;
  if (!order) redirect('/admin/orders');
  return { admin, order };
}

export async function changeStatus(formData: FormData) {
  const { admin, order } = await authorize(formData);
  const status = formData.get('status');
  if (!isOrderStatus(status)) backToOrder(order.id, 'status');
  if (MASTER_REQUIRED.includes(status) && !order.masterId) backToOrder(order.id, 'no-master');

  if (status !== order.status) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status,
        history: { create: { status, message: 'Статус изменён', author: admin.email } },
      },
    });
  }
  backToOrder(order.id);
}

export async function assignMaster(formData: FormData) {
  const { admin, order } = await authorize(formData);
  const masterId = parseId(formData.get('masterId'));
  if (masterId === order.masterId) backToOrder(order.id);

  if (masterId === null) {
    // Без мастера заявка не может быть «Назначен мастер» / «Мастер выехал» — возвращаем в «Принята».
    const statusAfter: OrderStatus = MASTER_REQUIRED.includes(order.status) ? 'ACCEPTED' : order.status;
    await prisma.order.update({
      where: { id: order.id },
      data: {
        masterId: null,
        status: statusAfter,
        history: {
          create: {
            status: statusAfter !== order.status ? statusAfter : null,
            message: 'Мастер снят с заявки',
            author: admin.email,
          },
        },
      },
    });
    backToOrder(order.id);
  }

  const master = await prisma.master.findUnique({ where: { id: masterId } });
  if (!master?.isAvailable) backToOrder(order.id, 'master');

  // Назначение мастера на новую или принятую заявку сразу переводит её в «Назначен мастер».
  const nextStatus: OrderStatus =
    order.status === 'NEW' || order.status === 'ACCEPTED' ? 'MASTER_ASSIGNED' : order.status;
  await prisma.order.update({
    where: { id: order.id },
    data: {
      masterId: master.id,
      status: nextStatus,
      history: {
        create: {
          status: nextStatus !== order.status ? nextStatus : null,
          message: `Назначен мастер: ${master.name}`,
          author: admin.email,
        },
      },
    },
  });
  backToOrder(order.id);
}

export async function reschedule(formData: FormData) {
  const { admin, order } = await authorize(formData);
  const date = String(formData.get('visitDate') ?? '');
  const slot = findTimeSlot(formData.get('timeSlot'));
  if (!isValidIsoDate(date) || !slot) backToOrder(order.id, 'time');

  const visitDate = isoToDate(date);
  if (visitDate.getTime() !== order.visitDate.getTime() || slot.value !== order.timeSlot) {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        visitDate,
        timeSlot: slot.value,
        history: {
          create: { message: `Выезд перенесён: ${formatVisitDate(visitDate)}, ${slot.value}`, author: admin.email },
        },
      },
    });
  }
  backToOrder(order.id);
}

export async function addNote(formData: FormData) {
  const { admin, order } = await authorize(formData);
  const text = String(formData.get('text') ?? '')
    .trim()
    .slice(0, 2000);
  if (!text) backToOrder(order.id, 'note');

  await prisma.orderNote.create({ data: { orderId: order.id, text, author: admin.email } });
  backToOrder(order.id);
}
