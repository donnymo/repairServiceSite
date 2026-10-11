import { InfoIcon } from '@/components/icons';
import { findTimeSlot, isSlotPast, TIME_SLOTS } from '@/lib/constants';
import type { BookingDay, Today } from '@/lib/dates';
import type { StepProps } from './types';

type Props = StepProps & { days: BookingDay[]; today: Today };

export function TimeStep({ form, update, days, today }: Props) {
  const isDayOpen = (iso: string) => TIME_SLOTS.some((s) => !isSlotPast(s, iso, today));

  function selectDay(iso: string) {
    // Выбранный интервал сбрасываем, если в новый день он уже прошёл.
    const slot = findTimeSlot(form.timeSlot);
    update({ visitDate: iso, timeSlot: slot && isSlotPast(slot, iso, today) ? '' : form.timeSlot });
  }

  return (
    <>
      <div className="field">
        <span className="label" id="date-label">
          Дата
        </span>
        <div className="day-grid" role="group" aria-labelledby="date-label">
          {days.map((d) => (
            <button
              key={d.iso}
              type="button"
              className="day-btn"
              aria-pressed={form.visitDate === d.iso}
              aria-label={d.full}
              disabled={!isDayOpen(d.iso)}
              onClick={() => selectDay(d.iso)}
            >
              <small>{d.top}</small>
              <strong>{d.num}</strong>
              <small>{d.month}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="field">
        <span className="label" id="slot-label">
          Интервал
        </span>
        <div className="slot-grid" role="group" aria-labelledby="slot-label">
          {TIME_SLOTS.map((s) => {
            const open = !form.visitDate || !isSlotPast(s, form.visitDate, today);
            return (
              <button
                key={s.value}
                type="button"
                className="slot-btn"
                aria-pressed={form.timeSlot === s.value}
                disabled={!open}
                onClick={() => update({ timeSlot: s.value })}
              >
                <strong>{s.value}</strong>
                <small>{open ? s.label : 'Время прошло'}</small>
              </button>
            );
          })}
        </div>
      </div>
      <div className="alert alert-info">
        <InfoIcon />
        <span>Мастер приедет в выбранный интервал. Оператор позвонит заранее и подтвердит время.</span>
      </div>
    </>
  );
}
