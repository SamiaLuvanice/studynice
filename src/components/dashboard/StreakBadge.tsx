import { Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StreakBadge({ streak, size = 'md', className }: StreakBadgeProps) {
  const { t } = useLanguage();
  
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const dayLabel = streak === 1 ? t('dashboard.day') : t('dashboard.days');

  return (
    <div
      className={cn(
        "streak-badge",
        sizeClasses[size],
        streak === 0 && "opacity-50",
        className
      )}
    >
      <Flame className={cn(iconSizes[size], streak > 0 && "animate-pulse-soft")} />
      <span>{streak} {dayLabel}</span>
    </div>
  );
}
