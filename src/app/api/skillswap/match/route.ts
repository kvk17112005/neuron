import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function calculateMatchScore(
  userSkills: string[],
  userWants: string[],
  otherSkills: string[],
  otherWants: string[]
): { score: number; senderTeaches: string[]; receiverTeaches: string[] } {
  const senderTeaches = userSkills.filter((s) =>
    otherWants.some((w) => w.toLowerCase() === s.toLowerCase())
  );
  const receiverTeaches = otherSkills.filter((s) =>
    userWants.some((w) => w.toLowerCase() === s.toLowerCase())
  );

  const totalPossible = Math.max(userWants.length + otherWants.length, 1);
  const matched = senderTeaches.length + receiverTeaches.length;
  const score = Math.round((matched / totalPossible) * 100);

  return { score, senderTeaches, receiverTeaches };
}

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const payload = getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get other users
    const { data: otherUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .neq('id', payload.userId);

    if (usersError) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    const matches = otherUsers
      .map((other) => {
        const { score, senderTeaches, receiverTeaches } = calculateMatchScore(
          currentUser.skills_known,
          currentUser.skills_wanted,
          other.skills_known,
          other.skills_wanted
        );
        return {
          user: {
            _id: other.id,
            name: other.name,
            email: other.email,
            bio: other.bio,
            avatar: other.avatar,
            skillsKnown: other.skills_known,
            skillsWanted: other.skills_wanted,
            skillLevel: other.skill_level,
          },
          matchScore: score,
          senderTeaches,
          receiverTeaches,
        };
      })
      .filter((m) => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('SkillSwap match error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
