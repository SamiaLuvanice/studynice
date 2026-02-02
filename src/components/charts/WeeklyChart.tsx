import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeeklyChartProps {
  data: Array<{
    date: string;
    minutes: number;
    target: number;
  }>;
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const { language, t } = useLanguage();
  
  const chartData = useMemo(() => {
    const locale = language === 'pt-BR' ? 'pt-BR' : 'en-US';
    return data.map((item) => {
      // Parse date string as local date (YYYY-MM-DD format)
      const [year, month, day] = item.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      return {
        ...item,
        day: date.toLocaleDateString(locale, { weekday: 'short' }),
        completed: item.minutes >= item.target,
      };
    });
  }, [data, language]);

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `${value}m`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const chartItem = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-card p-3 shadow-lg">
                    <p className="text-sm font-medium text-foreground">
                      {chartItem.minutes} {t('dashboard.minutes')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('dashboard.target')}: {chartItem.target} min
                    </p>
                    {chartItem.completed && (
                      <p className="text-xs text-primary font-medium mt-1">
                        ✓ {t('dashboard.completed')}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.completed
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--muted-foreground) / 0.3)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
