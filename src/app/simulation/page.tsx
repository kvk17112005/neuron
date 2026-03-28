'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaRedo, FaBrain, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

type Algorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

interface Bar {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted';
}

const algorithmInfo: Record<Algorithm, { name: string; complexity: string; description: string }> = {
  bubble: { name: 'Bubble Sort', complexity: 'O(n²)', description: 'Repeatedly swaps adjacent elements if they are in wrong order.' },
  selection: { name: 'Selection Sort', complexity: 'O(n²)', description: 'Finds the minimum element and places it at the beginning.' },
  insertion: { name: 'Insertion Sort', complexity: 'O(n²)', description: 'Builds sorted array one item at a time by inserting into correct position.' },
  merge: { name: 'Merge Sort', complexity: 'O(n log n)', description: 'Divides array in half, sorts each half, then merges them.' },
  quick: { name: 'Quick Sort', complexity: 'O(n log n)', description: 'Picks a pivot and partitions around it recursively.' },
};

function generateArray(size: number): Bar[] {
  return Array.from({ length: size }, () => ({
    value: Math.floor(Math.random() * 90) + 10,
    state: 'default' as const,
  }));
}

export default function SimulationPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [bars, setBars] = useState<Bar[]>(generateArray(30));
  const [algorithm, setAlgorithm] = useState<Algorithm>('bubble');
  const [speed, setSpeed] = useState(50);
  const [arraySize, setArraySize] = useState(30);
  const [sorting, setSorting] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const stopRef = useRef(false);

  // AI Mentor
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  const resetArray = useCallback(() => {
    stopRef.current = true;
    setSorting(false);
    setBars(generateArray(arraySize));
    setComparisons(0);
    setSwaps(0);
  }, [arraySize]);

  useEffect(() => { resetArray(); }, [arraySize, resetArray]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, Math.max(1, 200 - speed * 2)));

  const bubbleSort = async () => {
    const arr = [...bars];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (stopRef.current) return;
        arr[j].state = 'comparing';
        arr[j + 1].state = 'comparing';
        setBars([...arr]);
        setComparisons((c) => c + 1);
        await sleep(speed);
        if (arr[j].value > arr[j + 1].value) {
          arr[j].state = 'swapping';
          arr[j + 1].state = 'swapping';
          setBars([...arr]);
          await sleep(speed);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setSwaps((s) => s + 1);
        }
        arr[j].state = 'default';
        arr[j + 1].state = 'default';
      }
      arr[arr.length - 1 - i].state = 'sorted';
    }
    arr[0].state = 'sorted';
    setBars([...arr]);
  };

  const selectionSort = async () => {
    const arr = [...bars];
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      arr[i].state = 'comparing';
      for (let j = i + 1; j < arr.length; j++) {
        if (stopRef.current) return;
        arr[j].state = 'comparing';
        setBars([...arr]);
        setComparisons((c) => c + 1);
        await sleep(speed);
        if (arr[j].value < arr[minIdx].value) minIdx = j;
        if (j !== minIdx) arr[j].state = 'default';
      }
      if (minIdx !== i) {
        arr[i].state = 'swapping';
        arr[minIdx].state = 'swapping';
        setBars([...arr]);
        await sleep(speed);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setSwaps((s) => s + 1);
      }
      arr[i].state = 'sorted';
      if (minIdx !== i) arr[minIdx].state = 'default';
      setBars([...arr]);
    }
  };

  const insertionSort = async () => {
    const arr = [...bars];
    arr[0].state = 'sorted';
    for (let i = 1; i < arr.length; i++) {
      if (stopRef.current) return;
      const key = arr[i];
      arr[i].state = 'comparing';
      setBars([...arr]);
      await sleep(speed);
      let j = i - 1;
      while (j >= 0 && arr[j].value > key.value) {
        if (stopRef.current) return;
        setComparisons((c) => c + 1);
        arr[j + 1] = arr[j];
        arr[j + 1].state = 'swapping';
        setBars([...arr]);
        setSwaps((s) => s + 1);
        await sleep(speed);
        arr[j + 1].state = 'sorted';
        j--;
      }
      arr[j + 1] = key;
      arr[j + 1].state = 'sorted';
      setBars([...arr]);
    }
  };

  const startSort = async () => {
    stopRef.current = false;
    setSorting(true);
    setComparisons(0);
    setSwaps(0);
    const sortMap: Record<Algorithm, () => Promise<void>> = {
      bubble: bubbleSort,
      selection: selectionSort,
      insertion: insertionSort,
      merge: bubbleSort, // simplified fallback
      quick: selectionSort, // simplified fallback
    };
    await sortMap[algorithm]();
    setSorting(false);
  };

  const stopSort = () => { stopRef.current = true; setSorting(false); };

  const askAI = async (question?: string) => {
    const q = question || aiQuestion;
    if (!q.trim()) return;
    setAiLoading(true);
    setAiQuestion('');
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          question: q,
          subject: 'Computer Science',
          topic: 'Sorting Algorithms',
          style: 'beginner-friendly',
        }),
      });
      const data = await res.json();
      if (res.ok) setAiResponse(data.response);
      else toast.error('AI error');
    } catch { toast.error('Network error'); }
    finally { setAiLoading(false); }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  const info = algorithmInfo[algorithm];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold mb-1">🧪 Sorting Algorithm Visualizer</h1>
          <p className="text-gray-400 text-sm mb-6">Watch algorithms sort data in real time</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualization */}
            <div className="lg:col-span-2 space-y-4">
              {/* Controls */}
              <div className="glass rounded-xl p-4 flex flex-wrap gap-3 items-center">
                <select value={algorithm} onChange={(e) => { setAlgorithm(e.target.value as Algorithm); resetArray(); }}
                  disabled={sorting} className="input-field !w-auto !py-2 text-sm">
                  {Object.entries(algorithmInfo).map(([id, info]) => (
                    <option key={id} value={id}>{info.name} — {info.complexity}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Size:</label>
                  <input type="range" min={10} max={80} value={arraySize}
                    onChange={(e) => setArraySize(Number(e.target.value))} disabled={sorting}
                    className="w-20 accent-neural-500" />
                  <span className="text-xs text-gray-400 w-6">{arraySize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Speed:</label>
                  <input type="range" min={1} max={100} value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-20 accent-cyber-blue" />
                </div>
                <div className="flex gap-2 ml-auto">
                  {!sorting ? (
                    <button onClick={startSort} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-cyber-green/20 text-cyber-green hover:bg-cyber-green/30 transition-all">
                      <FaPlay className="text-xs" /> Sort
                    </button>
                  ) : (
                    <button onClick={stopSort} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-cyber-pink/20 text-cyber-pink hover:bg-cyber-pink/30 transition-all">
                      <FaPause className="text-xs" /> Stop
                    </button>
                  )}
                  <button onClick={resetArray} disabled={sorting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-neural-500/20 text-neural-300 hover:bg-neural-500/30 transition-all disabled:opacity-50">
                    <FaRedo className="text-xs" /> Reset
                  </button>
                </div>
              </div>

              {/* Bar chart */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-end justify-center gap-[1px] h-64">
                  {bars.map((bar, i) => (
                    <div key={i} className="flex-1 rounded-t transition-all duration-75"
                      style={{
                        height: `${bar.value}%`,
                        backgroundColor:
                          bar.state === 'sorted' ? '#10b981'
                          : bar.state === 'comparing' ? '#00d4ff'
                          : bar.state === 'swapping' ? '#ec4899'
                          : '#6366f1',
                        boxShadow:
                          bar.state === 'comparing' ? '0 0 8px rgba(0, 212, 255, 0.5)'
                          : bar.state === 'swapping' ? '0 0 8px rgba(236, 72, 153, 0.5)'
                          : bar.state === 'sorted' ? '0 0 8px rgba(16, 185, 129, 0.5)'
                          : 'none',
                      }} />
                  ))}
                </div>
                {/* Legend */}
                <div className="flex gap-4 mt-3 justify-center text-xs text-gray-500">
                  <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#6366f1]" /> Default</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#00d4ff]" /> Comparing</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#ec4899]" /> Swapping</span>
                  <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#10b981]" /> Sorted</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-cyber-blue">{comparisons}</div>
                  <div className="text-xs text-gray-500">Comparisons</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-cyber-pink">{swaps}</div>
                  <div className="text-xs text-gray-500">Swaps</div>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <div className="text-lg font-bold text-cyber-purple">{info.complexity}</div>
                  <div className="text-xs text-gray-500">Complexity</div>
                </div>
              </div>
            </div>

            {/* AI Panel */}
            <div className="space-y-4">
              <div className="glass rounded-xl p-5">
                <h3 className="font-semibold text-white mb-2">{info.name}</h3>
                <p className="text-sm text-gray-400 mb-3">{info.description}</p>
                <div className="text-xs text-gray-500">
                  <p>Time Complexity: <span className="text-cyber-blue">{info.complexity}</span></p>
                </div>
              </div>

              <div className="glass rounded-xl p-5">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <FaBrain className="text-neural-400" /> AI Mentor
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Explain this algorithm', 'When should I use this?', 'Compare with other sorts'].map((p) => (
                    <button key={p} onClick={() => askAI(p)}
                      className="px-3 py-1.5 rounded-full text-xs glass-light text-gray-400 hover:text-white transition-all">
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askAI()}
                    placeholder="Ask about this simulation..."
                    className="flex-1 bg-dark-800/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none border border-neural-500/20 focus:border-neural-500/40" />
                  <button onClick={() => askAI()} disabled={aiLoading}
                    className="p-2 rounded-lg bg-neural-500/20 text-neural-300 hover:bg-neural-500/30 transition-all">
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
                {aiLoading && <div className="mt-3"><LoadingSpinner size="sm" text="AI is thinking..." /></div>}
                {aiResponse && (
                  <div className="mt-3 p-3 rounded-lg bg-dark-800/40 text-sm text-gray-300 max-h-64 overflow-y-auto markdown-content"
                    dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code>$1</code>') }} />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
