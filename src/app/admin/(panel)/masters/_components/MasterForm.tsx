'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { WEEKDAYS } from '@/lib/constants';
import { saveMaster, type MasterFormState } from '../actions';
import type { MasterValues } from '../schema';

type Props = {
  id?: number;
  initial: MasterValues;
  categories: { id: number; name: string }[];
};

export function MasterForm({ id, initial, categories }: Props) {
  const [state, action, pending] = useActionState<MasterFormState, FormData>(saveMaster, null);
  const v = state?.values ?? initial;

  return (
    // key: после ошибки форма пересоздаётся со введёнными значениями, а не с исходными
    <form action={action} className="panel master-form" key={JSON.stringify(v)}>
      {id && <input type="hidden" name="id" value={id} />}
      {state?.error && (
        <div className="alert alert-error" role="alert">
          {state.error}
        </div>
      )}

      <div className="fields-grid">
        <div className="field">
          <label className="label" htmlFor="name">
            Имя
          </label>
          <input id="name" name="name" className="input" required defaultValue={v.name} autoComplete="off" />
        </div>
        <div className="field">
          <label className="label" htmlFor="phone">
            Телефон
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className="input"
            required
            placeholder="+7 (___) ___-__-__"
            defaultValue={v.phone}
            autoComplete="off"
          />
        </div>
      </div>

      <fieldset className="field fieldset">
        <legend className="label">Специализации</legend>
        <div className="check-grid">
          {categories.map((c) => (
            <label key={c.id} className="check-pill">
              <input type="checkbox" name="categoryIds" value={c.id} defaultChecked={v.categoryIds.includes(c.id)} />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field fieldset">
        <legend className="label">Рабочие дни</legend>
        <div className="check-grid">
          {WEEKDAYS.map((d) => (
            <label key={d.value} className="check-pill">
              <input type="checkbox" name="workDays" value={d.value} defaultChecked={v.workDays.includes(d.value)} />
              {d.short}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field fieldset">
        <legend className="label">Статус</legend>
        <div className="check-grid">
          <label className="check-pill">
            <input type="radio" name="isAvailable" value="true" defaultChecked={v.isAvailable} /> Доступен
          </label>
          <label className="check-pill">
            <input type="radio" name="isAvailable" value="false" defaultChecked={!v.isAvailable} /> Недоступен
          </label>
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Сохраняем…' : 'Сохранить'}
        </button>
        <Link href="/admin/masters" className="btn btn-outline">
          Отмена
        </Link>
      </div>
    </form>
  );
}
