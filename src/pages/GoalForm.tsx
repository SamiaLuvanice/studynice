import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const categoryKeys = [
  'category.mathematics',
  'category.science',
  'category.languages',
  'category.programming',
  'category.arts',
  'category.music',
  'category.history',
  'category.literature',
  'category.other',
] as const;

export default function GoalForm() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    daily_target_minutes: 30,
    category: '',
    is_active: true,
  });

  useEffect(() => {
    if (isEditing && user) {
      fetchGoal();
    }
  }, [id, user]);

  const fetchGoal = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single();

      if (error) throw error;
      if (!data) {
        toast.error(t('common.error'));
        navigate('/goals');
        return;
      }

      const normalizedCategory = data.category
        ? categoryKeys.includes(data.category as (typeof categoryKeys)[number])
          ? data.category
          : categoryKeys.find((key) => t(key) === data.category) || ''
        : '';

      setFormData({
        title: data.title,
        daily_target_minutes: data.daily_target_minutes,
        category: normalizedCategory,
        is_active: data.is_active,
      });
    } catch (error) {
      console.error('Error fetching goal:', error);
      toast.error(t('common.error'));
      navigate('/goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const goalData = {
        title: formData.title,
        daily_target_minutes: formData.daily_target_minutes,
        category: formData.category || null,
        is_active: formData.is_active,
        user_id: user.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('goals')
          .update(goalData)
          .eq('id', id);
        if (error) throw error;
        toast.success(t('goals.updated'));
      } else {
        const { error } = await supabase.from('goals').insert(goalData);
        if (error) throw error;
        toast.success(t('goals.created'));
      }

      navigate('/goals');
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error(t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-lg space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/goals')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? t('goals.edit') : t('goals.create')}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? t('goals.form.editSubtitle') : t('goals.form.createSubtitle')}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('goals.form.title')}</Label>
              <Input
                id="title"
                placeholder={t('goals.form.titlePlaceholder')}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">{t('goals.form.dailyTarget')}</Label>
              <Input
                id="target"
                type="number"
                min="5"
                max="480"
                value={formData.daily_target_minutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    daily_target_minutes: parseInt(e.target.value) || 30,
                  })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('goals.form.dailyTargetHint')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('goals.form.category')}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
              <SelectTrigger>
                  <SelectValue placeholder={t('goals.form.categoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {categoryKeys.map((catKey) => (
                    <SelectItem key={catKey} value={catKey}>
                      {t(catKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="active" className="font-medium">
                  {t('goals.form.isActive')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('goals.form.isActiveHint')
                  }
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/goals')}
            >
              {t('goals.form.cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('goals.form.save')
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
