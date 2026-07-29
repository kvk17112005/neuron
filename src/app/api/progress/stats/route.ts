import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const allProgress = await sql`SELECT * FROM topic_progress WHERE user_id = ${payload.userId} ORDER BY updated_at DESC`;
    const completed = allProgress.filter((p: any) => p.status === 'completed');
    const inProgress = allProgress.filter((p: any) => p.status === 'in-progress');
    const weak = allProgress.filter((p: any) => ['high', 'medium'].includes(p.weakness_level));
    const strong = allProgress.filter((p: any) => p.quiz_score >= 80);
    const subjectStats: Record<string, any> = {};
    allProgress.forEach((p: any) => { const s = subjectStats[p.subject] ||= { total: 0, completed: 0, avgScore: 0, scores: [] };
      s.total++; if (p.status === 'completed') s.completed++; if (p.quiz_score > 0) s.scores.push(p.quiz_score); });
    Object.values(subjectStats).forEach((s: any) => { s.avgScore = s.scores.length ? Math.round(s.scores.reduce((a: number,b: number)=>a+b,0)/s.scores.length) : 0; });
    return NextResponse.json({ totalTopics: allProgress.length, completedCount: completed.length, inProgressCount: inProgress.length,
      weakTopics: weak.map((p:any)=>({subject:p.subject,topic:p.topic,weakness:p.weakness_level,score:p.quiz_score})),
      strongTopics: strong.map((p:any)=>({subject:p.subject,topic:p.topic,score:p.quiz_score})), subjectStats, allProgress });
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); }
}
