import type { ReactNode } from 'react';

type IconProps = { size?: number; viewBox?: string; children: ReactNode; strokeWidth?: number };

function Svg({ size = 24, viewBox = '0 0 24 24', strokeWidth = 2, children }: IconProps) {
  return (
    <svg className="icon" width={size} height={size} viewBox={viewBox} strokeWidth={strokeWidth} aria-hidden="true">
      {children}
    </svg>
  );
}

export const PhoneIcon = ({ size = 20 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Svg>
);

export const CheckIcon = ({ size = 18 }: { size?: number }) => (
  <Svg size={size} strokeWidth={2.5}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const ArrowRightIcon = ({ size = 20 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const ChevronLeftIcon = ({ size = 24 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
);

export const InfoIcon = ({ size = 20 }: { size?: number }) => (
  <Svg size={size}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5v.5" />
  </Svg>
);

export const ClockIcon = () => (
  <Svg size={22}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const MobileIcon = () => (
  <Svg size={22}>
    <rect x="7" y="2.5" width="10" height="19" rx="2" />
    <path d="M11 18h2" />
  </Svg>
);

export const WrenchIcon = () => (
  <Svg size={22}>
    <path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5L15 12l-3-3z" />
  </Svg>
);

export const ShieldIcon = () => (
  <Svg size={22}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </Svg>
);

export const ListIcon = () => (
  <Svg size={20}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 3h6v3H9zM9 11h6M9 15h4" />
  </Svg>
);

export const UsersIcon = () => (
  <Svg size={20}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
  </Svg>
);

export const LogoutIcon = () => (
  <Svg size={20}>
    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h10" />
  </Svg>
);

/** Простые контурные модели техники для категорий. Неизвестный slug — вилка. */
export function CategoryIcon({ slug, size = 48 }: { slug: string; size?: number }) {
  const shapes: Record<string, ReactNode> = {
    washer: (
      <>
        <rect x="8" y="5" width="32" height="38" rx="4" />
        <path d="M8 13h32" />
        <circle cx="13.5" cy="9" r="1.2" />
        <circle cx="18" cy="9" r="1.2" />
        <circle cx="24" cy="28" r="9.5" />
        <path d="M18.5 29.5c1.8 1.6 3.7 1.6 5.5 0s3.7-1.6 5.5 0" />
      </>
    ),
    fridge: (
      <>
        <rect x="12" y="4" width="24" height="40" rx="3" />
        <path d="M12 18h24M17 9v5M17 23v8" />
      </>
    ),
    dishwasher: (
      <>
        <rect x="8" y="5" width="32" height="38" rx="4" />
        <path d="M8 14h32M18 9.5h12M13 37h22" />
        <path d="M15 37v-6a4 4 0 0 1 8 0v6M25 37v-8a4 4 0 0 1 8 0v8" />
      </>
    ),
    stove: (
      <>
        <rect x="6" y="8" width="36" height="32" rx="4" />
        <circle cx="17" cy="19" r="5" />
        <circle cx="31" cy="19" r="5" />
        <circle cx="17" cy="31" r="4" />
        <circle cx="31" cy="31" r="4" />
      </>
    ),
    oven: (
      <>
        <rect x="7" y="6" width="34" height="36" rx="4" />
        <path d="M7 15h34M30 10.5h5" />
        <circle cx="13" cy="10.5" r="1.5" />
        <circle cx="19" cy="10.5" r="1.5" />
        <rect x="13" y="21" width="22" height="15" rx="2" />
      </>
    ),
  };
  return (
    <Svg size={size} viewBox="0 0 48 48">
      {shapes[slug] ?? <path d="M18 5v9M30 5v9M13 14h22v7a11 11 0 0 1-22 0zM24 32v11" />}
    </Svg>
  );
}
