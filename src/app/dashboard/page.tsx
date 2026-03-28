'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBrain, FaFlask, FaUsers, FaChartLine, FaArrowRight, FaFire } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { subjects } from '@/data/subjects';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" text="Loading dashboard..." /></div>;
  }

  const greetingTime = new Date().getHours();
  const greeting = greetingTime < 12 ? 'Good morning' : greetingTime < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-bold">
            {greeting}, <span className="gradient-text">{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-gray-400 mt-2">Ready to explore the learning universe?</p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2 glass-light rounded-full px-4 py-2">
              <FaFire className="text-cyber-orange" />
              <span className="text-sm"><strong className="text-white">{user.streak}</strong> <span className="text-gray-400">day streak</span></span>
            </div>
            <div className="flex items-center gap-2 glass-light rounded-full px-4 py-2">
              <span className="text-sm"><strong className="text-cyber-blue">{user.xp}</strong> <span className="text-gray-400">XP earned</span></span>
            </div>
            {user.badges.length > 0 && (
              <div className="flex items-center gap-2 glass-light rounded-full px-4 py-2">
                <span className="text-sm">🏅 <strong className="text-white">{user.badges.length}</strong> <span className="text-gray-400">badges</span></span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Subject Universe */}
        <motion.section initial="hidden" animate="visible" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">🌌 Subject Universe</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {subjects.map((subject, i) => (
              <motion.div key={subject.id} variants={fadeUp} custom={i}>
                <Link href={`/subjects/${subject.id}`}>
                  <div className="glass rounded-2xl p-6 card-hover group relative overflow-hidden h-full"
                    style={{ boxShadow: `0 0 20px ${subject.glowColor}` }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ background: `radial-gradient(circle, ${subject.color}, transparent)`, transform: 'translate(30%, -30%)' }} />
                    <div className="text-4xl mb-3">{subject.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-1">{subject.name}</h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{subject.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{subject.topics.length} topics</span>
                      <FaArrowRight className="text-xs text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section initial="hidden" animate="visible" className="mb-12">
          <h2 className="text-xl font-display font-semibold mb-6">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { href: '/mentor', icon: FaBrain, label: 'AI Mentor', desc: 'Ask your AI tutor anything', color: 'from-neural-500 to-cyber-blue' },
              { href: '/simulation', icon: FaFlask, label: 'Simulations', desc: 'Visualize algorithms in action', color: 'from-cyber-purple to-cyber-pink' },
              { href: '/skillswap', icon: FaUsers, label: 'SkillSwap', desc: 'Find learning partners', color: 'from-cyber-green to-cyber-blue' },
            ].map((action, i) => (
              <motion.div key={action.href} variants={fadeUp} custom={i + 4}>
                <Link href={action.href}>
                  <div className="glass rounded-2xl p-6 card-hover group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:shadow-glow transition-all`}>
                      <action.icon className="text-white text-lg" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{action.label}</h3>
                    <p className="text-sm text-gray-400">{action.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Progress Preview */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">📊 Your Progress</h2>
            <Link href="/progress" className="text-sm text-neural-400 hover:text-cyber-blue transition-colors flex items-center gap-1">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'XP Earned', value: user.xp, icon: '⚡' },
                { label: 'Day Streak', value: user.streak, icon: '🔥' },
                { label: 'Skills Known', value: user.skillsKnown.length, icon: '💡' },
                { label: 'Badges', value: user.badges.length, icon: '🏅' },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-dark-800/30">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold gradient-text-alt">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
