import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    const rows = await sql`SELECT * FROM users WHERE email = ${String(email).trim().toLowerCase()} LIMIT 1`;
    const user = rows[0];
    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - new Date(user.last_active).getTime()) / 86400000);
    const streak = diffDays === 1 ? user.streak + 1 : diffDays > 1 ? 1 : user.streak;
    await sql`UPDATE users SET streak = ${streak}, last_active = ${now.toISOString()} WHERE id = ${user.id}`;
    const token = signToken({ userId: user.id, email: user.email });
    const response = NextResponse.json({ token, user: { _id: user.id, name: user.name, email: user.email, bio: user.bio,
      avatar: user.avatar, skillsKnown: user.skills_known, skillsWanted: user.skills_wanted, skillLevel: user.skill_level,
      streak, xp: user.xp, badges: user.badges, savedTopics: user.saved_topics } });
    response.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
