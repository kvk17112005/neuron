'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBrain, FaFlask, FaArrowLeft, FaPlay } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { getSubject } from '@/data/subjects';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SubjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subject as string;
  const subject = getSubject(subjectId);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!subject) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Subject not found</p></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
            <FaArrowLeft /> Back
          </button>

          <div className="glass rounded-2xl p-8 mb-8" style={{ boxShadow: `0 0 30px ${subject.glowColor}` }}>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{subject.icon}</span>
              <div>
                <h1 className="text-3xl font-display font-bold text-white">{subject.name}</h1>
                <p className="text-gray-400 mt-1">{subject.description}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <span className="px-3 py-1 rounded-full text-xs bg-neural-500/20 text-neural-300 border border-neural-500/30">
                {subject.topics.length} topics
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/30">
                {subject.topics.filter(t => t.hasSimulation).length} simulations
              </span>
            </div>
          </div>

          <h2 className="text-xl font-display font-semibold mb-6">Topics</h2>
          <div className="grid gap-4">
            {subject.topics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-5 card-hover group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{topic.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyber-blue transition-colors">{topic.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{topic.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs border capitalize
                          ${topic.difficulty === 'beginner' ? 'bg-cyber-green/15 text-cyber-green border-cyber-green/30'
                            : topic.difficulty === 'intermediate' ? 'bg-cyber-orange/15 text-cyber-orange border-cyber-orange/30'
                              : 'bg-cyber-pink/15 text-cyber-pink border-cyber-pink/30'}`}>
                          {topic.difficulty}
                        </span>
                        {topic.hasSimulation && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30">has simulation</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      href={`/mentor?subject=${subject.id}&topic=${topic.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-neural-500/20 text-neural-300 hover:bg-neural-500/30 transition-all"
                    >
                      <FaBrain className="text-xs" /> Learn with AI
                    </Link>
                    {topic.hasSimulation && (
                      <Link
                        href={`/simulation?subject=${subject.id}&topic=${topic.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-cyber-purple/20 text-cyber-purple hover:bg-cyber-purple/30 transition-all"
                      >
                        <FaFlask className="text-xs" /> Simulate
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
