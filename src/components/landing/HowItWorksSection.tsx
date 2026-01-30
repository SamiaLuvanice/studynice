import { Target, CheckSquare, Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const steps = [
  {
    icon: Target,
    titleKey: 'landing.step1Title',
    descKey: 'landing.step1Desc',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: CheckSquare,
    titleKey: 'landing.step2Title',
    descKey: 'landing.step2Desc',
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    icon: Flame,
    titleKey: 'landing.step3Title',
    descKey: 'landing.step3Desc',
    color: 'bg-amber-500/10 text-amber-500',
  },
] as const;

export function HowItWorksSection() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('landing.howItWorks')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
                )}
                
                <div className="relative flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`p-4 rounded-2xl ${step.color} mb-6`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
