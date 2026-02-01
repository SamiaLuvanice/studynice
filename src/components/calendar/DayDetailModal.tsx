import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDayCheckins, useActiveGoals, useUpsertCheckin, useUpdateCheckin, CheckinWithGoal } from '@/hooks/useCalendarData';
import { formatDateDisplay } from '@/lib/date-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Check, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  dateString: string;
}

export function DayDetailModal({ open, onOpenChange, date, dateString }: DayDetailModalProps) {
  const { language, t } = useLanguage();
  const { data: checkins = [], isLoading: checkinsLoading } = useDayCheckins(dateString);
  const { data: goals = [], isLoading: goalsLoading } = useActiveGoals();
  const upsertCheckin = useUpsertCheckin();
  const updateCheckin = useUpdateCheckin();

  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [minutesToAdd, setMinutesToAdd] = useState<string>('');
  const [editingCheckinId, setEditingCheckinId] = useState<string | null>(null);
  const [editMinutes, setEditMinutes] = useState<string>('');

  const formattedDate = formatDateDisplay(date, 'PPPP', language);
  
  // Goals that don't have a checkin yet for this day
  const goalsWithoutCheckin = goals.filter(
    g => !checkins.some(c => c.goal_id === g.id)
  );

  const handleAddMinutes = async () => {
    if (!selectedGoalId || !minutesToAdd) return;
    
    const minutes = parseInt(minutesToAdd, 10);
    if (isNaN(minutes) || minutes <= 0) return;

    await upsertCheckin.mutateAsync({
      goalId: selectedGoalId,
      date: dateString,
      minutes,
    });

    setSelectedGoalId('');
    setMinutesToAdd('');
  };

  const handleUpdateCheckin = async (checkin: CheckinWithGoal) => {
    const minutes = parseInt(editMinutes, 10);
    if (isNaN(minutes) || minutes < 0) return;

    await updateCheckin.mutateAsync({
      checkinId: checkin.id,
      minutes,
      date: dateString,
    });

    setEditingCheckinId(null);
    setEditMinutes('');
  };

  const startEditing = (checkin: CheckinWithGoal) => {
    setEditingCheckinId(checkin.id);
    setEditMinutes(checkin.minutes_studied.toString());
  };

  const cancelEditing = () => {
    setEditingCheckinId(null);
    setEditMinutes('');
  };

  const totalMinutes = checkins.reduce((sum, c) => sum + c.minutes_studied, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold capitalize">
            {formattedDate}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {totalMinutes} {t('checkin.min')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">
                {checkins.length} {t('calendar.goals')}
              </span>
            </div>
          </div>

          {/* Existing check-ins */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t('calendar.loggedCheckins')}
            </Label>
            
            {checkinsLoading ? (
              <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
            ) : checkins.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                {t('calendar.noCheckins')}
              </div>
            ) : (
              <div className="space-y-2">
                {checkins.map((checkin) => (
                  <Card key={checkin.id} className="border-border/50">
                    <CardContent className="p-3">
                      {editingCheckinId === checkin.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium flex-1 truncate">
                            {checkin.goal_title}
                          </span>
                          <Input
                            type="number"
                            value={editMinutes}
                            onChange={(e) => setEditMinutes(e.target.value)}
                            className="w-20 h-8 text-sm"
                            min="0"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateCheckin(checkin)}
                            disabled={updateCheckin.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEditing}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">
                            {checkin.goal_title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {checkin.minutes_studied} {t('checkin.min')}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditing(checkin)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add new check-in */}
          <div className="space-y-2 border-t pt-4">
            <Label className="text-sm font-medium">
              {t('calendar.addMinutes')}
            </Label>
            
            {goalsLoading ? (
              <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
            ) : goals.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                {t('checkin.noActiveGoals')}
              </div>
            ) : (
              <div className="space-y-3">
                <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('timer.selectGoalPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => {
                      const existingCheckin = checkins.find(c => c.goal_id === goal.id);
                      return (
                        <SelectItem key={goal.id} value={goal.id}>
                          <span className={cn(existingCheckin && "text-muted-foreground")}>
                            {goal.title}
                            {existingCheckin && ` (${existingCheckin.minutes_studied}m)`}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={minutesToAdd}
                    onChange={(e) => setMinutesToAdd(e.target.value)}
                    placeholder={t('checkin.enterMinutes')}
                    min="1"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddMinutes}
                    disabled={!selectedGoalId || !minutesToAdd || upsertCheckin.isPending}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t('checkin.addMinutesBtn')}
                  </Button>
                </div>

                {/* Quick add buttons */}
                <div className="flex flex-wrap gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <Button
                      key={mins}
                      variant="outline"
                      size="sm"
                      onClick={() => setMinutesToAdd(mins.toString())}
                      className="text-xs"
                    >
                      +{mins} {t('checkin.min')}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
