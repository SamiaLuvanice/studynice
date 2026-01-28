import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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

const categories = [
  'Mathematics',
  'Science',
  'Languages',
  'Programming',
  'Arts',
  'Music',
  'History',
  'Literature',
  'Other',
];

export default function GoalForm() {
  const { user } = useAuth();
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
        toast.error('Goal not found');
        navigate('/goals');
        return;
      }

      setFormData({
        title: data.title,
        daily_target_minutes: data.daily_target_minutes,
        category: data.category || '',
        is_active: data.is_active,
      });
    } catch (error) {
      console.error('Error fetching goal:', error);
      toast.error('Failed to load goal');
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
        toast.success('Goal updated!');
      } else {
        const { error } = await supabase.from('goals').insert(goalData);
        if (error) throw error;
        toast.success('Goal created!');
      }

      navigate('/goals');
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
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
              {isEditing ? 'Edit Goal' : 'New Goal'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update your study goal' : 'Create a new study goal'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="e.g., Learn Spanish"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Daily Target (minutes)</Label>
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
                Recommended: 30-60 minutes for sustainable habits
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="active" className="font-medium">
                  Active Goal
                </Label>
                <p className="text-sm text-muted-foreground">
                  Inactive goals won't count towards your daily target
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
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                'Update Goal'
              ) : (
                'Create Goal'
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
