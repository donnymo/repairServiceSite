'use client';

import type { OrderStatus } from '@prisma/client';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ORDER_STATUSES, STATUS_LABELS } from '@/lib/constants';
import { changeStatus } from '../actions';

/**
 * Выбор статуса не сохраняется сразу: оператор отмечает статус, затем жмёт «Подтвердить».
 * Только после подтверждения статус меняется и попадает в историю.
 */
export function StatusForm({ orderId, current }: { orderId: number; current: OrderStatus }) {
  const [selected, setSelected] = useState<OrderStatus>(current);
  const changed = selected !== current;

  return (
    <form action={changeStatus} className="stack">
      <input type="hidden" name="orderId" value={orderId} />
      <fieldset className="status-buttons">
        <legend className="visually-hidden">Новый статус</legend>
        {ORDER_STATUSES.map((s) => (
          <label key={s} data-status={s}>
            <input
              type="radio"
              name="status"
              value={s}
              checked={selected === s}
              onChange={() => setSelected(s)}
              className="visually-hidden"
            />
            {STATUS_LABELS[s]}
            {s === current && <span className="current-mark">текущий</span>}
          </label>
        ))}
      </fieldset>
      <div className="form-actions">
        <SubmitButton disabled={!changed} />
        {changed && (
          <button type="button" className="btn-link" onClick={() => setSelected(current)}>
            Отмена
          </button>
        )}
      </div>
      <p className="muted text-sm">
        {changed
          ? `Статус сменится на «${STATUS_LABELS[selected]}» после подтверждения.`
          : 'Выберите новый статус и подтвердите — изменение попадёт в историю с датой и временем.'}
      </p>
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-dark" disabled={disabled || pending}>
      {pending ? 'Сохраняем…' : 'Подтвердить статус'}
    </button>
  );
}
