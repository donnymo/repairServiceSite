import { site } from '@/lib/site';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <Logo size={32} caption={`© ${new Date().getFullYear()}`} />
        <a href={site.phoneHref} className="phone">
          {site.phone}
        </a>
      </div>
    </footer>
  );
}
