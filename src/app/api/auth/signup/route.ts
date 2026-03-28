import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { name, email, password, bio, skillsKnown, skillsWanted, skillLevel } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        name,
        bio: bio || '',
        skills_known: skillsKnown || [],
        skills_wanted: skillsWanted || [],
        skill_level: skillLevel || 'beginner'
      }
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user profile in database
    const { data: userData, error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        bio: bio || '',
        skills_known: skillsKnown || [],
        skills_wanted: skillsWanted || [],
        skill_level: skillLevel || 'beginner',
      })
      .select()
      .single();

    if (dbError) {
      // Clean up auth user if db insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    const token = signToken({ userId: userData.id, email: userData.email });

    return NextResponse.json({
      token,
      user: {
        _id: userData.id,
        name: userData.name,
        email: userData.email,
        bio: userData.bio,
        avatar: userData.avatar,
        skillsKnown: userData.skills_known,
        skillsWanted: userData.skills_wanted,
        skillLevel: userData.skill_level,
        streak: userData.streak,
        xp: userData.xp,
        badges: userData.badges,
        savedTopics: userData.saved_topics,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
