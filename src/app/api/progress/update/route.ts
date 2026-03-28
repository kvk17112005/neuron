import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, topic, status, quizScore, weaknessLevel } = await request.json();
    if (!subject || !topic) {
      return NextResponse.json({ error: 'Subject and topic are required' }, { status: 400 });
    }

    // Upsert progress
    const updateData: any = {
      user_id: payload.userId,
      subject,
      topic,
    };

    if (status) updateData.status = status;
    if (quizScore !== undefined) updateData.quiz_score = quizScore;
    if (weaknessLevel) updateData.weakness_level = weaknessLevel;
    if (status === 'completed') updateData.completed_at = new Date().toISOString();

    const { data: progress, error } = await supabaseAdmin
      .from('topic_progress')
      .upsert(updateData, {
        onConflict: 'user_id,subject,topic'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
    }

    // Update XP if completed
    if (status === 'completed') {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('xp')
        .eq('id', payload.userId)
        .single();

      if (user) {
        await supabaseAdmin
          .from('users')
          .update({ xp: (user.xp || 0) + 50 })
          .eq('id', payload.userId);
      }
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
