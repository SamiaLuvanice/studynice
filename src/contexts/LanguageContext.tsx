import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt-BR';

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.goals': 'Goals',
    'nav.checkin': 'Check In',
    'nav.profile': 'Profile',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.todayProgress': "Today's Progress",
    'dashboard.currentStreak': 'Current Streak',
    'dashboard.bestStreak': 'Best Streak',
    'dashboard.totalMinutes': 'Total Minutes',
    'dashboard.daysCompleted': 'Days Completed',
    'dashboard.minutes': 'minutes',
    'dashboard.days': 'days',
    'dashboard.day': 'day',
    'dashboard.weeklyOverview': 'Weekly Overview',
    'dashboard.noGoals': 'No active goals yet',
    'dashboard.createGoal': 'Create your first goal to start tracking!',
    
    // Goals
    'goals.title': 'My Goals',
    'goals.create': 'Create Goal',
    'goals.edit': 'Edit Goal',
    'goals.delete': 'Delete',
    'goals.active': 'Active',
    'goals.inactive': 'Inactive',
    'goals.dailyTarget': 'Daily Target',
    'goals.minPerDay': 'min/day',
    'goals.noGoals': 'No goals yet',
    'goals.noGoalsDesc': 'Create your first study goal to start tracking your progress!',
    'goals.form.title': 'Title',
    'goals.form.titlePlaceholder': 'e.g., Learn Spanish',
    'goals.form.category': 'Category (optional)',
    'goals.form.categoryPlaceholder': 'e.g., Language, Programming',
    'goals.form.dailyTarget': 'Daily Target (minutes)',
    'goals.form.isActive': 'Active Goal',
    'goals.form.save': 'Save Goal',
    'goals.form.saving': 'Saving...',
    'goals.form.cancel': 'Cancel',
    'goals.created': 'Goal created successfully!',
    'goals.updated': 'Goal updated successfully!',
    'goals.deleted': 'Goal deleted successfully!',
    
    // Check-in
    'checkin.title': "Today's Check-in",
    'checkin.date': 'Date',
    'checkin.quickAdd': 'Quick Add',
    'checkin.custom': 'Custom',
    'checkin.minutes': 'minutes',
    'checkin.min': 'min',
    'checkin.logged': 'Logged',
    'checkin.logTime': 'Log Time',
    'checkin.noActiveGoals': 'No active goals',
    'checkin.noActiveGoalsDesc': 'Create an active goal to start checking in!',
    'checkin.success': 'Check-in saved!',
    'checkin.target': 'Target',
    'checkin.todayTotal': "Today's Total",
    
    // Profile
    'profile.title': 'Profile',
    'profile.fullName': 'Full Name',
    'profile.fullNamePlaceholder': 'Enter your name',
    'profile.email': 'Email',
    'profile.save': 'Save Changes',
    'profile.saving': 'Saving...',
    'profile.updated': 'Profile updated successfully!',
    'profile.stats': 'Your Statistics',
    
    // Auth
    'auth.login': 'Log In',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Log Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.emailPlaceholder': 'you@example.com',
    'auth.passwordPlaceholder': 'Your password',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.welcome': 'Welcome to StudyNice',
    'auth.tagline': 'Build consistent study habits, track your progress, and achieve your learning goals.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try Again',
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.of': 'of',
  },
  'pt-BR': {
    // Navigation
    'nav.dashboard': 'Painel',
    'nav.goals': 'Metas',
    'nav.checkin': 'Check-in',
    'nav.profile': 'Perfil',
    
    // Dashboard
    'dashboard.title': 'Painel',
    'dashboard.welcome': 'Bem-vindo de volta',
    'dashboard.todayProgress': 'Progresso de Hoje',
    'dashboard.currentStreak': 'Sequência Atual',
    'dashboard.bestStreak': 'Melhor Sequência',
    'dashboard.totalMinutes': 'Minutos Totais',
    'dashboard.daysCompleted': 'Dias Completos',
    'dashboard.minutes': 'minutos',
    'dashboard.days': 'dias',
    'dashboard.day': 'dia',
    'dashboard.weeklyOverview': 'Resumo Semanal',
    'dashboard.noGoals': 'Nenhuma meta ativa ainda',
    'dashboard.createGoal': 'Crie sua primeira meta para começar a acompanhar!',
    
    // Goals
    'goals.title': 'Minhas Metas',
    'goals.create': 'Criar Meta',
    'goals.edit': 'Editar Meta',
    'goals.delete': 'Excluir',
    'goals.active': 'Ativa',
    'goals.inactive': 'Inativa',
    'goals.dailyTarget': 'Meta Diária',
    'goals.minPerDay': 'min/dia',
    'goals.noGoals': 'Nenhuma meta ainda',
    'goals.noGoalsDesc': 'Crie sua primeira meta de estudo para começar a acompanhar seu progresso!',
    'goals.form.title': 'Título',
    'goals.form.titlePlaceholder': 'ex.: Aprender Espanhol',
    'goals.form.category': 'Categoria (opcional)',
    'goals.form.categoryPlaceholder': 'ex.: Idiomas, Programação',
    'goals.form.dailyTarget': 'Meta Diária (minutos)',
    'goals.form.isActive': 'Meta Ativa',
    'goals.form.save': 'Salvar Meta',
    'goals.form.saving': 'Salvando...',
    'goals.form.cancel': 'Cancelar',
    'goals.created': 'Meta criada com sucesso!',
    'goals.updated': 'Meta atualizada com sucesso!',
    'goals.deleted': 'Meta excluída com sucesso!',
    
    // Check-in
    'checkin.title': 'Check-in de Hoje',
    'checkin.date': 'Data',
    'checkin.quickAdd': 'Adicionar Rápido',
    'checkin.custom': 'Personalizado',
    'checkin.minutes': 'minutos',
    'checkin.min': 'min',
    'checkin.logged': 'Registrado',
    'checkin.logTime': 'Registrar Tempo',
    'checkin.noActiveGoals': 'Nenhuma meta ativa',
    'checkin.noActiveGoalsDesc': 'Crie uma meta ativa para começar a fazer check-in!',
    'checkin.success': 'Check-in salvo!',
    'checkin.target': 'Meta',
    'checkin.todayTotal': 'Total de Hoje',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.fullName': 'Nome Completo',
    'profile.fullNamePlaceholder': 'Digite seu nome',
    'profile.email': 'E-mail',
    'profile.save': 'Salvar Alterações',
    'profile.saving': 'Salvando...',
    'profile.updated': 'Perfil atualizado com sucesso!',
    'profile.stats': 'Suas Estatísticas',
    
    // Auth
    'auth.login': 'Entrar',
    'auth.signup': 'Cadastrar',
    'auth.logout': 'Sair',
    'auth.email': 'E-mail',
    'auth.password': 'Senha',
    'auth.emailPlaceholder': 'voce@exemplo.com',
    'auth.passwordPlaceholder': 'Sua senha',
    'auth.noAccount': 'Não tem uma conta?',
    'auth.hasAccount': 'Já tem uma conta?',
    'auth.welcome': 'Bem-vindo ao StudyNice',
    'auth.tagline': 'Construa hábitos de estudo consistentes, acompanhe seu progresso e alcance suas metas de aprendizado.',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Algo deu errado',
    'common.retry': 'Tentar Novamente',
    'common.back': 'Voltar',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.create': 'Criar',
    'common.of': 'de',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('studynice-language');
    return (stored as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('studynice-language', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
