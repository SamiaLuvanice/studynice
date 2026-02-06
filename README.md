# 🦉 StudyNice

**StudyNice** é uma aplicação de gestão de estudos e produtividade que ajuda você a definir metas, acompanhar progresso diário, manter streaks e visualizar estatísticas de desempenho.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Banco de Dados](#banco-de-dados)
- [Integração N8N](#integração-n8n)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Testes](#testes)
- [Customização](#customização)
- [Implementações Futuras](#implementações-futuras-roadmap)

---

## 🎯 Visão Geral

O **StudyNice** permite que usuários:
- Criem e gerenciem **metas de estudo** com objetivos diários em minutos
- Registrem **check-ins diários** para acompanhar progresso
- Utilizem um **timer Pomodoro** para sessões de estudo focadas
- Visualizem **estatísticas** como streaks, total de minutos estudados e gráficos semanais
- Acompanhem seu desempenho em um **calendário** visual
- Recebam **notificações automáticas** via integração com N8N (email, Discord, etc.)

## ✨ Funcionalidades

### 🏠 Landing Page
- Apresentação do produto com seções de features, "como funciona" e depoimentos
- Navegação responsiva com suporte a temas claro/escuro
- Internacionalização (PT-BR/EN)

### 🎯 Gestão de Metas
- Criação de metas com título, categoria e tempo diário alvo
- Edição e arquivamento de metas
- Visualização de progresso por meta

### ✅ Check-ins Diários
- Registro rápido de minutos estudados
- Associação a metas específicas
- Interface intuitiva para marcar conclusão de atividades

### ⏱️ Timer Pomodoro
- Timer configurável para sessões de estudo
- Pausar, retomar e finalizar sessões
- Salvamento manual do tempo estudado ao finalizar

### 📊 Dashboard
- Visão geral do progresso do dia
- Indicadores de streak atual e recorde
- Gráfico semanal de desempenho
- Total de minutos acumulados

### 📅 Calendário
- Visualização mensal de dias com check-ins
- Detalhamento de atividades por dia
- Marcação visual de dias completos

### 👤 Perfil
- Gerenciamento de dados pessoais
- Atualização de nome

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router v6** - Roteamento
- **TanStack Query** - Gerenciamento de estado server-side
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI baseados em Radix UI
- **Recharts** - Biblioteca de gráficos
- **date-fns** - Manipulação de datas
- **Lucide React** - Ícones
- **React Hook Form + Zod** - Formulários e validação

### Backend & Database
- **Supabase** - Backend as a Service (PostgreSQL + Auth + Storage)
  - Autenticação de usuários
  - Banco de dados relacional
  - Row Level Security (RLS)
  - Triggers e funções PostgreSQL

### Automação
- **N8N** - Plataforma de automação de workflows
  - Webhooks para eventos do sistema
  - Notificações por email/Discord/etc.

### Testing
- **Vitest** - Framework de testes
- **Testing Library** - Utilitários para testes de componentes

## 📁 Estrutura do Projeto

```
studynice/
├── public/                    # Arquivos estáticos
│   ├── favicon.svg           # Logo da coruja do StudyNice
│   └── robots.txt
│
├── src/
│   ├── components/           # Componentes React
│   │   ├── brand/           # Logo e branding
│   │   ├── calendar/        # Componentes do calendário
│   │   ├── charts/          # Gráficos e visualizações
│   │   ├── checkin/         # Check-in rápido
│   │   ├── dashboard/       # Widgets do dashboard
│   │   ├── goals/           # Componentes de metas
│   │   ├── landing/         # Seções da landing page
│   │   ├── layout/          # Layout principal
│   │   └── ui/              # Componentes shadcn/ui
│   │
│   ├── contexts/            # Context API
│   │   ├── LanguageContext.tsx  # Internacionalização
│   │   └── ThemeContext.tsx     # Tema claro/escuro
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.tsx          # Autenticação
│   │   ├── useCalendarData.ts   # Dados do calendário
│   │   ├── useTimer.ts          # Lógica do timer
│   │   └── use-toast.ts         # Notificações toast
│   │
│   ├── integrations/        # Integrações externas
│   │   └── supabase/            # Cliente e queries Supabase
│   │
│   ├── lib/                 # Utilitários
│   │   ├── date-utils.ts        # Funções de data
│   │   ├── supabase-helpers.ts  # Helpers Supabase
│   │   └── utils.ts             # Utilidades gerais
│   │
│   ├── pages/               # Páginas da aplicação
│   │   ├── Landing.tsx          # Landing page pública
│   │   ├── Login.tsx            # Login/registro
│   │   ├── Dashboard.tsx        # Dashboard principal
│   │   ├── Goals.tsx            # Lista de metas
│   │   ├── GoalForm.tsx         # Criar/editar meta
│   │   ├── Checkin.tsx          # Check-in diário
│   │   ├── Timer.tsx            # Timer Pomodoro
│   │   ├── Calendar.tsx         # Calendário
│   │   ├── Profile.tsx          # Perfil do usuário
│   │   └── NotFound.tsx         # Página 404
│   │
│   ├── test/                # Configuração de testes
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globais
│
├── supabase/
│   ├── config.toml          # Configuração local Supabase
│   └── migrations/          # Migrations do banco de dados
│       ├── 20260202_create_core_tables.sql
│       ├── 20260202_fix_rls_policies.sql
│       ├── 20260202_add_auth_triggers.sql
│       ├── 20260202_add_recalculate_functions.sql
│       ├── 20260202_add_n8n_webhook_integration.sql
│       └── 20260203_add_welcome_email_webhook.sql
│
├── docs/                    # Documentação
│   ├── N8N_INTEGRATION.md           # Guia de integração N8N
│   ├── N8N_WORKFLOWS.md             # Workflows N8N
│   ├── EMAIL_CREDENTIALS_SETUP.md   # Setup de credenciais SMTP
│   ├── WELCOME_EMAIL_SETUP.md       # Setup de email de boas-vindas
│   ├── new-goal-email-template.html # Template HTML para nova meta
│   ├── StudyNice - Welcome Email.json       # Workflow N8N boas-vindas
│   └── StudyNice - New Goal Notification.json  # Workflow N8N nova meta
│
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+ e npm/yarn
- **Conta Supabase** (gratuita)
- **N8N** (opcional, para automações)

### Passo 1: Clone o repositório

```bash
git clone <YOUR_GIT_URL>
cd studynice
```

### Passo 2: Instale as dependências

```bash
npm install
```

### Passo 3: Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Obtenha essas credenciais em: **Supabase Dashboard → Settings → API**

### Passo 4: Configure o banco de dados

Execute as migrations do Supabase:

```bash
# Instale o Supabase CLI (se ainda não tiver)
npm install -g supabase

# Faça login
supabase login

# Link com seu projeto
supabase link --project-ref your-project-ref

# Execute as migrations
supabase db push
```

Ou aplique manualmente via SQL Editor no dashboard do Supabase, na seguinte ordem:
1. `20260202_create_core_tables.sql`
2. `20260202_fix_rls_policies.sql`
3. `20260202_add_auth_triggers.sql`
4. `20260202_add_recalculate_functions.sql`
5. `20260202_add_n8n_webhook_integration.sql` (opcional - notificação de nova meta)
6. `20260203_add_welcome_email_webhook.sql` (opcional - email de boas-vindas)

### Passo 5: Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🗺️ Rotas da Aplicação

### Rotas Públicas
- `/` - Landing page
- `/login` - Login e registro de usuários

### Rotas Protegidas (requer autenticação)
- `/dashboard` - Dashboard principal com estatísticas
- `/goals` - Lista de metas ativas
- `/goals/new` - Criar nova meta
- `/goals/:id` - Editar meta existente
- `/checkin` - Registro de check-in diário
- `/timer` - Timer Pomodoro para sessões de estudo
- `/calendar` - Calendário com histórico de check-ins
- `/profile` - Perfil e configurações do usuário

## 🗄️ Banco de Dados

### Tabelas Principais

#### `profiles`
Informações dos usuários (estende auth.users)
- `id` (UUID, PK) - Referência ao auth.users
- `full_name` (TEXT) - Nome completo
- `avatar_url` (TEXT) - URL do avatar
- `timezone` (TEXT) - Fuso horário (default: UTC)
- `created_at` (TIMESTAMP)

#### `goals`
Metas de estudo dos usuários
- `id` (UUID, PK)
- `user_id` (UUID, FK) - Referência ao perfil
- `title` (TEXT) - Título da meta
- `category` (TEXT) - Categoria
- `daily_target_minutes` (INTEGER) - Objetivo diário em minutos
- `is_active` (BOOLEAN) - Meta ativa ou arquivada
- `created_at`, `updated_at` (TIMESTAMP)

#### `checkins`
Check-ins diários de estudo
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `goal_id` (UUID, FK)
- `checkin_date` (DATE)
- `minutes_studied` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)
- **UNIQUE**: (user_id, goal_id, checkin_date)

#### `study_sessions`
Sessões de estudo cronometradas
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `goal_id` (UUID, FK)
- `session_date` (DATE)
- `started_at`, `ended_at` (TIMESTAMP)
- `duration_seconds` (INTEGER)
- `notes` (TEXT)

#### `user_stats`
Estatísticas agregadas do usuário
- `user_id` (UUID, PK)
- `total_minutes` (INTEGER) - Total acumulado
- `total_days_completed` (INTEGER) - Dias com metas cumpridas
- `current_streak` (INTEGER) - Sequência atual
- `best_streak` (INTEGER) - Melhor sequência
- `updated_at` (TIMESTAMP)

#### `daily_stats`
Estatísticas diárias
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `stat_date` (DATE)
- `total_minutes` (INTEGER)
- `target_minutes` (INTEGER)
- `is_completed` (BOOLEAN)
- **UNIQUE**: (user_id, stat_date)

#### `webhook_configs`
Configurações de webhooks do N8N
- `id` (UUID, PK)
- `webhook_name` (TEXT) - Nome do webhook
- `webhook_url` (TEXT) - URL do N8N
- `is_active` (BOOLEAN) - Webhook ativo/inativo
- `created_at`, `updated_at` (TIMESTAMP)
- **UNIQUE**: webhook_name

#### `webhook_logs`
Logs de webhooks para debug (opcional)
- `id` (UUID, PK)
- `webhook_name` (TEXT)
- `payload` (JSONB) - Dados enviados
- `created_at` (TIMESTAMP)

### Segurança (RLS)

Todas as tabelas possuem **Row Level Security (RLS)** habilitado, garantindo que:
- Usuários só acessam seus próprios dados
- Operações são validadas a nível de banco de dados
- Autenticação via Supabase Auth

## 🔔 Integração N8N

O StudyNice possui integração com N8N para automação de notificações via email, Discord, Telegram e outros canais.

### Eventos Disponíveis

#### 1. `user_created` (Novo Usuário - Email de Boas-Vindas)

Quando um usuário cria uma conta, um webhook é disparado automaticamente:

```json
{
  "event_type": "user_created",
  "user": {
    "id": "uuid",
    "full_name": "Maria Silva",
    "email": "maria@email.com",
    "timezone": "America/Sao_Paulo",
    "created_at": "2026-02-03T10:00:00Z"
  },
  "timestamp": "2026-02-03T10:00:00Z"
}
```

**Workflow:** `docs/StudyNice - Welcome Email.json`
**Documentação:** [`docs/WELCOME_EMAIL_SETUP.md`](docs/WELCOME_EMAIL_SETUP.md)

---

#### 2. `goal_created` (Nova Meta)

Quando um usuário cria uma nova meta:

```json
{
  "event_type": "goal_created",
  "goal": {
    "id": "uuid",
    "title": "Estudar JavaScript",
    "category": "category.programming",
    "daily_target_minutes": 60,
    "created_at": "2026-02-03T15:00:00Z"
  },
  "user": {
    "id": "uuid",
    "full_name": "João Silva",
    "email": "joao@email.com",
    "timezone": "America/Sao_Paulo"
  },
  "timestamp": "2026-02-03T15:00:00Z"
}
```

**Template:** `docs/new-goal-email-template.html`
**Workflow:** `docs/StudyNice - New Goal Notification.json`
**Documentação:** [`docs/N8N_INTEGRATION.md`](docs/N8N_INTEGRATION.md)

---

### Configuração

Veja os guias completos:

- **Email de Boas-Vindas:** [`docs/WELCOME_EMAIL_SETUP.md`](docs/WELCOME_EMAIL_SETUP.md)
- **Notificação de Nova Meta:** [`docs/N8N_INTEGRATION.md`](docs/N8N_INTEGRATION.md)
- **Workflows N8N:** [`docs/N8N_WORKFLOWS.md`](docs/N8N_WORKFLOWS.md)
- **Setup SMTP:** [`docs/EMAIL_CREDENTIALS_SETUP.md`](docs/EMAIL_CREDENTIALS_SETUP.md)

### Requisitos

1. **pg_net extension** habilitada no Supabase (Database → Extensions)
2. **N8N** instalado e configurado (local ou cloud)
3. **Credenciais SMTP** para envio de emails
4. **Webhook URLs** atualizadas na tabela `webhook_configs`

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Build para produção
npm run build:dev        # Build em modo desenvolvimento

# Testes
npm run test             # Executa testes uma vez
npm run test:watch       # Executa testes em modo watch

# Qualidade de código
npm run lint             # Executa ESLint

# Preview
npm run preview          # Preview do build de produção
```

## 🧪 Testes

O projeto utiliza **Vitest** e **Testing Library** para testes.

```bash
# Executar todos os testes
npm test

# Modo watch (reexecuta ao salvar)
npm run test:watch
```

Arquivos de teste estão em `src/test/`

## 🌐 Deploy

### Produção (Vercel)
- URL: https://studynice.vercel.app/

### Alternativa: Vercel/Netlify (manual)
```bash
# Build
npm run build

# A pasta dist/ estará pronta para deploy
```

Configure as variáveis de ambiente no painel de controle da plataforma.

## 📝 Customização

### Temas
Os temas são gerenciados via `ThemeContext` com suporte a:
- Modo claro/escuro
- Persistência no localStorage
- CSS Variables do Tailwind

### Internacionalização
Idiomas suportados: PT-BR, EN
Gerenciado via `LanguageContext`

## 🚀 Implementações Futuras (Roadmap)

Aqui estão as melhorias e funcionalidades previstas para versões futuras do StudyNice:

### 📅 Metas com Dias Específicos da Semana
- **Descrição:** Permitir que usuários selecionem quais dias da semana (segunda a domingo) cada meta está ativa
- **Benefício:** Melhor flexibilidade para metas específicas (ex: "estudar JavaScript apenas seg/qua/sex")
- **Modificações necessárias:**
  - Adicionar campo `days_of_week` (JSONB/ARRAY) na tabela `goals`
  - Atualizar formulário de criação/edição de metas com seletor de dias
  - Ajustar cálculos de progresso para considerar dias selecionados

### 🎵 Música Ambiente e Sons de Fundo
- **Descrição:** Integrar player de música ambiente durante sessões de estudo com o timer Pomodoro
- **Funcionalidades:**
  - Acesso a bibliotecas de música livre (ex: Spotify API, YouTube Music, Freepik Music)
  - Categorias: Lo-fi, Frente Wave, Piano, Chuva, Café, etc.
  - Controle de volume independente
  - Salvar músicas favoritas
  - Som de alerta personalizável ao final da sessão
- **Tecnologias sugeridas:** Web Audio API, Howler.js, integração com APIs de música

### 👥 Recursos Sociais
- **Competição com Amigos:** Sistema de desafios e competições entre usuários
- **Rankings Semanais/Mensais:** Leaderboards por minutos estudados ou streaks
- **Compartilhamento de Progresso:** Integração com Discord, WhatsApp para compartilhar conquistas
- **Grupos de Estudo:** Criar grupos de estudo privados com objetivos compartilhados

### 📱 Progressive Web App (PWA)
- **Offline First:** Funcionar offline com sincronização quando conectado
- **Notificações Push:** Lembretes de metas e motivação em tempo real
- **Instalável:** Instalar como app nativo na tela inicial
- **Sincronização em Background:** Atualizar dados em segundo plano

### 📊 Estatísticas Avançadas
- **Análise de Padrões:** Identificar horários mais produtivos
- **Comparativo Semanal/Mensal:** Gráficos comparativos de desempenho
- **Previsões:** Estimativas de quando alcançar metas baseado em padrão atual
- **Relatórios em PDF:** Exportar progresso mensal/trimestral com gráficos
- **Heatmap de Produtividade:** Visualizar em qual dia/hora você é mais produtivo

### 🎖️ Sistema de Gamificação
- **Badges e Achievements:** Conquistas por milestones (10 dias de streak, 100 horas estudadas, etc.)
- **Níveis:** Sistema de progressão com levels baseado em experiência
- **Pontos de XP:** Ganhar XP com cada check-in e sessão completada
- **Recompensas:** Desbloquear temas, sons e músicas com XP

### 🔔 Notificações Inteligentes
- **Lembretes Personalizáveis:** Definir horários específicos para lembretes de metas
- **Notificações Smart:** Ajustar frequência de lembretes conforme progresso do usuário
- **Notificações por Canal:** Email, Push, Discord, Telegram, SMS (via N8N)

### 🌍 Integrações com Calendários
- **Google Calendar Sync:** Sincronizar sessões de estudo no Google Calendar
- **Outlook Integration:** Integração com Microsoft Outlook
- **iCal Export:** Exportar calendário em formato iCal
- **Apple Calendar:** Sincronização nativa com Calendário do iOS

### 🎯 Modo Foco Avançado
- **Bloqueio de Distrações:** Bloqueio de websites/apps durante sessão (extensão do navegador)
- **Modo "Não Perturbe":** Silenciar notificações durante sessão
- **Integração Pomodoro Avançada:** Ciclos de foco/descanso customizáveis (ex: 25min foco + 5min pausa)
- **Detecção de Ando:** Pausar automaticamente quando usuário sair da tela

### 💾 Exportação de Dados
- **Backup de Dados:** Exportar dados em JSON ou CSV
- **Importação:** Importar dados de outras aplicações
- **Data Portability:** Facilitar transferência de dados entre plataformas

### 🎨 Temas e Personalização Avançada
- **Temas Customizáveis:** Editor de temas para cores personnalizadas
- **Widgets na Dashboard:** Reordenar e customizar widgets
- **Ícones Personalizados:** Diferentes ícones para categorias de metas

### 📱 App Mobile Nativo
- **React Native App:** Versão nativa para iOS e Android
- **Offline Sync:** Funcionar completamente offline
- **Notificações Locais:** Alertas nativos do sistema operacional

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido com [Lovable](https://lovable.dev)

---


