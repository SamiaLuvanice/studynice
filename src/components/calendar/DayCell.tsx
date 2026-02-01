import { cn } from '@/lib/utils';
import { checkIsToday, checkIsFuture, isInMonth } from '@/lib/date-utils';
import { DayStats } from '@/hooks/useCalendarData';
import { Check, X, Minus } from 'lucide-react';

interface DayCellProps {
  date: Date;
  year: number;
  month: number;
  dayStats?: DayStats;
  isSelected: boolean;
  onClick: () => void;
}

export function DayCell({ date, year, month, dayStats, isSelected, onClick }: DayCellProps) {
  const isCurrentMonth = isInMonth(date, year, month);
  const isToday = checkIsToday(date);
  const isFuture = checkIsFuture(date);
  
  const hasActivity = dayStats && dayStats.total_minutes > 0;
  const isCompleted = dayStats?.is_completed === true;
  const hasPartialProgress = hasActivity && !isCompleted;
  const isMissedDay = isCurrentMonth && !isFuture && !isToday && !hasActivity;

  const dayNumber = date.getDate();

  return (
    <button
      onClick={onClick}
      disabled={isFuture}
      className={cn(
        "relative flex flex-col items-center justify-start p-1 h-16 sm:h-20 rounded-lg transition-all",
        "hover:bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
        !isCurrentMonth && "opacity-30",
        isFuture && "cursor-not-allowed opacity-40",
        isSelected && "ring-2 ring-primary bg-primary/10",
        isToday && "ring-2 ring-accent",
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          "text-sm font-medium",
          isToday && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center",
          !isCurrentMonth && "text-muted-foreground",
        )}
      >
        {dayNumber}
      </span>

      {/* Status indicator */}
      {isCurrentMonth && !isFuture && (
        <div className="mt-1 flex flex-col items-center gap-0.5">
          {isCompleted && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success/20">
              <Check className="w-3 h-3 text-success" />
            </div>
          )}
          {hasPartialProgress && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-warning/20">
              <Minus className="w-3 h-3 text-warning" />
            </div>
          )}
          {isMissedDay && (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-destructive/20">
              <X className="w-3 h-3 text-destructive" />
            </div>
          )}

          {/* Minutes studied */}
          {hasActivity && (
            <span className="text-[10px] text-muted-foreground">
              {dayStats.total_minutes}m
            </span>
          )}

          {/* Goals count */}
          {dayStats && dayStats.goals_count > 0 && (
            <span className="text-[9px] text-muted-foreground">
              {dayStats.goals_count} 🎯
            </span>
          )}
        </div>
      )}
    </button>
  );
}
