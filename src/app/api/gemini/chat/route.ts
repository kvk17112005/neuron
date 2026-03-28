import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import { askMentor, ExplanationStyle } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { question, subject, topic, style } = await request.json();
    if (!question || !subject || !topic) {
      return NextResponse.json({ error: 'Question, subject, and topic are required' }, { status: 400 });
    }

    const response = await askMentor(question, subject, topic, (style || 'simple') as ExplanationStyle);

    // Save chat history to Supabase (optional)
    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('chat_history')
        .insert({
          user_id: payload.userId,
          subject,
          topic,
          user_message: question,
          ai_response: response,
          style: style || 'simple',
        });

      if (error) {
        console.error('Failed to save chat history:', error);
        // Don't fail the request if saving history fails
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Gemini chat error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
