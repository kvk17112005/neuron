import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

const sampleUsers = [
  {
    name: 'Alex Chen',
    email: 'alex@neuroverse.dev',
    password: 'password123',
    bio: 'Full-stack developer passionate about AI and machine learning. Love building intelligent systems.',
    skills_known: ['Python', 'JavaScript', 'React', 'Machine Learning', 'TensorFlow'],
    skills_wanted: ['Rust', 'Kubernetes', 'Blockchain', 'Go'],
    skill_level: 'advanced',
    xp: 1250,
    streak: 7,
    badges: ['Early Adopter', 'AI Explorer', 'Code Master'],
  },
  {
    name: 'Priya Sharma',
    email: 'priya@neuroverse.dev',
    password: 'password123',
    bio: 'Data scientist with a love for statistics and visualization. Currently exploring deep learning.',
    skills_known: ['Python', 'Data Science', 'Statistics', 'SQL', 'Linear Algebra'],
    skills_wanted: ['Deep Learning', 'PyTorch', 'Computer Vision', 'React'],
    skill_level: 'intermediate',
    xp: 890,
    streak: 3,
    badges: ['Data Wizard', 'Math Pro'],
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus@neuroverse.dev',
    password: 'password123',
    bio: 'DevOps engineer who loves automating everything. Interested in ML ops and cloud architecture.',
    skills_known: ['Docker', 'Kubernetes', 'AWS', 'Linux', 'Go', 'Git'],
    skills_wanted: ['Machine Learning', 'Python', 'Data Science', 'TensorFlow'],
    skill_level: 'advanced',
    xp: 1100,
    streak: 12,
    badges: ['Cloud Master', 'Streak Champion'],
  },
  {
    name: 'Yuki Tanaka',
    email: 'yuki@neuroverse.dev',
    password: 'password123',
    bio: 'Computer science student passionate about algorithms and competitive programming.',
    skills_known: ['C++', 'Java', 'Data Science', 'Problem Solving'],
    skills_wanted: ['Web Development', 'React', 'Next.js', 'TypeScript'],
    skill_level: 'intermediate',
    xp: 670,
    streak: 5,
    badges: ['Algorithm Ace'],
  },
  {
    name: 'Sarah Williams',
    email: 'sarah@neuroverse.dev',
    password: 'password123',
    bio: 'UI/UX designer transitioning into front-end development. Love creating beautiful interfaces.',
    skills_known: ['UI/UX Design', 'Figma', 'Photoshop', 'Communication'],
    skills_wanted: ['JavaScript', 'React', 'TypeScript', 'Next.js'],
    skill_level: 'beginner',
    xp: 320,
    streak: 2,
    badges: ['Creative Mind'],
  },
  {
    name: 'Omar Hassan',
    email: 'omar@neuroverse.dev',
    password: 'password123',
    bio: 'Blockchain developer and smart contract auditor. Exploring the intersection of AI and Web3.',
    skills_known: ['Blockchain', 'JavaScript', 'TypeScript', 'Cybersecurity'],
    skills_wanted: ['Machine Learning', 'Python', 'Deep Learning', 'Rust'],
    skill_level: 'advanced',
    xp: 980,
    streak: 8,
    badges: ['Web3 Pioneer', 'Security Expert'],
  },
];

export async function POST() {
  try {
    const results = [];
    for (const userData of sampleUsers) {
      const existingRows = await sql`SELECT id FROM users WHERE email = ${userData.email} LIMIT 1`;
      const existingUser = existingRows[0];

      if (!existingUser) {
        const hashedPassword = await hashPassword(userData.password);
        await sql`INSERT INTO users (name,email,password,bio,skills_known,skills_wanted,skill_level,xp,streak,badges)
          VALUES (${userData.name},${userData.email},${hashedPassword},${userData.bio},${userData.skills_known},${userData.skills_wanted},${userData.skill_level},${userData.xp},${userData.streak},${userData.badges})`;
        results.push({ name: userData.name, status: 'created' });
      } else {
        results.push({ name: userData.name, status: 'already exists' });
      }
    }

    return NextResponse.json({ message: 'Seed completed', results });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
