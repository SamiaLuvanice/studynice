import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Square, RotateCcw, Save, Clock, Target } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { useTimer, formatTime, secondsToMinutes } from '@/hooks/useTimer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
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

interface Goal {
  id: string;
  title: string;
  daily_target_minutes: number;
  category: string | null;
}

const Timer = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    state,
    goalId,
    displaySeconds,
    start,
    pause,
    resume,
    stop,
    reset,
    getSessionData,
    hasActiveSession,
  } = useTimer();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingGoalId, setPendingGoalId] = useState<string>('');

  // Fetch active goals
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('goals')
        .select('id, title, daily_target_minutes, category')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('title');

      if (error) {
        console.error('Error fetching goals:', error);
      } else {
        setGoals(data || []);
        // If there's an active session, set the selected goal
        if (goalId) {
          setSelectedGoalId(goalId);
        } else if (data && data.length > 0) {
          setSelectedGoalId(data[0].id);
        }
      }
      setLoading(false);
    };

    fetchGoals();
  }, [user, goalId]);

  // Warn user before leaving with active timer
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state === 'running') {
        e.preventDefault();
        e.returnValue = t('timer.warningNavigate');
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state, t]);

  const handleGoalChange = (newGoalId: string) => {
    if (hasActiveSession && newGoalId !== goalId) {
      setPendingGoalId(newGoalId);
      setShowDiscardDialog(true);
    } else {
      setSelectedGoalId(newGoalId);
    }
  };

  const confirmDiscardSession = () => {
    reset();
    setSelectedGoalId(pendingGoalId);
    setShowDiscardDialog(false);
    setPendingGoalId('');
  };

  const handleStart = () => {
    if (!selectedGoalId) return;
    start(selectedGoalId);
  };

  const handleSave = async () => {
    const sessionData = getSessionData();
    if (!sessionData || !user) return;

    setSaving(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const minutes = secondsToMinutes(sessionData.durationSeconds);

    try {
      // 1. Insert study session
      const { error: sessionError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          goal_id: sessionData.goalId,
          session_date: today,
          started_at: sessionData.startedAt.toISOString(),
          ended_at: new Date().toISOString(),
          duration_seconds: sessionData.durationSeconds,
          notes: notes.trim() || null,
        });

      if (sessionError) throw sessionError;

      // 2. Update or create check-in for today
      const { data: existingCheckin } = await supabase
        .from('checkins')
        .select('id, minutes_studied')
        .eq('goal_id', sessionData.goalId)
        .eq('checkin_date', today)
        .maybeSingle();

      if (existingCheckin) {
        // Update existing check-in
        await supabase
          .from('checkins')
          .update({
            minutes_studied: existingCheckin.minutes_studied + minutes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingCheckin.id);
      } else {
        // Create new check-in
        await supabase
          .from('checkins')
          .insert({
            user_id: user.id,
            goal_id: sessionData.goalId,
            checkin_date: today,
            minutes_studied: minutes,
          });
      }

      toast({
        title: t('timer.success'),
        description: `${minutes} ${t('timer.minutes')}`,
      });

      reset();
      setNotes('');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving session:', error);
      toast({
        title: t('common.error'),
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getStateLabel = () => {
    switch (state) {
      case 'idle':
        return t('timer.stateIdle');
      case 'running':
        return t('timer.stateRunning');
      case 'paused':
        return t('timer.statePaused');
      case 'finished':
        return t('timer.stateFinished');
      default:
        return '';
    }
  };

  const getStateColor = () => {
    switch (state) {
      case 'running':
        return 'text-emerald-500';
      case 'paused':
        return 'text-amber-500';
      case 'finished':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const selectedGoal = goals.find((g) => g.id === (goalId || selectedGoalId));

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (goals.length === 0) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('timer.noActiveGoals')}
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                {t('timer.noActiveGoalsDesc')}
              </p>
              <Button onClick={() => navigate('/goals/new')}>
                {t('goals.create')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t('timer.title')}</h1>

        {/* Goal Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t('timer.selectGoal')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={goalId || selectedGoalId}
              onValueChange={handleGoalChange}
              disabled={state === 'running'}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('timer.selectGoalPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    <div className="flex items-center gap-2">
                      <span>{goal.title}</span>
                      {goal.category && (
                        <span className="text-xs text-muted-foreground">
                          ({goal.category})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedGoal && (
              <p className="text-sm text-muted-foreground mt-2">
                {t('checkin.target')}: {selectedGoal.daily_target_minutes} {t('checkin.min')}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Timer Display */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8">
            <div className="text-center">
              {/* State indicator */}
              <p className={`text-sm font-medium mb-4 ${getStateColor()}`}>
                {getStateLabel()}
              </p>

              {/* Timer display */}
              <div className="font-mono text-6xl md:text-7xl font-bold text-foreground tracking-wider mb-8">
                {formatTime(displaySeconds)}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {state === 'idle' && (
                  <Button
                    size="lg"
                    className="gap-2 px-8"
                    onClick={handleStart}
                    disabled={!selectedGoalId}
                  >
                    <Play className="h-5 w-5" />
                    {t('timer.start')}
                  </Button>
                )}

                {state === 'running' && (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2"
                      onClick={pause}
                    >
                      <Pause className="h-5 w-5" />
                      {t('timer.pause')}
                    </Button>
                    <Button
                      size="lg"
                      variant="destructive"
                      className="gap-2"
                      onClick={stop}
                    >
                      <Square className="h-5 w-5" />
                      {t('timer.stop')}
                    </Button>
                  </>
                )}

                {state === 'paused' && (
                  <>
                    <Button
                      size="lg"
                      className="gap-2"
                      onClick={resume}
                    >
                      <Play className="h-5 w-5" />
                      {t('timer.resume')}
                    </Button>
                    <Button
                      size="lg"
                      variant="destructive"
                      className="gap-2"
                      onClick={stop}
                    >
                      <Square className="h-5 w-5" />
                      {t('timer.stop')}
                    </Button>
                  </>
                )}

                {state === 'finished' && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                    onClick={reset}
                  >
                    <RotateCcw className="h-5 w-5" />
                    {t('timer.reset')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Save Session (only when finished) */}
        {state === 'finished' && displaySeconds > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t('timer.sessionDuration')}: {secondsToMinutes(displaySeconds)} {t('checkin.min')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {t('timer.notes')}
                </label>
                <Textarea
                  placeholder={t('timer.notesPlaceholder')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                className="w-full gap-2"
                size="lg"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('timer.saving')}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {t('timer.save')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Discard Session Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('timer.discardConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('timer.discardDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('timer.keepSession')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDiscardSession}>
              {t('timer.discard')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Timer;
