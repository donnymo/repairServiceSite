/**
 * Создать администратора или сменить пароль существующему:
 *   npm run admin:create -- admin@example.ru 'надёжный-пароль'
 */
import { PrismaClient } from '@prisma/client';
import { hashPassword, MIN_PASSWORD_LENGTH } from '../src/server/password';

try {
  process.loadEnvFile();
} catch {
  // .env нет — переменные заданы окружением
}

const [, , rawEmail, password] = process.argv;
const email = rawEmail?.trim().toLowerCase();

if (!email || !password) {
  console.error('Использование: npm run admin:create -- <email> <пароль>');
  process.exit(1);
}
if (password.length < MIN_PASSWORD_LENGTH) {
  console.error(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
  process.exit(1);
}

const prisma = new PrismaClient();

async function main(email: string, password: string) {
  const passwordHash = await hashPassword(password);
  await prisma.admin.upsert({ where: { email }, update: { passwordHash }, create: { email, passwordHash } });
  console.info(`Администратор ${email} сохранён`);
}

main(email, password)
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
