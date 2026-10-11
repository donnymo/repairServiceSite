import type { Master } from '@prisma/client';
import Link from 'next/link';
import { formatDayMonth, weekdayShort } from '@/lib/dates';
import { formatPhone } from '@/lib/phone';
import type { MasterCandidate } from '@/server/data/masters';
import { assignMaster } from '../actions';

type Props = {
  orderId: number;
  visitDate: Date;
  current: Master | null;
  candidates: MasterCandidate[];
  unavailableNames: string[];
};

export function MasterPanel({ orderId, visitDate, current, candidates, unavailableNames }: Props) {
  const wd = weekdayShort(visitDate);

  return (
    <section className="panel">
      <h2>Мастер</h2>
      {current ? (
        <div className="master-current">
          <strong>{current.name}</strong>
          <span className="text-sm">{formatPhone(current.phone)}</span>
        </div>
      ) : (
        <div className="master-none">Мастер не назначен</div>
      )}

      <form action={assignMaster} className="stack">
        <input type="hidden" name="orderId" value={orderId} />
        <fieldset className="master-list">
          <legend className="label text-sm">
            Доступные мастера на {wd}, {formatDayMonth(visitDate)}
          </legend>
          {candidates.length === 0 && (
            <p className="muted">
              Нет доступных мастеров. <Link href="/admin/masters">Перейти к мастерам</Link>
            </p>
          )}
          {candidates.map((m) => {
            const assigned = current?.id === m.id;
            return (
              <label key={m.id} className="master-option">
                <input type="radio" name="masterId" value={m.id} defaultChecked={assigned} required />
                <span>
                  <strong>
                    {m.name}
                    {assigned && ' · назначен'}
                  </strong>
                  <span className="muted text-sm">{formatPhone(m.phone)}</span>
                  <span className="tags">
                    <span className={m.match ? 'tag tag-ok' : 'tag'}>
                      {m.match ? 'Профиль подходит' : 'Другой профиль'}
                    </span>
                    <span className={m.works ? 'tag tag-ok' : 'tag tag-warn'}>
                      {m.works ? `Работает в ${wd}` : `Выходной в ${wd}`}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>
        {unavailableNames.length > 0 && (
          <span className="muted text-sm">Недоступны: {unavailableNames.join(', ')}</span>
        )}
        {candidates.length > 0 && (
          <button type="submit" className="btn btn-primary">
            {current ? 'Заменить мастера' : 'Назначить мастера'}
          </button>
        )}
      </form>

      {current && (
        <form action={assignMaster}>
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="masterId" value="" />
          <button type="submit" className="btn-link btn-link-flush">
            Снять мастера с заявки
          </button>
        </form>
      )}
    </section>
  );
}
