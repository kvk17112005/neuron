'use client';

import { FaBrain, FaGithub, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-neural-500/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neural-500 to-cyber-purple flex items-center justify-center">
              <FaBrain className="text-white text-sm" />
            </div>
            <span className="font-display font-bold gradient-text">NeuroVerse AI</span>
          </div>
          <p className="text-sm text-gray-500">Built for EdTech & Learning Innovation Hackathon</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-cyber-blue transition-colors"><FaGithub size={18} /></a>
            <a href="#" className="text-gray-500 hover:text-cyber-blue transition-colors"><FaTwitter size={18} /></a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neural-500/10 text-center">
          <p className="text-xs text-gray-600">© 2024 NeuroVerse AI — Powered by Google Gemini</p>
        </div>
      </div>
    </footer>
  );
}
