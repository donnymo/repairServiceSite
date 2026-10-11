'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { parseId } from '@/lib/parse';
import { requireAdmin } from '@/server/auth';
import { prisma } from '@/server/db';
import { masterSchema, type MasterValues } from './schema';

export type MasterFormState = { error: string; values: MasterValues } | null;

export async function saveMaster(_prev: MasterFormState, formData: FormData): Promise<MasterFormState> {
  await requireAdmin();
  const id = parseId(formData.get('id'));
  const values: MasterValues = {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    categoryIds: formData.getAll('categoryIds').map(Number),
    workDays: formData.getAll('workDays').map(Number),
    isAvailable: formData.get('isAvailable') === 'true',
  };

  const parsed = masterSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const { categoryIds, ...data } = parsed.data;

  // Несуществующие категории отбрасываем, а не роняем сохранение.
  const categories = await prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true } });

  if (id) {
    try {
      await prisma.master.update({ where: { id }, data: { ...data, specializations: { set: categories } } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        return { error: 'Мастер не найден — возможно, его удалили', values };
      }
      throw err;
    }
  } else {
    await prisma.master.create({ data: { ...data, specializations: { connect: categories } } });
  }

  revalidatePath('/admin/masters');
  redirect('/admin/masters');
}

export async function toggleMaster(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData.get('id'));
  const master = id ? await prisma.master.findUnique({ where: { id }, select: { isAvailable: true } }) : null;
  if (id && master) {
    await prisma.master.update({ where: { id }, data: { isAvailable: !master.isAvailable } });
  }
  revalidatePath('/admin/masters');
}
