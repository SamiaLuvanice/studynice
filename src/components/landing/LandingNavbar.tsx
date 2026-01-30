import { Link } from 'react-router-dom';
import { Moon, Sun, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OwlLogo } from '@/components/brand/OwlLogo';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function LandingNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt-BR' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <OwlLogo size={36} />
          <span className="text-xl font-bold text-foreground">StudyNice</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-muted-foreground hover:text-foreground gap-1.5"
            title={language === 'en' ? 'Switch to Português' : 'Switch to English'}
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium">{language === 'en' ? 'EN' : 'PT'}</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <div className="hidden sm:flex items-center gap-2 ml-2">
            <Button variant="ghost" asChild>
              <Link to="/login">{t('auth.signin')}</Link>
            </Button>
            <Button asChild>
              <Link to="/login">{t('auth.getStarted')}</Link>
            </Button>
          </div>

          {/* Mobile: just Get Started */}
          <div className="sm:hidden">
            <Button size="sm" asChild>
              <Link to="/login">{t('auth.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
