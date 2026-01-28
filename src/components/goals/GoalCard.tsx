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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const progress = Math.min((todayMinutes / dailyTargetMinutes) * 100, 100);
  const isCompleted = todayMinutes >= dailyTargetMinutes;

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
                  {dailyTargetMinutes} min/day
                </span>
                {category && (
                  <Badge variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                )}
                {!isActive && (
                  <Badge variant="outline" className="text-xs">
                    Paused
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
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Today's progress</span>
            <span className={cn("font-medium", isCompleted && "text-primary")}>
              {todayMinutes} / {dailyTargetMinutes} min
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
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title}"? This will also delete all
              related check-ins. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
