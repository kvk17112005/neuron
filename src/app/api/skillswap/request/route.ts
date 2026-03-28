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

    const { receiverId, senderTeaches, receiverTeaches, matchScore } = await request.json();
    if (!receiverId) {
      return NextResponse.json({ error: 'Receiver ID is required' }, { status: 400 });
    }

    // Check for existing match
    const { data: existing } = await supabaseAdmin
      .from('matches')
      .select('*')
      .or(`sender_id.eq.${payload.userId},receiver_id.eq.${payload.userId}`)
      .or(`sender_id.eq.${receiverId},receiver_id.eq.${receiverId}`);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Request already exists', match: existing[0] }, { status: 409 });
    }

    const { data: match, error } = await supabaseAdmin
      .from('matches')
      .insert({
        sender_id: payload.userId,
        receiver_id: receiverId,
        matched_skills: {
          sender_teaches: senderTeaches || [],
          receiver_teaches: receiverTeaches || []
        },
        match_score: matchScore || 0,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create match request' }, { status: 500 });
    }

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error('SkillSwap request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { matchId, status } = await request.json();
    if (!matchId || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Valid matchId and status required' }, { status: 400 });
    }

    const { data: match, error } = await supabaseAdmin
      .from('matches')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', matchId)
      .eq('receiver_id', payload.userId)
      .select()
      .single();

    if (error || !match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error('SkillSwap update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
