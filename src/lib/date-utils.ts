import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isFuture, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

export type Language = 'en' | 'pt-BR';

/**
 * Get the user's timezone from browser or stored preference
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/Sao_Paulo';
  }
}

/**
 * Get current date in user's timezone as YYYY-MM-DD string
 */
export function getTodayInTimezone(timezone: string = getUserTimezone()): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now);
}

/**
 * Get the locale object for date-fns based on language
 */
export function getLocale(language: Language) {
  return language === 'pt-BR' ? ptBR : enUS;
}

/**
 * Format a date for display with locale awareness
 */
export function formatDateDisplay(date: Date, formatStr: string, language: Language): string {
  return format(date, formatStr, { locale: getLocale(language) });
}

/**
 * Get all days to display in a calendar month view (including padding days)
 */
export function getCalendarDays(year: number, month: number, weekStartsOnMonday: boolean = false): Date[] {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: weekStartsOnMonday ? 1 : 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: weekStartsOnMonday ? 1 : 0 });
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

/**
 * Get month name and year for display
 */
export function getMonthYearDisplay(year: number, month: number, language: Language): string {
  const date = new Date(year, month);
  return format(date, 'MMMM yyyy', { locale: getLocale(language) });
}

/**
 * Get weekday names for calendar header
 */
export function getWeekdayNames(language: Language, weekStartsOnMonday: boolean = false): string[] {
  const baseDate = new Date(2024, 0, weekStartsOnMonday ? 1 : 7); // Monday or Sunday
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    days.push(format(date, 'EEE', { locale: getLocale(language) }));
  }
  return days;
}

/**
 * Navigate to next month
 */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  const date = addMonths(new Date(year, month), 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

/**
 * Navigate to previous month
 */
export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  const date = subMonths(new Date(year, month), 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

/**
 * Check if a date is in the given month
 */
export function isInMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month;
}

/**
 * Convert Date to YYYY-MM-DD string
 */
export function dateToString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Check if date is today
 */
export function checkIsToday(date: Date): boolean {
  return isToday(date);
}

/**
 * Check if date is in the future
 */
export function checkIsFuture(date: Date): boolean {
  return isFuture(date);
}

/**
 * Check if two dates are the same day
 */
export function checkIsSameDay(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}
