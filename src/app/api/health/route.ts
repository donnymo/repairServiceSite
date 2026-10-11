import { prisma } from '@/server/db';

export const dynamic = 'force-dynamic';

/** Проверка для мониторинга и после деплоя: сайт отвечает и база доступна. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: 'database unavailable' }, { status: 503 });
  }
}
