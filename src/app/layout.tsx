import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'NeuroVerse AI - Immersive Learning Platform',
  description: 'A 3D immersive AI-powered learning platform with interactive simulations and SkillSwap network',
  keywords: ['education', 'AI', 'learning', 'Gemini', 'interactive', 'SkillSwap'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="animated-bg min-h-screen antialiased">
        <AuthProvider>
          <div className="cyber-grid-bg min-h-screen">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 15, 46, 0.9)',
                color: '#e2e8f0',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#0a0a1a' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0a0a1a' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
