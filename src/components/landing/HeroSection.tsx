import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Target, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              {t('landing.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              {t('landing.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/login">
                  {t('landing.ctaPrimary')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <a href="#how-it-works">
                  {t('landing.ctaSecondary')}
                </a>
              </Button>
            </div>
          </div>

          {/* Right: Hero illustration - cards mockup */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Streak card */}
              <Card className="absolute -top-4 -left-4 p-4 shadow-lg border-2 border-primary/20 bg-card animate-pulse-slow">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-500/10">
                    <Flame className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold text-foreground">14 days</p>
                  </div>
                </div>
              </Card>

              {/* Main dashboard card */}
              <Card className="p-6 shadow-xl bg-card border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Today's Progress</h3>
                    <span className="text-primary font-bold">85%</span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">51</p>
                      <p className="text-xs text-muted-foreground">minutes today</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">60</p>
                      <p className="text-xs text-muted-foreground">target</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Goal card */}
              <Card className="absolute -bottom-4 -right-4 p-4 shadow-lg border-2 border-primary/20 bg-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Learn Spanish</p>
                    <p className="text-xs text-muted-foreground">30 min/day</p>
                  </div>
                </div>
              </Card>

              {/* Chart decoration */}
              <div className="absolute top-1/2 -right-8 p-3 rounded-lg bg-card shadow-md border">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
