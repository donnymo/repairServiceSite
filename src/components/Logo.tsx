import type { CSSProperties, ReactNode } from 'react';

/** Логотип: знак «дом + ключ» и надпись. Название «МастерДом» — рабочее, замените на настоящее. */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#C2410C" />
      <path
        d="M10 19.5 20 11l10 8.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 17.5V29h14V17.5" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M23.2 19.6a3 3 0 0 0-3.9 3.9l-3.4 3.4 1.3 1.3 3.4-3.4a3 3 0 0 0 3.9-3.9l-1.6 1.6-1.3-1.3z" fill="#fff" />
    </svg>
  );
}

type LogoProps = {
  size?: number;
  /** Для тёмного фона (боковая панель админки). */
  dark?: boolean;
  /** Подпись после названия, выровненная с ним по базовой линии текста (например, «© 2026»). */
  caption?: ReactNode;
};

export function Logo({ size = 40, dark = false, caption }: LogoProps) {
  return (
    <span className={dark ? 'logo logo-dark' : 'logo'} style={{ '--logo-size': `${size}px` } as CSSProperties}>
      <LogoMark size={size} />
      <span className="logo-label">
        <span className="logo-text">
          Мастер<span className="logo-accent">Дом</span>
        </span>
        {caption && <span className="logo-caption">{caption}</span>}
      </span>
    </span>
  );
}
