import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'streak';
  className?: string;
}
export function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  className
}: StatCardProps) {
  return <div className={cn("stat-card animate-fade-in", variant === 'primary' && "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10", variant === 'streak' && "border-streak/20 bg-gradient-to-br from-streak/5 to-accent/10", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-bold tracking-tight", variant === 'primary' && "text-gradient-primary", variant === 'streak' && "text-gradient-streak", variant === 'default' && "text-foreground")}>
            {value}
          </p>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {icon && <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", variant === 'primary' && "bg-primary/10 text-primary", variant === 'streak' && "bg-amber-500/10 text-amber-500", variant === 'default' && "bg-primary/5 text-primary/70")}>
            {icon}
          </div>}
      </div>
    </div>;
}