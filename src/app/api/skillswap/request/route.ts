import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request); if (!payload) return NextResponse.json({error:'Unauthorized'},{status:401});
    const { receiverId, senderTeaches, receiverTeaches, matchScore } = await request.json();
    if (!receiverId) return NextResponse.json({error:'Receiver ID is required'},{status:400});
    const existing = await sql`SELECT * FROM matches WHERE (sender_id=${payload.userId} AND receiver_id=${receiverId}) OR (sender_id=${receiverId} AND receiver_id=${payload.userId}) LIMIT 1`;
    if (existing.length) return NextResponse.json({error:'Request already exists',match:existing[0]},{status:409});
    const rows = await sql`INSERT INTO matches (sender_id,receiver_id,matched_skills,match_score,status)
      VALUES (${payload.userId},${receiverId},${JSON.stringify({sender_teaches:senderTeaches||[],receiver_teaches:receiverTeaches||[]})},${matchScore||0},'pending') RETURNING *`;
    return NextResponse.json({match:rows[0]},{status:201});
  } catch(error) { console.error(error); return NextResponse.json({error:'Internal server error'},{status:500}); }
}
export async function PATCH(request: NextRequest) {
  try {
    const payload=getUserFromRequest(request); if(!payload)return NextResponse.json({error:'Unauthorized'},{status:401});
    const {matchId,status}=await request.json(); if(!matchId||!['accepted','rejected'].includes(status))return NextResponse.json({error:'Valid matchId and status required'},{status:400});
    const rows=await sql`UPDATE matches SET status=${status} WHERE id=${matchId} AND receiver_id=${payload.userId} RETURNING *`;
    if(!rows.length)return NextResponse.json({error:'Match not found'},{status:404}); return NextResponse.json({match:rows[0]});
  } catch(error){console.error(error);return NextResponse.json({error:'Internal server error'},{status:500});}
}
