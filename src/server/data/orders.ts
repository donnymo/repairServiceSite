import 'server-only';
import type { OrderStatus, Prisma } from '@prisma/client';
import { prisma } from '../db';

export const ORDERS_PAGE_SIZE = 50;

/** Поиск по номеру заявки или телефону (по любой части цифр). */
function searchWhere(q: string): Prisma.OrderWhereInput {
  if (!q) return {};
  const digits = q.replace(/\D/g, '');
  if (!digits) return { id: { in: [] } };

  const or: Prisma.OrderWhereInput[] = [{ phone: { contains: digits } }];
  if (digits.startsWith('8') && digits.length > 1) or.push({ phone: { contains: `7${digits.slice(1)}` } });
  if (digits.length <= 9) or.push({ id: Number(digits) });
  return { OR: or };
}

export type OrdersQuery = { q: string; status?: OrderStatus; page: number };

/** Страница списка заявок и счётчики по статусам (с учётом поиска, без учёта фильтра статуса). */
export async function listOrders({ q, status, page }: OrdersQuery) {
  const base = searchWhere(q);
  const where: Prisma.OrderWhereInput = status ? { AND: [base, { status }] } : base;

  const [orders, total, groups] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * ORDERS_PAGE_SIZE,
      take: ORDERS_PAGE_SIZE,
      include: { category: { select: { name: true } }, master: { select: { name: true } } },
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ['status'], where: base, _count: { _all: true } }),
  ]);

  const counts: Partial<Record<OrderStatus, number>> = Object.fromEntries(groups.map((g) => [g.status, g._count._all]));
  const allCount = groups.reduce((sum, g) => sum + g._count._all, 0);

  return { orders, total, counts, allCount, pages: Math.max(1, Math.ceil(total / ORDERS_PAGE_SIZE)) };
}

export function countNewOrders() {
  return prisma.order.count({ where: { status: 'NEW' } });
}

export function getOrderCard(id: number) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      category: true,
      master: true,
      history: { orderBy: { id: 'desc' } },
      notes: { orderBy: { id: 'asc' } },
    },
  });
}

export type OrderCard = NonNullable<Awaited<ReturnType<typeof getOrderCard>>>;
