'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaPaperPlane, FaLightbulb, FaGraduationCap, FaBook, FaFlask } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { subjects } from '@/data/subjects';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  style?: string;
}

const styles = [
  { id: 'simple', label: 'Simple', icon: FaLightbulb },
  { id: 'detailed', label: 'Detailed', icon: FaBook },
  { id: 'exam-oriented', label: 'Exam-Oriented', icon: FaGraduationCap },
  { id: 'beginner-friendly', label: 'Beginner', icon: FaBrain },
  { id: 'real-world', label: 'Real-World', icon: FaFlask },
];

const suggestedPrompts = [
  'Explain this concept step by step',
  'Give me a real-world example',
  'What are the key formulas I need to know?',
  'How is this topic used in industry?',
  'Summarize the main points',
  'What should I learn next?',
];

function MentorPageContent() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || '');
  const [style, setStyle] = useState('simple');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);

  const currentSubject = subjects.find((s) => s.id === selectedSubject);
  const currentTopics = currentSubject?.topics || [];

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const question = text || message;
    if (!question.trim()) return;
    if (!selectedSubject || !selectedTopic) return toast.error('Please select a subject and topic first');

    const subjectName = currentSubject?.name || selectedSubject;
    const topicName = currentTopics.find((t) => t.id === selectedTopic)?.name || selectedTopic;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setMessage('');
    setSending(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question, subject: subjectName, topic: topicName, style }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: 'ai', content: data.response, style }]);
      } else {
        toast.error(data.error || 'Failed to get response');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSending(false);
    }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-24 pb-6 flex flex-col">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neural-500 to-cyber-blue flex items-center justify-center">
              <FaBrain className="text-white" />
            </div>
            AI Mentor
          </h1>
          <p className="text-gray-400 text-sm mt-1">Powered by Google Gemini — Ask anything about your subjects</p>
        </motion.div>

        {/* Controls */}
        <div className="glass rounded-xl p-4 mb-4 flex flex-wrap gap-3">
          <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(''); }}
            className="input-field !w-auto !py-2 text-sm">
            <option value="">Select Subject</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
          </select>
          <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}
            className="input-field !w-auto !py-2 text-sm" disabled={!selectedSubject}>
            <option value="">Select Topic</option>
            {currentTopics.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
          </select>
          <div className="flex gap-1 ml-auto">
            {styles.map((s) => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                title={s.label}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
                  ${style === s.id ? 'bg-neural-500/25 text-cyber-blue border border-neural-500/40' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                <s.icon className="text-xs" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass rounded-xl p-4 mb-4 overflow-y-auto min-h-[300px] max-h-[500px] space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <FaBrain className="text-4xl text-neural-500/40 mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Start a Conversation</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md">Select a subject and topic, then ask a question or use a suggested prompt below.</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {suggestedPrompts.map((prompt, i) => (
                  <button key={i} onClick={() => sendMessage(prompt)}
                    disabled={!selectedSubject || !selectedTopic}
                    className="px-3 py-1.5 rounded-full text-xs glass-light text-gray-400 hover:text-white hover:border-neural-500/30 transition-all disabled:opacity-40">
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                    ? 'bg-neural-500/20 border border-neural-500/30 text-white'
                    : 'glass text-gray-200'}`}>
                    {msg.role === 'ai' && <div className="flex items-center gap-2 mb-2 text-xs text-neural-400"><FaBrain /> AI Mentor • {msg.style}</div>}
                    <div className={msg.role === 'ai' ? 'markdown-content text-sm' : 'text-sm'}
                      dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code>$1</code>') }} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {sending && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-neural-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-neural-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 rounded-full bg-neural-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  Thinking...
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested follow-ups */}
        {messages.length > 0 && !sending && (
          <div className="flex flex-wrap gap-2 mb-3">
            {['Explain more simply', 'Give an example', 'Quiz me on this', 'What should I learn next?'].map((p, i) => (
              <button key={i} onClick={() => sendMessage(p)}
                className="px-3 py-1.5 rounded-full text-xs glass-light text-gray-400 hover:text-white transition-all">
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="glass rounded-xl p-3 flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder={selectedTopic ? 'Ask your AI mentor...' : 'Select a subject and topic first...'}
            disabled={!selectedSubject || !selectedTopic || sending}
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm disabled:opacity-50"
          />
          <button onClick={() => sendMessage()} disabled={!message.trim() || sending || !selectedTopic}
            className="p-3 rounded-xl bg-gradient-to-r from-neural-500 to-cyber-blue disabled:opacity-30 hover:shadow-glow transition-all">
            <FaPaperPlane className="text-white text-sm" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default function MentorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>}>
      <MentorPageContent />
    </Suspense>
  );
}
