'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBrain, FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { allSkills } from '@/data/subjects';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', bio: '',
    skillsKnown: [] as string[], skillsWanted: [] as string[],
    skillLevel: 'beginner',
  });

  const toggleSkill = (list: 'skillsKnown' | 'skillsWanted', skill: string) => {
    setForm((prev) => ({
      ...prev,
      [list]: prev[list].includes(skill)
        ? prev[list].filter((s) => s !== skill)
        : [...prev[list], skill],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form);
      toast.success('Welcome to NeuroVerse!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neural-500 to-cyber-purple flex items-center justify-center shadow-glow">
              <FaBrain className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl gradient-text">NeuroVerse</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <p className="text-gray-500 mt-1">Step {step} of 2</p>
          <div className="flex gap-2 justify-center mt-3">
            <div className={`h-1 w-16 rounded-full ${step >= 1 ? 'bg-neural-500' : 'bg-dark-700'}`} />
            <div className={`h-1 w-16 rounded-full ${step >= 2 ? 'bg-neural-500' : 'bg-dark-700'}`} />
          </div>
        </div>

        <div className="glass rounded-2xl p-8 glow-border">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field !pl-11" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field !pl-11" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password *</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field !pl-11" placeholder="Min 6 characters" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="input-field resize-none h-20" placeholder="Tell us about yourself..." />
              </div>
              <button onClick={() => {
                if (!form.name || !form.email || !form.password) return toast.error('Fill required fields');
                setStep(2);
              }} className="btn-primary w-full !py-3.5">
                Next: Choose Skills <FaArrowRight className="inline ml-2 text-sm" />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Skill Level</label>
                <div className="flex gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                    <button key={lvl} type="button"
                      onClick={() => setForm({ ...form, skillLevel: lvl })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all
                        ${form.skillLevel === lvl ? 'bg-neural-500/30 text-cyber-blue border border-neural-500/40' : 'bg-dark-800/40 text-gray-500 border border-transparent hover:border-neural-500/20'}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Skills You Know ({form.skillsKnown.length})</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-lg bg-dark-800/30">
                  {allSkills.map((skill) => (
                    <button key={`k-${skill}`} type="button" onClick={() => toggleSkill('skillsKnown', skill)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all border
                        ${form.skillsKnown.includes(skill)
                          ? 'bg-cyber-green/20 text-cyber-green border-cyber-green/40'
                          : 'bg-dark-700/50 text-gray-500 border-transparent hover:border-gray-600'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Skills You Want to Learn ({form.skillsWanted.length})</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-lg bg-dark-800/30">
                  {allSkills.map((skill) => (
                    <button key={`w-${skill}`} type="button" onClick={() => toggleSkill('skillsWanted', skill)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all border
                        ${form.skillsWanted.includes(skill)
                          ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40'
                          : 'bg-dark-700/50 text-gray-500 border-transparent hover:border-gray-600'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 !py-3">Back</button>
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 !py-3">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-neural-400 hover:text-cyber-blue transition-colors">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
