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

interface WeeklyChartProps {
  data: Array<{
    date: string;
    minutes: number;
    target: number;
  }>;
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
      completed: item.minutes >= item.target,
    }));
  }, [data]);

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
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-card p-3 shadow-lg">
                    <p className="text-sm font-medium text-foreground">
                      {data.minutes} minutes
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Target: {data.target} min
                    </p>
                    {data.completed && (
                      <p className="text-xs text-primary font-medium mt-1">
                        ✓ Completed
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
