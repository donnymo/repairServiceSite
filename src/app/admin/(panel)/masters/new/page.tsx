import Link from 'next/link';
import { ChevronLeftIcon } from '@/components/icons';
import { requireAdmin } from '@/server/auth';
import { getCategoryOptions } from '@/server/data/categories';
import { MasterForm } from '../_components/MasterForm';

export default async function NewMasterPage() {
  await requireAdmin();
  const categories = await getCategoryOptions();

  return (
    <>
      <Link href="/admin/masters" className="back-link">
        <ChevronLeftIcon size={18} />
        Все мастера
      </Link>
      <h1 className="page-title">Новый мастер</h1>
      <MasterForm
        categories={categories}
        initial={{ name: '', phone: '', categoryIds: [], workDays: [1, 2, 3, 4, 5], isAvailable: true }}
      />
    </>
  );
}
