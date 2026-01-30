import { Shield, Lock, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function TrustSection() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Lock className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {t('landing.trustTitle')}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t('landing.trustDesc')}
          </p>
        </div>
      </div>
    </section>
  );
}
