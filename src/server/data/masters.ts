import 'server-only';
import type { Prisma } from '@prisma/client';
import { prisma } from '../db';

export const MASTER_FILTERS = [
  { key: '', label: 'Все', where: {} },
  { key: 'available', label: 'Доступны', where: { isAvailable: true } },
  { key: 'unavailable', label: 'Недоступны', where: { isAvailable: false } },
] as const satisfies readonly { key: string; label: string; where: Prisma.MasterWhereInput }[];

export type MasterFilter = (typeof MASTER_FILTERS)[number];

export async function listMasters(filter: MasterFilter) {
  const [masters, counts] = await Promise.all([
    prisma.master.findMany({
      where: filter.where,
      orderBy: [{ isAvailable: 'desc' }, { name: 'asc' }],
      include: { specializations: { select: { id: true, name: true }, orderBy: { sortOrder: 'asc' } } },
    }),
    Promise.all(MASTER_FILTERS.map((f) => prisma.master.count({ where: f.where }))),
  ]);
  return { masters, counts };
}

export function getMaster(id: number) {
  return prisma.master.findUnique({ where: { id }, include: { specializations: { select: { id: true } } } });
}

export type MasterCandidate = {
  id: number;
  name: string;
  phone: string;
  /** Специализация совпадает с категорией заявки */
  match: boolean;
  /** Рабочий день мастера совпадает с днём выезда */
  works: boolean;
};

/**
 * Мастера для назначения на заявку: доступные — с подсказками и сортировкой
 * (сначала подходящие по профилю, затем работающие в день выезда), и имена недоступных.
 */
export async function getMasterCandidates(order: { categoryId: number; visitDate: Date }) {
  const weekday = order.visitDate.getUTCDay();
  const [available, unavailable] = await Promise.all([
    prisma.master.findMany({
      where: { isAvailable: true },
      include: { specializations: { select: { id: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.master.findMany({ where: { isAvailable: false }, select: { name: true }, orderBy: { name: 'asc' } }),
  ]);

  const score = (m: MasterCandidate) => Number(m.match) * 2 + Number(m.works);
  const candidates: MasterCandidate[] = available
    .map((m) => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      match: m.specializations.some((s) => s.id === order.categoryId),
      works: m.workDays.includes(weekday),
    }))
    .sort((a, b) => score(b) - score(a));

  return { candidates, unavailableNames: unavailable.map((m) => m.name) };
}
