'use client';

const colors: Record<string, string> = {
  default: 'bg-neural-500/20 text-neural-300 border-neural-500/30',
  blue: 'bg-cyber-blue/15 text-cyber-blue border-cyber-blue/30',
  purple: 'bg-cyber-purple/15 text-cyber-purple border-cyber-purple/30',
  pink: 'bg-cyber-pink/15 text-cyber-pink border-cyber-pink/30',
  green: 'bg-cyber-green/15 text-cyber-green border-cyber-green/30',
  orange: 'bg-cyber-orange/15 text-cyber-orange border-cyber-orange/30',
};

export default function SkillTag({
  skill,
  variant = 'default',
  removable,
  onRemove,
}: {
  skill: string;
  variant?: keyof typeof colors;
  removable?: boolean;
  onRemove?: () => void;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors[variant] || colors.default} transition-all duration-200 hover:scale-105`}>
      {skill}
      {removable && (
        <button onClick={onRemove} className="ml-1 hover:text-white transition-colors">
          ×
        </button>
      )}
    </span>
  );
}
