import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMonthlyCalendarData, DayStats } from '@/hooks/useCalendarData';
import {
  getCalendarDays,
  getMonthYearDisplay,
  getWeekdayNames,
  getNextMonth,
  getPreviousMonth,
  dateToString,
  checkIsToday,
} from '@/lib/date-utils';
import { DayCell } from './DayCell';
import { DayDetailModal } from './DayDetailModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function CalendarView() {
  const { language, t } = useLanguage();
  const today = new Date();
  
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: monthStats = [], isLoading } = useMonthlyCalendarData(viewYear, viewMonth);

  // Week starts on Monday for pt-BR
  const weekStartsOnMonday = language === 'pt-BR';
  
  const calendarDays = useMemo(
    () => getCalendarDays(viewYear, viewMonth, weekStartsOnMonday),
    [viewYear, viewMonth, weekStartsOnMonday]
  );

  const weekdayNames = useMemo(
    () => getWeekdayNames(language, weekStartsOnMonday),
    [language, weekStartsOnMonday]
  );

  const monthYearDisplay = getMonthYearDisplay(viewYear, viewMonth, language);

  // Create a map for quick lookup
  const statsMap = useMemo(() => {
    const map: Record<string, DayStats> = {};
    monthStats.forEach(stat => {
      map[stat.stat_date] = stat;
    });
    return map;
  }, [monthStats]);

  const handlePrevMonth = () => {
    const { year, month } = getPreviousMonth(viewYear, viewMonth);
    setViewYear(year);
    setViewMonth(month);
  };

  const handleNextMonth = () => {
    const { year, month } = getNextMonth(viewYear, viewMonth);
    setViewYear(year);
    setViewMonth(month);
  };

  const handleToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setSelectedDate(null);
    }
  };

  const isTodayInView = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span className="capitalize">{monthYearDisplay}</span>
            </CardTitle>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                disabled={isTodayInView}
                className="text-xs"
              >
                {t('calendar.today')}
              </Button>
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                <span className="text-[8px]">✓</span>
              </div>
              <span>{t('calendar.completed')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-warning/20 flex items-center justify-center">
                <span className="text-[8px]">—</span>
              </div>
              <span>{t('calendar.partial')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center">
                <span className="text-[8px]">✕</span>
              </div>
              <span>{t('calendar.noActivity')}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full ring-2 ring-accent" />
              <span>{t('calendar.today')}</span>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdayNames.map((name, i) => (
              <div
                key={i}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-16 sm:h-20 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                const dateStr = dateToString(day);
                return (
                  <DayCell
                    key={i}
                    date={day}
                    year={viewYear}
                    month={viewMonth}
                    dayStats={statsMap[dateStr]}
                    isSelected={selectedDate ? dateToString(selectedDate) === dateStr : false}
                    onClick={() => handleDayClick(day)}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Day detail modal */}
      {selectedDate && (
        <DayDetailModal
          open={!!selectedDate}
          onOpenChange={handleModalClose}
          date={selectedDate}
          dateString={dateToString(selectedDate)}
        />
      )}
    </>
  );
}
