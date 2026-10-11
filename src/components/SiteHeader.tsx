import Link from 'next/link';
import { site } from '@/lib/site';
import { PhoneIcon } from './icons';
import { Logo } from './Logo';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" aria-label="На главную" className="logo-link">
          <Logo />
        </Link>
        <a href={site.phoneHref} className="header-phone" aria-label={`Позвонить: ${site.phone}`}>
          <span className="round-icon">
            <PhoneIcon />
          </span>
          <span>
            <strong>{site.phone}</strong>
            <small>{site.workHours}</small>
          </span>
        </a>
      </div>
    </header>
  );
}
