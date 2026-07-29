import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){
 try{const payload=getUserFromRequest(request);if(!payload)return NextResponse.json({error:'Unauthorized'},{status:401});
 const sent=await sql`SELECT m.*,to_jsonb(u)-'password' AS receiver FROM matches m JOIN users u ON u.id=m.receiver_id WHERE m.sender_id=${payload.userId} ORDER BY m.created_at DESC`;
 const received=await sql`SELECT m.*,to_jsonb(u)-'password' AS sender FROM matches m JOIN users u ON u.id=m.sender_id WHERE m.receiver_id=${payload.userId} ORDER BY m.created_at DESC`;
 const accepted=await sql`SELECT m.*,to_jsonb(s)-'password' AS sender,to_jsonb(r)-'password' AS receiver FROM matches m JOIN users s ON s.id=m.sender_id JOIN users r ON r.id=m.receiver_id WHERE m.status='accepted' AND (m.sender_id=${payload.userId} OR m.receiver_id=${payload.userId}) ORDER BY m.updated_at DESC`;
 return NextResponse.json({sent,received,accepted});}catch(error){console.error(error);return NextResponse.json({error:'Internal server error'},{status:500});}
}
