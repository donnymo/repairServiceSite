import type { Metadata } from 'next';
import { BOOKING_DAYS } from '@/lib/constants';
import { buildBookingDays, nowInAppTz } from '@/lib/dates';
import { getCategoriesWithProblems } from '@/server/data/categories';
import { OrderForm } from './_components/OrderForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Вызов мастера — заявка на ремонт' };

export default async function OrderPage({ searchParams }: PageProps<'/order'>) {
  const { category } = await searchParams;
  const categories = await getCategoriesWithProblems();
  const initialCategory = categories.find((c) => c.slug === category)?.slug ?? '';
  const today = nowInAppTz();

  return (
    <div className="order-page">
      <OrderForm
        categories={categories}
        initialCategory={initialCategory}
        days={buildBookingDays(today.iso, BOOKING_DAYS)}
        today={today}
      />
    </div>
  );
}
