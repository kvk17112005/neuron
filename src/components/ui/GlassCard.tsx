'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hover = true, glow, onClick }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`glass rounded-2xl p-6 ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      style={glow ? { boxShadow: `0 0 25px ${glow}` } : undefined}
    >
      {children}
    </motion.div>
  );
}
