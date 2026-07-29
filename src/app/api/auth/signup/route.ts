import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, bio, skillsKnown, skillsWanted, skillLevel } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await sql`SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1`;
    if (existing.length) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const hashedPassword = await hashPassword(password);
    const rows = await sql`
      INSERT INTO users (name, email, password, bio, skills_known, skills_wanted, skill_level)
      VALUES (${name}, ${normalizedEmail}, ${hashedPassword}, ${bio || ''}, ${skillsKnown || []}, ${skillsWanted || []}, ${skillLevel || 'beginner'})
      RETURNING *`;
    const user = rows[0];
    const token = signToken({ userId: user.id, email: user.email });
    const response = NextResponse.json({ token, user: publicUser(user) }, { status: 201 });
    response.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function publicUser(user: any) {
  return { _id: user.id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar,
    skillsKnown: user.skills_known, skillsWanted: user.skills_wanted, skillLevel: user.skill_level,
    streak: user.streak, xp: user.xp, badges: user.badges, savedTopics: user.saved_topics };
}
