import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt-BR';

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.goals': 'Goals',
    'nav.checkin': 'Check In',
    'nav.profile': 'Profile',
    'nav.calendar': 'Calendar',
    
    // Calendar
    'calendar.subtitle': 'View your study history and log past sessions',
    'calendar.completed': 'Completed',
    'calendar.partial': 'Partial',
    'calendar.noActivity': 'No activity',
    'calendar.today': 'Today',
    'calendar.goals': 'goals',
    'calendar.loggedCheckins': 'Logged Check-ins',
    'calendar.noCheckins': 'No check-ins on this day',
    'calendar.addMinutes': 'Add minutes',
    'nav.timer': 'Timer',
    
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
    'dashboard.ofMinutes': 'of {target} min',
    'dashboard.minToGo': '{remaining} min to go',
    'dashboard.goalCompleted': '🎉 Goal completed!',
    'dashboard.completed': 'Completed',
    'dashboard.target': 'Target',
    
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
    'checkin.minToday': '{current} / {target} min today',
    'checkin.addMinutes': 'Add Custom Minutes',
    'checkin.enterMinutes': 'Enter minutes',
    'checkin.addedSuccess': 'Added {minutes} minutes to {goal}!',
    'checkin.addFailed': 'Failed to add minutes',
    'checkin.invalidMinutes': 'Please enter a valid number of minutes',
    'checkin.addMinutesBtn': 'Add Minutes',
    
    // Timer
    'timer.title': 'Study Timer',
    'timer.selectGoal': 'Select a goal',
    'timer.selectGoalPlaceholder': 'Choose which goal to track...',
    'timer.start': 'Start',
    'timer.pause': 'Pause',
    'timer.resume': 'Resume',
    'timer.stop': 'Stop',
    'timer.reset': 'Reset',
    'timer.save': 'Save Session',
    'timer.saving': 'Saving...',
    'timer.notesPlaceholder': 'Add notes about this session (optional)',
    'timer.notes': 'Session Notes',
    'timer.stateIdle': 'Ready to start',
    'timer.stateRunning': 'Timer running...',
    'timer.statePaused': 'Paused',
    'timer.stateFinished': 'Session complete!',
    'timer.sessionDuration': 'Session Duration',
    'timer.noActiveGoals': 'No active goals',
    'timer.noActiveGoalsDesc': 'Create an active goal to use the timer!',
    'timer.success': 'Study session saved!',
    'timer.warningNavigate': 'Timer is still running. Are you sure you want to leave?',
    'timer.minutes': 'minutes recorded',
    'timer.discardConfirm': 'Discard current session?',
    'timer.discardDesc': 'You have an active timer session. Starting a new one will discard the current progress.',
    'timer.discard': 'Discard',
    'timer.keepSession': 'Keep Session',
    
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
    'auth.signin': 'Sign in',
    'auth.getStarted': 'Get started',
    
    // Landing Page
    'landing.heroTitle': 'Build a daily study streak that actually sticks.',
    'landing.heroSubtitle': 'Track your study goals, build consistent habits, and watch your progress grow with our motivating streak system.',
    'landing.ctaPrimary': 'Create free account',
    'landing.ctaSecondary': 'See how it works',
    'landing.howItWorks': 'How It Works',
    'landing.step1Title': 'Set Your Goals',
    'landing.step1Desc': 'Create study goals with daily minute targets. Language learning, coding, music — anything you want to master.',
    'landing.step2Title': 'Check In Daily',
    'landing.step2Desc': 'Log your study time each day with quick-add buttons. It takes just seconds to record your progress.',
    'landing.step3Title': 'Build Your Streak',
    'landing.step3Desc': 'Meet your daily targets to build an unbreakable streak. Watch your consistency grow over time.',
    'landing.featuresTitle': 'Everything you need to stay consistent',
    'landing.feature1Title': 'Daily Goals',
    'landing.feature1Desc': 'Set personalized minute targets for each subject or skill you want to develop.',
    'landing.feature2Title': 'Streak System',
    'landing.feature2Desc': 'Build momentum with our motivating streak counter. Miss a day? We help you get back on track.',
    'landing.feature3Title': 'Visual Analytics',
    'landing.feature3Desc': 'See your progress with beautiful charts. Track weekly trends and celebrate milestones.',
    'landing.feature4Title': 'Private & Secure',
    'landing.feature4Desc': 'Your data belongs to you. Enterprise-grade security with row-level protection.',
    'landing.trustTitle': 'Built with security in mind',
    'landing.trustDesc': 'Your study data is private and protected with enterprise-grade security. We use row-level security to ensure only you can access your information.',
    'landing.finalCtaTitle': "Start building your streak today — it's free.",
    'landing.finalCtaSubtitle': 'Join thousands of learners who are building better study habits.',
    'landing.alreadyHaveAccount': 'Already have an account?',
    'landing.footerPrivacy': 'Privacy',
    'landing.footerContact': 'Contact',
    'landing.footerGithub': 'GitHub',
    
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
    'nav.timer': 'Timer',
    'nav.calendar': 'Calendário',
    
    // Calendar
    'calendar.subtitle': 'Veja seu histórico de estudos e registre sessões passadas',
    'calendar.completed': 'Completo',
    'calendar.partial': 'Parcial',
    'calendar.noActivity': 'Sem atividade',
    'calendar.today': 'Hoje',
    'calendar.goals': 'metas',
    'calendar.loggedCheckins': 'Check-ins registrados',
    'calendar.noCheckins': 'Nenhum check-in neste dia',
    'calendar.addMinutes': 'Adicionar minutos',
    
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
    'dashboard.ofMinutes': 'de {target} min',
    'dashboard.minToGo': '{remaining} min restantes',
    'dashboard.goalCompleted': '🎉 Meta concluída!',
    'dashboard.completed': 'Concluído',
    'dashboard.target': 'Meta',
    
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
    'checkin.minToday': '{current} / {target} min hoje',
    'checkin.addMinutes': 'Adicionar Minutos Personalizados',
    'checkin.enterMinutes': 'Digite os minutos',
    'checkin.addedSuccess': 'Adicionado {minutes} minutos em {goal}!',
    'checkin.addFailed': 'Falha ao adicionar minutos',
    'checkin.invalidMinutes': 'Por favor, digite um número válido de minutos',
    'checkin.addMinutesBtn': 'Adicionar Minutos',
    
    // Timer
    'timer.title': 'Timer de Estudo',
    'timer.selectGoal': 'Selecione uma meta',
    'timer.selectGoalPlaceholder': 'Escolha qual meta acompanhar...',
    'timer.start': 'Iniciar',
    'timer.pause': 'Pausar',
    'timer.resume': 'Continuar',
    'timer.stop': 'Parar',
    'timer.reset': 'Resetar',
    'timer.save': 'Salvar Sessão',
    'timer.saving': 'Salvando...',
    'timer.notesPlaceholder': 'Adicione notas sobre esta sessão (opcional)',
    'timer.notes': 'Notas da Sessão',
    'timer.stateIdle': 'Pronto para começar',
    'timer.stateRunning': 'Timer rodando...',
    'timer.statePaused': 'Pausado',
    'timer.stateFinished': 'Sessão completa!',
    'timer.sessionDuration': 'Duração da Sessão',
    'timer.noActiveGoals': 'Nenhuma meta ativa',
    'timer.noActiveGoalsDesc': 'Crie uma meta ativa para usar o timer!',
    'timer.success': 'Sessão de estudo salva!',
    'timer.warningNavigate': 'O timer ainda está rodando. Tem certeza que deseja sair?',
    'timer.minutes': 'minutos registrados',
    'timer.discardConfirm': 'Descartar sessão atual?',
    'timer.discardDesc': 'Você tem uma sessão ativa. Iniciar uma nova irá descartar o progresso atual.',
    'timer.discard': 'Descartar',
    'timer.keepSession': 'Manter Sessão',
    
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
    'auth.signin': 'Entrar',
    'auth.getStarted': 'Começar',
    
    // Landing Page
    'landing.heroTitle': 'Construa uma sequência de estudos diária que realmente funciona.',
    'landing.heroSubtitle': 'Acompanhe suas metas de estudo, crie hábitos consistentes e veja seu progresso crescer com nosso sistema de sequências motivador.',
    'landing.ctaPrimary': 'Criar conta grátis',
    'landing.ctaSecondary': 'Veja como funciona',
    'landing.howItWorks': 'Como Funciona',
    'landing.step1Title': 'Defina Suas Metas',
    'landing.step1Desc': 'Crie metas de estudo com alvos diários em minutos. Idiomas, programação, música — qualquer coisa que você queira dominar.',
    'landing.step2Title': 'Faça Check-in Diário',
    'landing.step2Desc': 'Registre seu tempo de estudo cada dia com botões de adição rápida. Leva apenas segundos para registrar seu progresso.',
    'landing.step3Title': 'Construa Sua Sequência',
    'landing.step3Desc': 'Atinja suas metas diárias para construir uma sequência imbatível. Veja sua consistência crescer ao longo do tempo.',
    'landing.featuresTitle': 'Tudo que você precisa para manter a consistência',
    'landing.feature1Title': 'Metas Diárias',
    'landing.feature1Desc': 'Defina alvos personalizados em minutos para cada matéria ou habilidade que você quer desenvolver.',
    'landing.feature2Title': 'Sistema de Sequência',
    'landing.feature2Desc': 'Construa impulso com nosso contador de sequência motivador. Perdeu um dia? Ajudamos você a voltar ao ritmo.',
    'landing.feature3Title': 'Analytics Visuais',
    'landing.feature3Desc': 'Veja seu progresso com gráficos bonitos. Acompanhe tendências semanais e celebre conquistas.',
    'landing.feature4Title': 'Privado e Seguro',
    'landing.feature4Desc': 'Seus dados pertencem a você. Segurança de nível empresarial com proteção em nível de linha.',
    'landing.trustTitle': 'Construído com segurança em mente',
    'landing.trustDesc': 'Seus dados de estudo são privados e protegidos com segurança de nível empresarial. Usamos segurança em nível de linha para garantir que apenas você possa acessar suas informações.',
    'landing.finalCtaTitle': 'Comece a construir sua sequência hoje — é grátis.',
    'landing.finalCtaSubtitle': 'Junte-se a milhares de estudantes que estão construindo melhores hábitos de estudo.',
    'landing.alreadyHaveAccount': 'Já tem uma conta?',
    'landing.footerPrivacy': 'Privacidade',
    'landing.footerContact': 'Contato',
    'landing.footerGithub': 'GitHub',
    
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
