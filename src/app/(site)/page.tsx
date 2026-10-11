import Link from 'next/link';
import { HeroIllustration } from '@/components/HeroIllustration';
import { ArrowRightIcon, CategoryIcon, CheckIcon } from '@/components/icons';
import { site } from '@/lib/site';
import { getActiveCategories } from '@/server/data/categories';

export const dynamic = 'force-dynamic';

const STEPS = [
  { title: 'Техника', text: 'Что за техника, производитель и что сломалось' },
  { title: 'Адрес', text: 'Город, улица, дом и квартира' },
  { title: 'Время', text: 'Дата и интервал: 9–12, 12–15, 15–18 или 18–21' },
  { title: 'Контакты', text: 'Имя и телефон — оператор подтвердит выезд' },
];

export default async function HomePage() {
  const categories = await getActiveCategories();

  return (
    <main>
      <section className="container hero">
        <div className="hero-text">
          <span className="pill">Ремонт бытовой техники с выездом на дом</span>
          <h1>Мастер приедет в удобное для вас время</h1>
          <p className="lead">
            Ремонтируем стиральные и посудомоечные машины, холодильники, электроплиты и духовые шкафы. Оставьте заявку
            онлайн — оператор перезвонит и подтвердит выезд.
          </p>
          <div className="hero-cta">
            <Link href="/order" className="btn btn-primary btn-lg">
              Вызвать мастера <ArrowRightIcon />
            </Link>
            <a href={site.phoneHref} className="call-link">
              <span>или позвоните</span>
              <strong>{site.phone}</strong>
            </a>
          </div>
          <div className="ticks">
            <span>
              <CheckIcon size={16} />
              Выезд с 9:00 до 21:00
            </span>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="container section-categories" aria-labelledby="categories-title">
        <div className="section-head">
          <h2 id="categories-title">Какую технику ремонтируем</h2>
          <p className="muted">Выберите технику — и сразу перейдёте к заявке</p>
        </div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.slug} href={`/order?category=${c.slug}`} className="cat-card">
              <CategoryIcon slug={c.slug} />
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-band">
        <div className="container section section-compact">
          <h2>Заявка в четыре шага</h2>
          <ol className="steps">
            {STEPS.map(({ title, text }, i) => (
              <li key={title}>
                <span className="step-num">{i + 1}</span>
                <span>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
