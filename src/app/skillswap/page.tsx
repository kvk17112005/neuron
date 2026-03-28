'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaSearch, FaHandshake, FaCheck, FaClock, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import SkillTag from '@/components/ui/SkillTag';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

interface MatchedUser {
  user: { _id: string; name: string; email: string; bio: string; avatar: string; skillsKnown: string[]; skillsWanted: string[]; skillLevel: string };
  matchScore: number;
  senderTeaches: string[];
  receiverTeaches: string[];
}

export default function SkillSwapPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [requests, setRequests] = useState<{ sent: string[]; received: string[]; accepted: string[] }>({ sent: [], received: [], accepted: [] });
  const [tab, setTab] = useState<'discover' | 'pending' | 'connected'>('discover');
  const [search, setSearch] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (token) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [matchRes, reqRes] = await Promise.all([
        fetch('/api/skillswap/match', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/skillswap/requests', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const matchData = await matchRes.json();
      const reqData = await reqRes.json();
      if (matchRes.ok) setMatches(matchData.matches || []);
      if (reqRes.ok) {
        const sentIds = (reqData.sent || []).map((m: { receiverId: { _id: string } }) => m.receiverId?._id || m.receiverId);
        const receivedIds = (reqData.received || []).map((m: { senderId: { _id: string } }) => m.senderId?._id || m.senderId);
        const acceptedIds = (reqData.accepted || []).flatMap((m: { senderId: { _id: string }; receiverId: { _id: string } }) => [
          m.senderId?._id || m.senderId, m.receiverId?._id || m.receiverId
        ]);
        setRequests({ sent: sentIds, received: receivedIds, accepted: acceptedIds });
      }
    } catch { toast.error('Failed to load data'); }
    finally { setLoadingData(false); }
  };

  const sendRequest = async (match: MatchedUser) => {
    setSendingTo(match.user._id);
    try {
      const res = await fetch('/api/skillswap/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          receiverId: match.user._id,
          senderTeaches: match.senderTeaches,
          receiverTeaches: match.receiverTeaches,
          matchScore: match.matchScore,
        }),
      });
      if (res.ok) {
        toast.success(`Request sent to ${match.user.name}!`);
        setRequests((prev) => ({ ...prev, sent: [...prev.sent, match.user._id] }));
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to send request');
      }
    } catch { toast.error('Network error'); }
    finally { setSendingTo(null); }
  };

  const filteredMatches = matches.filter((m) =>
    m.user.name.toLowerCase().includes(search.toLowerCase()) ||
    m.user.skillsKnown.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-green to-cyber-blue flex items-center justify-center">
                  <FaUsers className="text-white" />
                </div>
                SkillSwap Network
              </h1>
              <p className="text-gray-400 text-sm mt-1">Find learners to teach and learn from</p>
            </div>
            <button onClick={() => { fetch('/api/seed', { method: 'POST' }).then(() => { toast.success('Sample users seeded!'); fetchData(); }); }}
              className="btn-secondary text-xs !py-2 !px-4">Seed Sample Users</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'discover' as const, label: 'Discover', icon: FaSearch },
              { id: 'pending' as const, label: 'Pending', icon: FaClock },
              { id: 'connected' as const, label: 'Connected', icon: FaHandshake },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${tab === t.id ? 'bg-neural-500/20 text-cyber-blue border border-neural-500/40' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                <t.icon className="text-xs" /> {t.label}
              </button>
            ))}
          </div>

          {tab === 'discover' && (
            <>
              <div className="relative mb-6">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or skill..."
                  className="input-field !pl-11" />
              </div>

              {loadingData ? (
                <div className="py-16"><LoadingSpinner size="lg" text="Finding matches..." /></div>
              ) : filteredMatches.length === 0 ? (
                <EmptyState icon="🔍" title="No matches found" description="Try seeding sample users or update your skills to find matches" action="Seed Users"
                  onAction={() => fetch('/api/seed', { method: 'POST' }).then(() => { toast.success('Seeded!'); fetchData(); })} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AnimatePresence>
                    {filteredMatches.map((match, i) => {
                      const isSent = requests.sent.includes(match.user._id);
                      const isConnected = requests.accepted.includes(match.user._id);
                      return (
                        <motion.div key={match.user._id}
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="glass rounded-2xl p-6 card-hover">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neural-500 to-cyber-purple flex items-center justify-center text-white font-bold text-lg">
                                {match.user.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{match.user.name}</h3>
                                <span className="text-xs text-gray-500 capitalize">{match.user.skillLevel}</span>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold
                              ${match.matchScore >= 70 ? 'bg-cyber-green/20 text-cyber-green' : match.matchScore >= 40 ? 'bg-cyber-orange/20 text-cyber-orange' : 'bg-neural-500/20 text-neural-300'}`}>
                              {match.matchScore}%
                            </div>
                          </div>
                          {match.user.bio && <p className="text-sm text-gray-400 mb-3 line-clamp-2">{match.user.bio}</p>}
                          {match.senderTeaches.length > 0 && (
                            <div className="mb-2">
                              <span className="text-xs text-gray-500">You can teach:</span>
                              <div className="flex flex-wrap gap-1 mt-1">{match.senderTeaches.map((s) => <SkillTag key={s} skill={s} variant="green" />)}</div>
                            </div>
                          )}
                          {match.receiverTeaches.length > 0 && (
                            <div className="mb-3">
                              <span className="text-xs text-gray-500">They can teach you:</span>
                              <div className="flex flex-wrap gap-1 mt-1">{match.receiverTeaches.map((s) => <SkillTag key={s} skill={s} variant="blue" />)}</div>
                            </div>
                          )}
                          <button
                            onClick={() => sendRequest(match)}
                            disabled={isSent || isConnected || sendingTo === match.user._id}
                            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2
                              ${isConnected ? 'bg-cyber-green/20 text-cyber-green'
                                : isSent ? 'bg-gray-700/30 text-gray-500'
                                  : 'bg-gradient-to-r from-neural-500 to-cyber-blue text-white hover:shadow-glow'}`}>
                            {isConnected ? <><FaCheck /> Connected</> : isSent ? <><FaClock /> Pending</> : sendingTo === match.user._id ? 'Sending...' : <><FaHandshake /> Connect</>}
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          {tab === 'pending' && (
            <div className="glass rounded-2xl p-8 text-center">
              <FaClock className="text-4xl text-neural-500/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Pending Requests</h3>
              <p className="text-sm text-gray-500">{requests.sent.length} sent • {requests.received.length} received</p>
              <p className="text-xs text-gray-600 mt-2">Accept or manage requests from your matches</p>
            </div>
          )}

          {tab === 'connected' && (
            <div className="glass rounded-2xl p-8 text-center">
              <FaHandshake className="text-4xl text-cyber-green/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Connected Partners</h3>
              <p className="text-sm text-gray-500">{requests.accepted.length > 0 ? `${Math.floor(requests.accepted.length / 2)} connections` : 'No connections yet'}</p>
              <p className="text-xs text-gray-600 mt-2">Start discovering and connecting with learners!</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
