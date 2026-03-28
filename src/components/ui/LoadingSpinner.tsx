'use client';

export default function LoadingSpinner({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const sizeClasses = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-2 border-neural-500/20 border-t-cyber-blue animate-spin`} />
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-b-cyber-purple animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      {text && <p className="text-sm text-gray-400 animate-pulse">{text}</p>}
    </div>
  );
}
