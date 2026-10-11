import Link from 'next/link';
import { ChevronLeftIcon, PhoneIcon } from '@/components/icons';
import { site } from '@/lib/site';

/** Верхняя панель формы. Без `onBack` кнопка «назад» ведёт на главную. */
export function OrderTopBar({ onBack }: { onBack?: () => void }) {
  return (
    <div className="order-top">
      {onBack ? (
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Назад">
          <ChevronLeftIcon />
        </button>
      ) : (
        <Link href="/" className="icon-btn" aria-label="На главную">
          <ChevronLeftIcon />
        </Link>
      )}
      <span className="title">Вызов мастера</span>
      <a href={site.phoneHref} className="icon-btn accent" aria-label="Позвонить в сервис">
        <PhoneIcon size={22} />
      </a>
    </div>
  );
}
