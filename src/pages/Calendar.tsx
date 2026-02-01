import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarView } from '@/components/calendar/CalendarView';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Calendar() {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('nav.calendar')}
          </h1>
          <p className="text-muted-foreground">
            {t('calendar.subtitle')}
          </p>
        </div>

        <CalendarView />
      </div>
    </AppLayout>
  );
}
