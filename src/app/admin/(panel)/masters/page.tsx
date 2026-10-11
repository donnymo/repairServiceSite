import Link from 'next/link';
import { WEEKDAYS } from '@/lib/constants';
import { formatPhone } from '@/lib/phone';
import { requireAdmin } from '@/server/auth';
import { listMasters, MASTER_FILTERS } from '@/server/data/masters';
import { toggleMaster } from './actions';

export default async function MastersPage({ searchParams }: PageProps<'/admin/masters'>) {
  await requireAdmin();
  const { filter } = await searchParams;
  const active = MASTER_FILTERS.find((f) => f.key === filter) ?? MASTER_FILTERS[0];
  const { masters, counts } = await listMasters(active);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Мастера</h1>
          <p className="muted page-subtitle">Недоступных мастеров нельзя назначить на заявку</p>
        </div>
        <Link href="/admin/masters/new" className="btn btn-primary">
          + Добавить мастера
        </Link>
      </div>

      <nav className="tabs" aria-label="Фильтр по статусу">
        {MASTER_FILTERS.map((f, i) => (
          <Link
            key={f.key}
            href={f.key ? `/admin/masters?filter=${f.key}` : '/admin/masters'}
            className="tab"
            aria-current={active.key === f.key ? 'page' : undefined}
          >
            {f.label} <span className="count">{counts[i]}</span>
          </Link>
        ))}
      </nav>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Телефон</th>
              <th>Специализации</th>
              <th>Рабочие дни</th>
              <th>Статус</th>
              <th>
                <span className="visually-hidden">Действия</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {masters.map((m) => {
              const workDays = WEEKDAYS.filter((d) => m.workDays.includes(d.value));
              return (
                <tr key={m.id}>
                  <td className="strong">{m.name}</td>
                  <td className="nowrap">{formatPhone(m.phone)}</td>
                  <td>
                    <span className="tags">
                      {m.specializations.length === 0 && <span className="muted">не указаны</span>}
                      {m.specializations.map((s) => (
                        <span key={s.id} className="tag">
                          {s.name}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td>
                    <span
                      className="days"
                      aria-label={`Рабочие дни: ${workDays.map((d) => d.short).join(', ') || 'не указаны'}`}
                    >
                      {WEEKDAYS.map((d) => (
                        <span
                          key={d.value}
                          className={m.workDays.includes(d.value) ? 'on' : undefined}
                          aria-hidden="true"
                        >
                          {d.short}
                        </span>
                      ))}
                    </span>
                  </td>
                  <td>
                    <form action={toggleMaster}>
                      <input type="hidden" name="id" value={m.id} />
                      <button
                        type="submit"
                        className="toggle"
                        role="switch"
                        aria-checked={m.isAvailable}
                        aria-label={`${m.name}: ${m.isAvailable ? 'доступен' : 'недоступен'}`}
                      >
                        <span className="track" />
                        {m.isAvailable ? 'Доступен' : 'Недоступен'}
                      </button>
                    </form>
                  </td>
                  <td className="align-right">
                    <Link href={`/admin/masters/${m.id}`} className="btn btn-outline btn-sm">
                      Изменить
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {masters.length === 0 && (
          <div className="empty">
            {active.key ? 'В этом фильтре мастеров нет.' : 'Мастеров пока нет — добавьте первого.'}
          </div>
        )}
      </div>
    </>
  );
}
