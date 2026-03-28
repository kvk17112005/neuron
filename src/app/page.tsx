'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBrain, FaRocket, FaUsers, FaFlask, FaChartLine, FaStar, FaArrowRight } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false });

const features = [
  { icon: FaBrain, title: 'AI Mentor', desc: 'Google Gemini-powered AI tutor that explains concepts in multiple styles', color: 'from-cyber-blue to-neural-500' },
  { icon: FaFlask, title: 'Simulations', desc: 'Interactive visualizations that bring algorithms and physics to life', color: 'from-cyber-purple to-cyber-pink' },
  { icon: FaUsers, title: 'SkillSwap', desc: 'Connect with learners who teach what you want and learn what you know', color: 'from-cyber-green to-cyber-blue' },
  { icon: FaChartLine, title: 'Progress Tracking', desc: 'Visual dashboards showing your strengths, weaknesses, and growth', color: 'from-cyber-orange to-cyber-pink' },
  { icon: FaRocket, title: '3D Universe', desc: 'Explore subjects in an immersive futuristic learning environment', color: 'from-neural-400 to-cyber-purple' },
  { icon: FaStar, title: 'XP & Badges', desc: 'Earn experience points and badges as you master new concepts', color: 'from-cyber-pink to-cyber-orange' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      {mounted && <ParticleField className="opacity-60" />}

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neural-500 to-cyber-purple flex items-center justify-center shadow-glow">
            <FaBrain className="text-white" />
          </div>
          <span className="font-display font-bold text-xl gradient-text">NeuroVerse AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="px-5 py-2.5 text-sm text-gray-300 hover:text-white transition-colors">Login</Link>
          <Link href="/auth/signup" className="btn-primary text-sm !py-2.5">
            Get Started <FaArrowRight className="inline ml-1 text-xs" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-neural-300 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            Powered by Google Gemini AI
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
            <span className="gradient-text">Learn Smarter</span>
            <br />
            <span className="text-white">in the NeuroVerse</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            An immersive 3D learning platform with AI-powered mentoring, interactive simulations,
            and a community of learners who teach each other.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="btn-primary text-lg !px-8 !py-4 shadow-glow-lg">
              Start Learning <FaArrowRight className="inline ml-2" />
            </Link>
            <Link href="/auth/login" className="btn-secondary text-lg !px-8 !py-4">
              Explore Demo
            </Link>
          </div>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-20"
        >
          {[
            { label: 'Subjects', value: '4+', icon: '📚' },
            { label: 'Topics', value: '20+', icon: '🎯' },
            { label: 'AI Styles', value: '5', icon: '🧠' },
            { label: 'Simulations', value: 'Live', icon: '⚡' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl px-6 py-4 text-center hover-glow">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold gradient-text-alt">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-display font-bold mb-4">
            <span className="gradient-text">Features</span> that Redefine Learning
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-gray-400 max-w-xl mx-auto">
            Every tool you need to master any subject, powered by cutting-edge AI
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="glass rounded-2xl p-6 card-hover group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:shadow-glow transition-all`}>
                <f.icon className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 sm:p-16 text-center glow-border"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 gradient-text">Ready to Enter the NeuroVerse?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join a community of learners, get AI-powered guidance, and master new skills faster than ever.
          </p>
          <Link href="/auth/signup" className="btn-primary text-lg !px-10 !py-4 shadow-glow-lg">
            Create Free Account <FaArrowRight className="inline ml-2" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neural-500/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaBrain className="text-neural-500" />
            <span className="text-sm text-gray-500">NeuroVerse AI — EdTech Hackathon 2024</span>
          </div>
          <p className="text-xs text-gray-600">Powered by Google Gemini</p>
        </div>
      </footer>
    </div>
  );
}
