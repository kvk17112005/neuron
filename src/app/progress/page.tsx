'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaChartLine, FaCheckCircle, FaExclamationTriangle, FaStar, FaFire } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { subjects } from '@/data/subjects';
import toast from 'react-hot-toast';

interface ProgressStats {
  totalTopics: number;
  completedCount: number;
  inProgressCount: number;
  weakTopics: { subject: string; topic: string; weakness: string; score: number }[];
  strongTopics: { subject: string; topic: string; score: number }[];
  subjectStats: Record<string, { total: number; completed: number; avgScore: number; scores: number[] }>;
}

export default function ProgressPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/progress/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setStats(await res.json());
    } catch { toast.error('Failed to load progress'); }
    finally { setLoadingStats(false); }
  };

  useEffect(() => {
    if (token) fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-orange to-cyber-pink flex items-center justify-center">
              <FaChartLine className="text-white" />
            </div>
            Learning Progress
          </h1>
          <p className="text-gray-400 text-sm mb-8">Track your growth across all subjects</p>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'XP Earned', value: user.xp, icon: '⚡', color: 'text-cyber-blue' },
              { label: 'Day Streak', value: user.streak, icon: '🔥', color: 'text-cyber-orange' },
              { label: 'Completed', value: stats?.completedCount || 0, icon: '✅', color: 'text-cyber-green' },
              { label: 'In Progress', value: stats?.inProgressCount || 0, icon: '📖', color: 'text-cyber-purple' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 text-center card-hover">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><span>🏅</span> Your Badges</h2>
              <div className="flex flex-wrap gap-3">
                {user.badges.map((badge, i) => (
                  <div key={i} className="px-4 py-2 rounded-full glass-light text-sm text-cyber-orange border border-cyber-orange/20 flex items-center gap-2">
                    <FaStar className="text-xs" /> {badge}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subject Progress */}
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">📚 Subject Progress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((subject) => {
                const subStat = stats?.subjectStats?.[subject.name];
                const progress = subStat ? Math.round((subStat.completed / Math.max(subStat.total, 1)) * 100) : 0;
                return (
                  <div key={subject.id} className="p-4 rounded-xl bg-dark-800/30 border border-neural-500/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{subject.icon}</span>
                        <span className="font-medium text-sm">{subject.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {subStat ? `${subStat.completed}/${subStat.total}` : `0/${subject.topics.length}`}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-dark-700 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, background: `linear-gradient(to right, ${subject.color}, ${subject.color}80)` }} />
                    </div>
                    {subStat && subStat.avgScore > 0 && (
                      <div className="text-xs text-gray-500 mt-2">Avg quiz score: <span className="text-cyber-blue">{subStat.avgScore}%</span></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weak Topics */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-cyber-orange" /> Weak Areas
              </h2>
              {stats?.weakTopics && stats.weakTopics.length > 0 ? (
                <div className="space-y-3">
                  {stats.weakTopics.map((t, i) => (
                    <div key={i} className="p-3 rounded-lg bg-dark-800/30 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{t.topic}</div>
                        <div className="text-xs text-gray-500">{t.subject}</div>
                      </div>
                      <div className="text-sm text-cyber-orange">{t.score}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No weak areas identified yet. Keep learning!</p>
              )}
            </div>

            {/* Strong Topics */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-cyber-green" /> Strong Areas
              </h2>
              {stats?.strongTopics && stats.strongTopics.length > 0 ? (
                <div className="space-y-3">
                  {stats.strongTopics.map((t, i) => (
                    <div key={i} className="p-3 rounded-lg bg-dark-800/30 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{t.topic}</div>
                        <div className="text-xs text-gray-500">{t.subject}</div>
                      </div>
                      <div className="text-sm text-cyber-green">{t.score}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Complete quizzes to discover your strengths!</p>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
