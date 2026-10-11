import Link from 'next/link';
import type { OrderStatus } from '@prisma/client';
import { StatusBadge } from '@/components/StatusBadge';
import { CLOSED_STATUSES, isOrderStatus, ORDER_STATUSES, STATUS_LABELS } from '@/lib/constants';
import { formatDateTime, formatVisitDateShort } from '@/lib/dates';
import { formatAddress } from '@/lib/format';
import { formatPhone } from '@/lib/phone';
import { requireAdmin } from '@/server/auth';
import { listOrders } from '@/server/data/orders';

type Filters = { status?: OrderStatus; q?: string; page?: number };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Ссылка на список с текущими фильтрами, переопределёнными `patch`. */
function ordersHref(current: Filters, patch: Filters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...current, ...patch })) {
    if (value) params.set(key, String(value));
  }
  const query = params.toString();
  return `/admin/orders${query ? `?${query}` : ''}`;
}

export default async function OrdersPage({ searchParams }: PageProps<'/admin/orders'>) {
  await requireAdmin();
  const sp = await searchParams;
  const q = (first(sp.q) ?? '').trim().slice(0, 50);
  const rawStatus = first(sp.status);
  const status = isOrderStatus(rawStatus) ? rawStatus : undefined;
  const page = Math.max(1, Math.floor(Number(first(sp.page))) || 1);

  const { orders, total, counts, allCount, pages } = await listOrders({ q, status, page });
  const current: Filters = { status, q: q || undefined };
  const href = (patch: Filters) => ordersHref(current, patch);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Заявки</h1>
          <p className="muted page-subtitle">Все заявки с сайта, новые сверху</p>
        </div>
        <form className="search" action="/admin/orders" role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <label htmlFor="q" className="visually-hidden">
            Поиск по номеру заявки или телефону
          </label>
          <input
            id="q"
            name="q"
            type="search"
            className="input"
            placeholder="Номер заявки или телефон"
            defaultValue={q}
          />
          <button type="submit" className="btn btn-dark">
            Найти
          </button>
        </form>
      </div>

      <nav className="tabs" aria-label="Фильтр по статусу">
        <Link href={href({ status: undefined })} className="tab" aria-current={!status ? 'page' : undefined}>
          Все <span className="count">{allCount}</span>
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={href({ status: s })} className="tab" aria-current={status === s ? 'page' : undefined}>
            {STATUS_LABELS[s]} <span className="count">{counts[s] ?? 0}</span>
          </Link>
        ))}
      </nav>

      {q && (
        <p className="muted">
          Результаты поиска «{q}» · <Link href={href({ q: undefined })}>сбросить</Link>
        </p>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Создана</th>
              <th>Клиент</th>
              <th>Телефон</th>
              <th>Техника</th>
              <th>Адрес</th>
              <th>Время выезда</th>
              <th>Статус</th>
              <th>Мастер</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const [date, time] = formatDateTime(o.createdAt).split(', ');
              return (
                <tr key={o.id} className={o.status === 'NEW' ? 'is-new' : undefined}>
                  <td className="num">
                    <Link href={`/admin/orders/${o.id}`}>{o.id}</Link>
                  </td>
                  <td className="nowrap">
                    {date}
                    <span className="sub">{time}</span>
                  </td>
                  <td>
                    <Link href={`/admin/orders/${o.id}`} className="row-title">
                      {o.clientName}
                    </Link>
                  </td>
                  <td className="nowrap">{formatPhone(o.phone)}</td>
                  <td>{o.deviceType ?? o.category.name}</td>
                  <td>{formatAddress({ street: o.street, house: o.house, flat: o.flat })}</td>
                  <td className="nowrap">
                    {formatVisitDateShort(o.visitDate)}
                    <span className="sub">{o.timeSlot}</span>
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td>
                    {o.master?.name ??
                      (CLOSED_STATUSES.includes(o.status) ? '—' : <span className="unassigned">Не назначен</span>)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="empty">
            {q || status
              ? 'Ничего не найдено. Проверьте номер или телефон, либо выберите другой статус.'
              : 'Заявок пока нет.'}
          </div>
        )}
      </div>

      <div className="pager">
        <span>Найдено: {total}</span>
        {pages > 1 && (
          <div>
            {page > 1 && (
              <Link className="btn btn-outline" href={href({ page: page - 1 })}>
                ← Назад
              </Link>
            )}
            <span className="pager-current">
              Стр. {page} из {pages}
            </span>
            {page < pages && (
              <Link className="btn btn-outline" href={href({ page: page + 1 })}>
                Вперёд →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
