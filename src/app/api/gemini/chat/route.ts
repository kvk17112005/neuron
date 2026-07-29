import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
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

    try {
      await sql`INSERT INTO chat_history (user_id,subject,topic,user_message,ai_response,style)
        VALUES (${payload.userId},${subject},${topic},${question},${response},${style || 'simple'})`;
    } catch (error) { console.error('Failed to save chat history:', error); }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Gemini chat error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
