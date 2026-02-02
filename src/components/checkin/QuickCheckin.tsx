import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface QuickCheckinProps {
  goalId: string;
  goalTitle: string;
  currentMinutes: number;
  targetMinutes: number;
  onAddMinutes: (goalId: string, minutes: number) => Promise<void>;
}

const quickAmounts = [15, 30, 45, 60];

export function QuickCheckin({
  goalId,
  goalTitle,
  currentMinutes,
  targetMinutes,
  onAddMinutes,
}: QuickCheckinProps) {
  const { t } = useLanguage();
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animatingButton, setAnimatingButton] = useState<number | null>(null);

  const progress = Math.min((currentMinutes / targetMinutes) * 100, 100);
  const isCompleted = currentMinutes >= targetMinutes;

  const handleQuickAdd = async (minutes: number) => {
    setIsLoading(true);
    setAnimatingButton(minutes);
    try {
      await onAddMinutes(goalId, minutes);
      const successMsg = t('checkin.addedSuccess')
        .replace('{minutes}', String(minutes))
        .replace('{goal}', goalTitle);
      toast.success(successMsg);
    } catch (error) {
      toast.error(t('checkin.addFailed'));
    } finally {
      setIsLoading(false);
      setTimeout(() => setAnimatingButton(null), 300);
    }
  };

  const handleCustomAdd = async () => {
    const minutes = parseInt(customMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      toast.error(t('checkin.invalidMinutes'));
      return;
    }
    setIsLoading(true);
    try {
      await onAddMinutes(goalId, minutes);
      const successMsg = t('checkin.addedSuccess')
        .replace('{minutes}', String(minutes))
        .replace('{goal}', goalTitle);
      toast.success(successMsg);
      setShowCustomDialog(false);
      setCustomMinutes('');
    } catch (error) {
      toast.error(t('checkin.addFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const minTodayText = t('checkin.minToday')
    .replace('{current}', String(currentMinutes))
    .replace('{target}', String(targetMinutes));

  return (
    <div className="goal-card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{goalTitle}</h3>
          <p className="text-sm text-muted-foreground">
            {minTodayText}
          </p>
        </div>
        {isCompleted && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
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

      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-2">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleQuickAdd(amount)}
            disabled={isLoading}
            className={cn(
              "quick-action flex-1 min-w-[70px]",
              animatingButton === amount && "celebrate bg-primary text-primary-foreground"
            )}
          >
            +{amount} {t('checkin.min')}
          </button>
        ))}
        <button
          onClick={() => setShowCustomDialog(true)}
          disabled={isLoading}
          className="quick-action"
        >
          <Plus className="h-4 w-4" />
          {t('checkin.custom')}
        </button>
      </div>

      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('checkin.addMinutes')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="number"
              placeholder={t('checkin.enterMinutes')}
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              min="1"
              className="text-lg"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCustomAdd} disabled={isLoading}>
              {t('checkin.addMinutesBtn')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
