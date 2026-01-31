import { Target, Flame, BarChart3, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  {
    icon: Target,
    titleKey: 'landing.feature1Title',
    descKey: 'landing.feature1Desc',
    color: 'text-primary',
  },
  {
    icon: Flame,
    titleKey: 'landing.feature2Title',
    descKey: 'landing.feature2Desc',
    color: 'text-amber-500',
  },
  {
    icon: BarChart3,
    titleKey: 'landing.feature3Title',
    descKey: 'landing.feature3Desc',
    color: 'text-emerald-500',
  },
  {
    icon: Shield,
    titleKey: 'landing.feature4Title',
    descKey: 'landing.feature4Desc',
    color: 'text-blue-500',
  },
] as const;

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('landing.featuresTitle')}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`p-3 rounded-xl bg-secondary/30 w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
