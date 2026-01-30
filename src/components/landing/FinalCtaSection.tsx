import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function FinalCtaSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="container">
        <div className="relative max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 md:p-12 text-center overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('landing.finalCtaTitle')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              {t('landing.finalCtaSubtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link to="/login">
                  {t('landing.ctaPrimary')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              {t('landing.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('auth.signin')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
