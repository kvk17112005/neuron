import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { subject, topic, status, quizScore, weaknessLevel } = await request.json();
    if (!subject || !topic) return NextResponse.json({ error: 'Subject and topic are required' }, { status: 400 });
    const rows = await sql`INSERT INTO topic_progress (user_id, subject, topic, status, quiz_score, weakness_level, completed_at)
      VALUES (${payload.userId}, ${subject}, ${topic}, ${status || 'not-started'}, ${quizScore ?? 0}, ${weaknessLevel || 'none'}, ${status === 'completed' ? new Date().toISOString() : null})
      ON CONFLICT (user_id, subject, topic) DO UPDATE SET status=COALESCE(${status || null},topic_progress.status),
      quiz_score=COALESCE(${quizScore ?? null},topic_progress.quiz_score), weakness_level=COALESCE(${weaknessLevel || null},topic_progress.weakness_level),
      completed_at=CASE WHEN ${status || null}='completed' THEN NOW() ELSE topic_progress.completed_at END RETURNING *`;
    if (status === 'completed') await sql`UPDATE users SET xp = xp + 50 WHERE id = ${payload.userId}`;
    return NextResponse.json({ progress: rows[0] });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}
