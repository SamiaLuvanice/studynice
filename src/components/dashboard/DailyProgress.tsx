import { ProgressRing } from '@/components/ui/progress-ring';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface DailyProgressProps {
  currentMinutes: number;
  targetMinutes: number;
  className?: string;
}

export function DailyProgress({
  currentMinutes,
  targetMinutes,
  className,
}: DailyProgressProps) {
  const { t } = useLanguage();
  const progress = targetMinutes > 0 
    ? Math.min((currentMinutes / targetMinutes) * 100, 100) 
    : 0;
  const isCompleted = currentMinutes >= targetMinutes && targetMinutes > 0;

  const remaining = targetMinutes - currentMinutes;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <ProgressRing progress={progress} size={140} strokeWidth={12}>
        <div className="text-center">
          <p
            className={cn(
              "text-3xl font-bold",
              isCompleted ? "text-gradient-primary" : "text-foreground"
            )}
          >
            {currentMinutes}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.ofMinutes').replace('{target}', String(targetMinutes))}
          </p>
        </div>
      </ProgressRing>
      <p className="mt-4 text-sm font-medium text-muted-foreground">
        {isCompleted ? (
          <span className="text-primary">{t('dashboard.goalCompleted')}</span>
        ) : (
          t('dashboard.minToGo').replace('{remaining}', String(remaining))
        )}
      </p>
    </div>
  );
}
