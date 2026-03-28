import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all progress for user
    const { data: allProgress, error } = await supabaseAdmin
      .from('topic_progress')
      .select('*')
      .eq('user_id', payload.userId);

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
    }

    const completed = allProgress.filter((p) => p.status === 'completed');
    const inProgress = allProgress.filter((p) => p.status === 'in-progress');
    const weak = allProgress.filter((p) => p.weakness_level === 'high' || p.weakness_level === 'medium');
    const strong = allProgress.filter((p) => p.quiz_score >= 80);

    // Calculate subject stats
    const subjectStats: Record<string, { total: number; completed: number; avgScore: number; scores: number[] }> = {};

    allProgress.forEach((p) => {
      if (!subjectStats[p.subject]) {
        subjectStats[p.subject] = { total: 0, completed: 0, avgScore: 0, scores: [] };
      }
      subjectStats[p.subject].total += 1;
      if (p.status === 'completed') subjectStats[p.subject].completed += 1;
      if (p.quiz_score > 0) subjectStats[p.subject].scores.push(p.quiz_score);
    });

    // Calculate averages
    for (const key of Object.keys(subjectStats)) {
      const stat = subjectStats[key];
      stat.avgScore = stat.scores.length > 0 ? Math.round(stat.scores.reduce((a: number, b: number) => a + b, 0) / stat.scores.length) : 0;
    }

    return NextResponse.json({
      totalTopics: allProgress.length,
      completedCount: completed.length,
      inProgressCount: inProgress.length,
      weakTopics: weak.map((p) => ({ subject: p.subject, topic: p.topic, weakness: p.weakness_level, score: p.quiz_score })),
      strongTopics: strong.map((p) => ({ subject: p.subject, topic: p.topic, score: p.quiz_score })),
      subjectStats,
      allProgress,
    });
  } catch (error) {
    console.error('Progress stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
