import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeftIcon, PhoneIcon } from '@/components/icons';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDateTime, formatVisitDate } from '@/lib/dates';
import { formatAddress } from '@/lib/format';
import { parseId } from '@/lib/parse';
import { formatPhone } from '@/lib/phone';
import { requireAdmin } from '@/server/auth';
import { getMasterCandidates } from '@/server/data/masters';
import { getOrderCard } from '@/server/data/orders';
import type { OrderActionError } from './actions';
import { DetailsPanel, Empty } from './_components/DetailsPanel';
import { HistoryPanel } from './_components/HistoryPanel';
import { MasterPanel } from './_components/MasterPanel';
import { NotesPanel } from './_components/NotesPanel';
import { RescheduleForm } from './_components/RescheduleForm';
import { StatusForm } from './_components/StatusForm';

const ERRORS: Record<OrderActionError, string> = {
  status: 'Неизвестный статус.',
  'no-master': 'Сначала назначьте мастера — без него нельзя поставить этот статус.',
  master: 'Этот мастер недоступен — выберите другого.',
  time: 'Проверьте дату и интервал.',
  note: 'Комментарий пустой.',
};

export default async function OrderCardPage({ params, searchParams }: PageProps<'/admin/orders/[id]'>) {
  await requireAdmin();
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const orderId = parseId(id);
  const order = orderId ? await getOrderCard(orderId) : null;
  if (!order) notFound();

  const { candidates, unavailableNames } = await getMasterCandidates(order);
  const errorMessage = typeof error === 'string' ? ERRORS[error as OrderActionError] : undefined;

  return (
    <>
      <Link href="/admin/orders" className="back-link">
        <ChevronLeftIcon size={18} />
        Все заявки
      </Link>

      <div className="page-head">
        <div className="stack stack-xs">
          <div className="title-row">
            <h1>Заявка № {order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <span className="muted">Создана {formatDateTime(order.createdAt)} · источник: сайт</span>
        </div>
        <a href={`tel:${order.phone}`} className="btn btn-outline">
          <PhoneIcon size={18} />
          Позвонить клиенту
        </a>
      </div>

      {errorMessage && (
        <div className="alert alert-error" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="detail-grid">
        <div className="col-main">
          <DetailsPanel
            title="Клиент"
            rows={[
              { label: 'Имя', value: order.clientName },
              { label: 'Телефон', value: <a href={`tel:${order.phone}`}>{formatPhone(order.phone)}</a> },
              { label: 'Комментарий клиента', value: order.comment ?? <Empty /> },
            ]}
          />

          <DetailsPanel
            title="Техника"
            rows={[
              {
                label: 'Категория',
                value: order.deviceType ? `${order.category.name}: ${order.deviceType}` : order.category.name,
              },
              { label: 'Производитель', value: order.brand ?? <Empty>не указан</Empty> },
              { label: 'Неисправность', value: order.problem },
              { label: 'Описание', value: order.problemDetails, hidden: !order.problemDetails },
            ]}
          />

          <DetailsPanel
            title="Выезд"
            rows={[
              { label: 'Адрес', value: formatAddress(order) },
              { label: 'Комментарий к адресу', value: order.addressComment ?? <Empty /> },
              { label: 'Дата и интервал', value: `${formatVisitDate(order.visitDate)}, ${order.timeSlot}` },
            ]}
          >
            <RescheduleForm orderId={order.id} visitDate={order.visitDate} timeSlot={order.timeSlot} />
          </DetailsPanel>

          <NotesPanel orderId={order.id} notes={order.notes} />
        </div>

        <div className="col-side">
          <section className="panel">
            <h2>Статус</h2>
            {/* key: после сохранения выбор сбрасывается к новому текущему статусу */}
            <StatusForm key={order.status} orderId={order.id} current={order.status} />
          </section>

          <MasterPanel
            orderId={order.id}
            visitDate={order.visitDate}
            current={order.master}
            candidates={candidates}
            unavailableNames={unavailableNames}
          />

          <HistoryPanel history={order.history} />
        </div>
      </div>
    </>
  );
}
