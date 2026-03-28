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

    // Get sent requests
    const { data: sent, error: sentError } = await supabaseAdmin
      .from('matches')
      .select(`
        *,
        receiver:users!matches_receiver_id_fkey (
          id, name, email, bio, avatar, skills_known, skills_wanted, skill_level
        )
      `)
      .eq('sender_id', payload.userId)
      .order('created_at', { ascending: false });

    if (sentError) {
      console.error('Sent requests error:', sentError);
    }

    // Get received requests
    const { data: received, error: receivedError } = await supabaseAdmin
      .from('matches')
      .select(`
        *,
        sender:users!matches_sender_id_fkey (
          id, name, email, bio, avatar, skills_known, skills_wanted, skill_level
        )
      `)
      .eq('receiver_id', payload.userId)
      .order('created_at', { ascending: false });

    if (receivedError) {
      console.error('Received requests error:', receivedError);
    }

    // Get accepted matches
    const { data: accepted, error: acceptedError } = await supabaseAdmin
      .from('matches')
      .select(`
        *,
        sender:users!matches_sender_id_fkey (
          id, name, email, bio, avatar, skills_known, skills_wanted, skill_level
        ),
        receiver:users!matches_receiver_id_fkey (
          id, name, email, bio, avatar, skills_known, skills_wanted, skill_level
        )
      `)
      .eq('status', 'accepted')
      .or(`sender_id.eq.${payload.userId},receiver_id.eq.${payload.userId}`)
      .order('updated_at', { ascending: false });

    if (acceptedError) {
      console.error('Accepted matches error:', acceptedError);
    }

    return NextResponse.json({
      sent: sent || [],
      received: received || [],
      accepted: accepted || []
    });
  } catch (error) {
    console.error('SkillSwap requests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
