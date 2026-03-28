export interface Topic {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hasSimulation: boolean;
  icon: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  glowColor: string;
  topics: Topic[];
}

export const subjects: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Explore the language of the universe through numbers, patterns, and logic',
    icon: '🔢',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    topics: [
      { id: 'calculus', name: 'Calculus', description: 'Limits, derivatives, and integrals', difficulty: 'intermediate', hasSimulation: false, icon: '📈' },
      { id: 'linear-algebra', name: 'Linear Algebra', description: 'Vectors, matrices, and transformations', difficulty: 'intermediate', hasSimulation: false, icon: '📐' },
      { id: 'probability', name: 'Probability & Statistics', description: 'Chance, distributions, and data analysis', difficulty: 'beginner', hasSimulation: false, icon: '🎲' },
      { id: 'discrete-math', name: 'Discrete Mathematics', description: 'Logic, sets, graphs, and combinatorics', difficulty: 'intermediate', hasSimulation: false, icon: '🔗' },
      { id: 'number-theory', name: 'Number Theory', description: 'Properties and relationships of numbers', difficulty: 'advanced', hasSimulation: false, icon: '🔑' },
    ],
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Understand the fundamental forces and laws governing our universe',
    icon: '⚛️',
    color: '#00d4ff',
    glowColor: 'rgba(0, 212, 255, 0.4)',
    topics: [
      { id: 'mechanics', name: 'Classical Mechanics', description: 'Motion, forces, and energy', difficulty: 'beginner', hasSimulation: true, icon: '🚀' },
      { id: 'thermodynamics', name: 'Thermodynamics', description: 'Heat, energy transfer, and entropy', difficulty: 'intermediate', hasSimulation: false, icon: '🌡️' },
      { id: 'electromagnetism', name: 'Electromagnetism', description: 'Electric and magnetic fields', difficulty: 'intermediate', hasSimulation: false, icon: '⚡' },
      { id: 'optics', name: 'Optics', description: 'Light, reflection, and refraction', difficulty: 'beginner', hasSimulation: false, icon: '🔦' },
      { id: 'quantum', name: 'Quantum Physics', description: 'Wave-particle duality and quantum states', difficulty: 'advanced', hasSimulation: false, icon: '🌊' },
    ],
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    description: 'Master the art of computation, algorithms, and software engineering',
    icon: '💻',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    topics: [
      { id: 'sorting-algorithms', name: 'Sorting Algorithms', description: 'Bubble sort, merge sort, quicksort, and more', difficulty: 'beginner', hasSimulation: true, icon: '📊' },
      { id: 'data-structures', name: 'Data Structures', description: 'Arrays, trees, graphs, and hash tables', difficulty: 'intermediate', hasSimulation: false, icon: '🏗️' },
      { id: 'algorithms', name: 'Algorithm Design', description: 'Divide and conquer, dynamic programming, greedy', difficulty: 'intermediate', hasSimulation: false, icon: '⚙️' },
      { id: 'networking', name: 'Computer Networks', description: 'Protocols, TCP/IP, and network architecture', difficulty: 'intermediate', hasSimulation: false, icon: '🌐' },
      { id: 'databases', name: 'Database Systems', description: 'SQL, NoSQL, indexing, and optimization', difficulty: 'intermediate', hasSimulation: false, icon: '🗄️' },
    ],
  },
  {
    id: 'ai-ml',
    name: 'AI / Machine Learning',
    description: 'Dive into artificial intelligence, neural networks, and intelligent systems',
    icon: '🤖',
    color: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    topics: [
      { id: 'ml-basics', name: 'ML Fundamentals', description: 'Supervised, unsupervised, and reinforcement learning', difficulty: 'beginner', hasSimulation: false, icon: '🧠' },
      { id: 'neural-networks', name: 'Neural Networks', description: 'Perceptrons, backpropagation, and architectures', difficulty: 'intermediate', hasSimulation: true, icon: '🕸️' },
      { id: 'nlp', name: 'Natural Language Processing', description: 'Text processing, transformers, and language models', difficulty: 'advanced', hasSimulation: false, icon: '📝' },
      { id: 'computer-vision', name: 'Computer Vision', description: 'Image recognition, CNNs, and object detection', difficulty: 'intermediate', hasSimulation: false, icon: '👁️' },
      { id: 'deep-learning', name: 'Deep Learning', description: 'Advanced architectures, GANs, and autoencoders', difficulty: 'advanced', hasSimulation: false, icon: '🔬' },
    ],
  },
];

export function getSubject(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getTopic(subjectId: string, topicId: string): Topic | undefined {
  const subject = getSubject(subjectId);
  return subject?.topics.find((t) => t.id === topicId);
}

export const allSkills = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Machine Learning', 'Deep Learning', 'Data Science', 'TensorFlow', 'PyTorch',
  'C++', 'Java', 'Rust', 'Go', 'SQL', 'MongoDB', 'PostgreSQL',
  'Docker', 'Kubernetes', 'AWS', 'Git', 'Linux',
  'Calculus', 'Linear Algebra', 'Statistics', 'Probability',
  'Physics', 'Chemistry', 'Biology',
  'UI/UX Design', 'Figma', 'Photoshop',
  'Communication', 'Leadership', 'Problem Solving',
  'Web Development', 'Mobile Development', 'DevOps', 'Cybersecurity',
  'Blockchain', 'Game Development', 'Embedded Systems',
];
