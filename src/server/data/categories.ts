import 'server-only';
import { prisma } from '../db';

/** Активные категории для главной страницы. */
export function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { slug: true, name: true },
  });
}

export type CategoryWithProblems = { slug: string; name: string; problems: string[] };

/** Активные категории с типовыми неисправностями — для формы заявки. */
export async function getCategoriesWithProblems(): Promise<CategoryWithProblems[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { slug: true, name: true, problems: { orderBy: { sortOrder: 'asc' }, select: { name: true } } },
  });
  return categories.map((c) => ({ ...c, problems: c.problems.map((p) => p.name) }));
}

/** Все категории (включая выключенные) — для выбора специализаций мастера. */
export function getCategoryOptions() {
  return prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } });
}
