import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const payload = getUserFromRequest(request);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const rows = await sql`SELECT * FROM users WHERE id = ${payload.userId} LIMIT 1`;
    const user = rows[0];
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: { _id: user.id, name: user.name, email: user.email, bio: user.bio,
      avatar: user.avatar, skillsKnown: user.skills_known, skillsWanted: user.skills_wanted, skillLevel: user.skill_level,
      streak: user.streak, xp: user.xp, badges: user.badges, savedTopics: user.saved_topics } });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
