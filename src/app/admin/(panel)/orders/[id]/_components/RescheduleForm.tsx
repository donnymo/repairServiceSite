import { TIME_SLOTS } from '@/lib/constants';
import { dateToIso } from '@/lib/dates';
import { reschedule } from '../actions';

export function RescheduleForm({
  orderId,
  visitDate,
  timeSlot,
}: {
  orderId: number;
  visitDate: Date;
  timeSlot: string;
}) {
  return (
    <form action={reschedule} className="subform">
      <input type="hidden" name="orderId" value={orderId} />
      <div className="field">
        <label className="label" htmlFor="visitDate">
          Новая дата
        </label>
        <input
          id="visitDate"
          name="visitDate"
          type="date"
          className="input"
          defaultValue={dateToIso(visitDate)}
          required
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="timeSlot">
          Интервал
        </label>
        <select id="timeSlot" name="timeSlot" className="select" defaultValue={timeSlot}>
          {TIME_SLOTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.value}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-dark">
        Перенести
      </button>
    </form>
  );
}
