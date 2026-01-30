import { Link } from 'react-router-dom';
import { OwlLogo } from '@/components/brand/OwlLogo';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="flex items-center gap-2">
              <OwlLogo size={32} />
              <span className="text-lg font-bold text-foreground">StudyNice</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              StudyNice © {currentYear}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.footerGithub')}
            </a>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.footerPrivacy')}
            </Link>
            <Link
              to="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('landing.footerContact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
