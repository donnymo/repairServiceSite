import Link from 'next/link';
import type { Ref } from 'react';
import { CheckIcon } from '@/components/icons';
import { OrderTopBar } from './OrderTopBar';

type Props = {
  number: number;
  visitLabel: string;
  phone: string;
  address: string;
  tech: string;
  headingRef: Ref<HTMLHeadingElement>;
};

export function OrderSuccess({ number, visitLabel, phone, address, tech, headingRef }: Props) {
  return (
    <div className="order-shell">
      <OrderTopBar />
      <div className="order-body">
        <div className="done-head">
          <span className="done-icon">
            <CheckIcon size={40} />
          </span>
          <h1 ref={headingRef} tabIndex={-1}>
            Заявка отправлена
          </h1>
          <p className="text-secondary">Оператор позвонит на {phone}, чтобы подтвердить выезд.</p>
        </div>
        <div className="done-card">
          <div>
            <small>Номер заявки</small>
            <span className="done-number">№ {number}</span>
          </div>
          <div>
            <small>Мастер приедет</small>
            <strong>{visitLabel}</strong>
          </div>
          <div>
            <small>Адрес</small>
            <span>{address}</span>
          </div>
          <div>
            <small>Техника</small>
            <span>{tech}</span>
          </div>
        </div>
        <p className="muted done-note">Сохраните номер — назовите его, если будете звонить нам.</p>
      </div>
      <div className="order-actions">
        <Link href="/" className="btn btn-outline btn-block">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
