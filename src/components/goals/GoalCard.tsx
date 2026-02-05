import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Clock, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface GoalCardProps {
  id: string;
  title: string;
  dailyTargetMinutes: number;
  category?: string | null;
  isActive: boolean;
  todayMinutes?: number;
  onDelete: (id: string) => void;
}

export function GoalCard({
  id,
  title,
  dailyTargetMinutes,
  category,
  isActive,
  todayMinutes = 0,
  onDelete,
}: GoalCardProps) {
  const { t } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const progress = Math.min((todayMinutes / dailyTargetMinutes) * 100, 100);
  const isCompleted = todayMinutes >= dailyTargetMinutes;
  const categoryLabel = category
    ? category.startsWith('category.')
      ? t(category as any)
      : category
    : '';

  return (
    <>
      <div
        className={cn(
          "goal-card animate-slide-up",
          !isActive && "opacity-60"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                isCompleted
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              <Target className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {dailyTargetMinutes} {t('goals.minPerDay')}
                </span>
                {categoryLabel && (
                  <Badge variant="secondary" className="text-xs">
                    {categoryLabel}
                  </Badge>
                )}
                {!isActive && (
                  <Badge variant="outline" className="text-xs">
                    {t('goals.paused')}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/goals/${id}`} className="flex items-center gap-2">
                  <Edit2 className="h-4 w-4" />
                  {t('common.edit')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">{t('goals.todayProgress')}</span>
            <span className={cn("font-medium", isCompleted && "text-primary")}>
              {todayMinutes} / {dailyTargetMinutes} {t('checkin.min')}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={cn(
                "progress-bar-fill",
                isCompleted && "shadow-glow-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('goals.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('goals.deleteConfirm').replace('{title}', title)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}