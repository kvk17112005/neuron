'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaStar, FaFire, FaBolt, FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import SkillTag from '@/components/ui/SkillTag';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile Header */}
          <div className="glass rounded-2xl p-8 mb-6 glow-border">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neural-500 to-cyber-purple flex items-center justify-center text-white text-4xl font-bold shadow-glow">
                {user.name.charAt(0)}
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl font-display font-bold text-white">{user.name}</h1>
                <p className="text-gray-400 text-sm flex items-center gap-2 justify-center sm:justify-start mt-1">
                  <FaEnvelope className="text-xs" /> {user.email}
                </p>
                {user.bio && <p className="text-gray-400 text-sm mt-2 max-w-md">{user.bio}</p>}
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  <span className="px-3 py-1 rounded-full text-xs bg-neural-500/20 text-neural-300 border border-neural-500/30 capitalize">
                    <FaGraduationCap className="inline mr-1" /> {user.skillLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'XP', value: user.xp, icon: FaBolt, color: 'text-cyber-blue' },
              { label: 'Streak', value: `${user.streak} days`, icon: FaFire, color: 'text-cyber-orange' },
              { label: 'Badges', value: user.badges.length, icon: FaStar, color: 'text-cyber-pink' },
              { label: 'Skills', value: user.skillsKnown.length, icon: FaUser, color: 'text-cyber-green' },
            ].map((stat, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-4 text-center">
                <stat.icon className={`text-xl mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                💡 Skills You Know
              </h2>
              {user.skillsKnown.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skillsKnown.map((s) => <SkillTag key={s} skill={s} variant="green" />)}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added yet</p>
              )}
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🎯 Skills You Want
              </h2>
              {user.skillsWanted.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted.map((s) => <SkillTag key={s} skill={s} variant="blue" />)}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No learning goals set yet</p>
              )}
            </div>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">🏅 Badges Earned</h2>
              <div className="flex flex-wrap gap-3">
                {user.badges.map((badge, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-4 py-3 rounded-xl glass-light text-center">
                    <div className="text-2xl mb-1">🏅</div>
                    <div className="text-xs text-gray-300">{badge}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
