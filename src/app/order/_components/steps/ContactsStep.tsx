import { maskPhone } from '@/lib/phone';
import type { StepProps } from './types';

export function ContactsStep({ form, update, field }: StepProps) {
  function onPhoneChange(value: string) {
    let digits = value.replace(/\D/g, '');
    // Стирание скобки или дефиса не меняет цифры — тогда убираем последнюю цифру.
    if (value.length < form.phone.length && digits === form.phone.replace(/\D/g, '')) digits = digits.slice(0, -1);
    update({ phone: maskPhone(digits) });
  }

  return (
    <>
      <div className="field">
        <label className="label" htmlFor="clientName">
          Имя
        </label>
        <input
          id="clientName"
          className="input"
          type="text"
          autoComplete="given-name"
          enterKeyHint="next"
          placeholder="Как к вам обращаться"
          {...field('clientName')}
        />
      </div>
      <div className="field">
        <label className="label" htmlFor="phone">
          Телефон
        </label>
        <input
          id="phone"
          name="phone"
          className="input"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="next"
          placeholder="+7 (___) ___-__-__"
          value={form.phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          aria-describedby="phone-hint"
        />
        <span id="phone-hint" className="field-hint">
          Позвоним, чтобы подтвердить выезд
        </span>
      </div>
      <div className="field">
        <label className="label" htmlFor="comment">
          Комментарий <span className="opt">— необязательно</span>
        </label>
        <textarea
          id="comment"
          className="textarea"
          rows={2}
          placeholder="Например: звоните после 18:00"
          {...field('comment')}
        />
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Сайт</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...field('website')} />
      </div>
    </>
  );
}
