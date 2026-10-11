/**
 * Начальные данные: категории техники, типовые неисправности и первый администратор.
 * Скрипт идемпотентный — его можно запускать при каждом старте контейнера:
 * существующие записи не перезаписываются.
 */
import { PrismaClient } from '@prisma/client';
import { hashPassword, MIN_PASSWORD_LENGTH } from '../src/server/password';

// Локально переменные берём из .env; в Docker они уже в окружении, а файла нет.
try {
  process.loadEnvFile();
} catch {
  // .env нет — переменные заданы окружением
}

const prisma = new PrismaClient();

const CATEGORIES: { slug: string; name: string; problems: string[] }[] = [
  {
    slug: 'washer',
    name: 'Стиральная машина',
    problems: ['Не включается', 'Не набирает воду', 'Не сливает воду', 'Сильно шумит', 'Протекает', 'Другая проблема'],
  },
  {
    slug: 'fridge',
    name: 'Холодильник',
    problems: [
      'Не включается',
      'Не морозит',
      'Плохо охлаждает',
      'Намерзает лёд',
      'Течёт вода',
      'Сильно шумит',
      'Другая проблема',
    ],
  },
  {
    slug: 'dishwasher',
    name: 'Посудомоечная машина',
    problems: [
      'Не включается',
      'Не набирает воду',
      'Не сливает воду',
      'Плохо моет посуду',
      'Протекает',
      'Другая проблема',
    ],
  },
  {
    slug: 'stove',
    name: 'Электроплита',
    problems: [
      'Не включается',
      'Не греет конфорка',
      'Выбивает автомат',
      'Не работает переключатель',
      'Другая проблема',
    ],
  },
  {
    slug: 'oven',
    name: 'Духовой шкаф',
    problems: [
      'Не включается',
      'Не греет',
      'Печёт неравномерно',
      'Не работает вентилятор',
      'Не закрывается дверца',
      'Другая проблема',
    ],
  },
  {
    slug: 'other',
    name: 'Другая техника',
    problems: ['Не включается', 'Работает с перебоями', 'Шумит или вибрирует', 'Протекает', 'Другая проблема'],
  },
];

async function seedCategories() {
  for (const [index, c] of CATEGORIES.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, name: c.name, sortOrder: (index + 1) * 10 },
    });
    await prisma.problem.createMany({
      data: c.problems.map((name, i) => ({ categoryId: category.id, name, sortOrder: (i + 1) * 10 })),
      skipDuplicates: true,
    });
  }
  console.info(`[seed] Категорий в базе: ${await prisma.category.count()}`);
}

async function seedAdmin() {
  if ((await prisma.admin.count()) > 0) return;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('[seed] Администратора нет. Задайте ADMIN_EMAIL и ADMIN_PASSWORD или выполните npm run admin:create');
    return;
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    console.warn(`[seed] ADMIN_PASSWORD короче ${MIN_PASSWORD_LENGTH} символов — администратор не создан`);
    return;
  }
  await prisma.admin.create({ data: { email, passwordHash: await hashPassword(password) } });
  console.info(`[seed] Создан администратор ${email}`);
}

if ((process.env.SESSION_SECRET ?? '').length < 32) {
  console.warn('[seed] SESSION_SECRET не задан или короче 32 символов — вход в админку работать не будет');
}

seedCategories()
  .then(seedAdmin)
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
