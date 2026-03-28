'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaBrain, FaRocket, FaUsers, FaChartLine, FaUser, FaFlask, FaSignOutAlt } from 'react-icons/fa';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: FaRocket },
  { href: '/mentor', label: 'AI Mentor', icon: FaBrain },
  { href: '/simulation', label: 'Simulations', icon: FaFlask },
  { href: '/skillswap', label: 'SkillSwap', icon: FaUsers },
  { href: '/progress', label: 'Progress', icon: FaChartLine },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neural-500 to-cyber-purple flex items-center justify-center group-hover:shadow-glow transition-all">
              <FaBrain className="text-white text-sm" />
            </div>
            <span className="font-display font-bold text-lg gradient-text hidden sm:block">NeuroVerse</span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-neural-500/20 text-cyber-blue shadow-glow-cyan'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <link.icon className="text-xs" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <FaUser className="text-xs" />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </Link>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full glass-light text-xs">
                  <span className="text-cyber-orange">🔥</span>
                  <span className="text-gray-300">{user.streak} streak</span>
                  <span className="text-neural-400">•</span>
                  <span className="text-cyber-blue">{user.xp} XP</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="btn-secondary text-sm !py-2 !px-4">Login</Link>
                <Link href="/auth/signup" className="btn-primary text-sm !py-2 !px-4">Sign Up</Link>
              </div>
            )}

            {/* Mobile Toggle */}
            {user && (
              <button
                className="md:hidden p-2 text-gray-400 hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <HiX size={22} /> : <HiMenu size={22} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-neural-500/10"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                    ${pathname === link.href ? 'bg-neural-500/20 text-cyber-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <link.icon />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
