import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeftIcon } from '@/components/icons';
import { parseId } from '@/lib/parse';
import { formatPhone } from '@/lib/phone';
import { requireAdmin } from '@/server/auth';
import { getCategoryOptions } from '@/server/data/categories';
import { getMaster } from '@/server/data/masters';
import { MasterForm } from '../_components/MasterForm';

export default async function EditMasterPage({ params }: PageProps<'/admin/masters/[id]'>) {
  await requireAdmin();
  const id = parseId((await params).id);
  if (!id) notFound();

  const [master, categories] = await Promise.all([getMaster(id), getCategoryOptions()]);
  if (!master) notFound();

  return (
    <>
      <Link href="/admin/masters" className="back-link">
        <ChevronLeftIcon size={18} />
        Все мастера
      </Link>
      <h1 className="page-title">{master.name}</h1>
      <MasterForm
        id={master.id}
        categories={categories}
        initial={{
          name: master.name,
          phone: formatPhone(master.phone),
          categoryIds: master.specializations.map((s) => s.id),
          workDays: master.workDays,
          isAvailable: master.isAvailable,
        }}
      />
    </>
  );
}
