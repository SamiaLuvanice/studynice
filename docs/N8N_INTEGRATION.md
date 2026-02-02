# 🔔 Integração n8n - Notificações de Novas Metas

Este documento explica como configurar a automação de notificações quando uma nova meta é criada no StudyNice.

## 📋 Visão Geral

Quando um usuário cria uma nova meta no StudyNice, um trigger no Supabase envia automaticamente os dados para um webhook do n8n, que pode processar e enviar notificações via Discord, Email, Telegram, etc.

## 🔧 Configuração

### Passo 1: Habilitar a extensão pg_net no Supabase

1. Acesse o dashboard do Supabase
2. Vá em **Database** → **Extensions**
3. Busque por `pg_net` e habilite

### Passo 2: Aplicar a migration

Execute a migration que cria o trigger:

```bash
# Se estiver usando Supabase CLI localmente
supabase db push

# Ou aplique manualmente no SQL Editor do dashboard
```

### Passo 3: Criar o Workflow no n8n

1. **Acesse seu n8n** (local ou cloud)

2. **Crie um novo workflow** com os seguintes nodes:

#### Node 1: Webhook Trigger
- **Node Type:** `Webhook`
- **Configuration:**
  - Webhook Name: `new-goal`
  - Method: `POST`
  - Path: `/webhook/new-goal`
  - Response Mode: `Immediately`
  
3. **Copie a URL do webhook** gerado (algo como `https://your-n8n.com/webhook/new-goal`)

#### Node 2: Processar Dados
- **Node Type:** `Set` (opcional)
- Use para formatar os dados recebidos
- Dados disponíveis:
  ```json
  {
    "event_type": "goal_created",
    "goal": {
      "id": "uuid",
      "title": "Estudar JavaScript",
      "category": "Programming",
      "daily_target_minutes": 60,
      "created_at": "2026-02-02T10:00:00Z"
    },
    "user": {
      "id": "uuid",
      "full_name": "João Silva",
      "timezone": "America/Sao_Paulo"
    },
    "timestamp": "2026-02-02T10:00:00Z"
  }
  ```

#### Node 3: Enviar Notificação

Escolha um ou mais canais:

**Opção A: Discord**
- **Node Type:** `Discord`
- **Configuration:**
  - Webhook URL: [Sua webhook URL do Discord]
  - Message:
    ```
    🎯 **Nova Meta Criada!**
    
    👤 Usuário: {{$json.user.full_name}}
    📚 Meta: {{$json.goal.title}}
    🏷️ Categoria: {{$json.goal.category}}
    ⏱️ Objetivo Diário: {{$json.goal.daily_target_minutes}} minutos
    
    Boa sorte nos estudos! 🚀
    ```

**Opção B: Email**
- **Node Type:** `Send Email`
- **Configuration:**
  - To: `admin@seudominio.com` ou `{{$json.user.email}}`
  - Subject: `Nova meta criada: {{$json.goal.title}}`
  - Email Type: `HTML`
  - Message:
    ```html
    <h2>🎯 Nova Meta Criada!</h2>
    <p><strong>Usuário:</strong> {{$json.user.full_name}}</p>
    <p><strong>Meta:</strong> {{$json.goal.title}}</p>
    <p><strong>Categoria:</strong> {{$json.goal.category}}</p>
    <p><strong>Objetivo Diário:</strong> {{$json.goal.daily_target_minutes}} minutos</p>
    <p>Continue assim! 🚀</p>
    ```

**Opção C: Telegram**
- **Node Type:** `Telegram`
- **Configuration:**
  - Chat ID: [Seu chat ID]
  - Message:
    ```
    🎯 *Nova Meta Criada!*
    
    👤 Usuário: {{$json.user.full_name}}
    📚 Meta: {{$json.goal.title}}
    🏷️ Categoria: {{$json.goal.category}}
    ⏱️ Objetivo: {{$json.goal.daily_target_minutes}} min/dia
    ```

4. **Ative o workflow** no n8n

### Passo 4: Configurar a URL do Webhook no Supabase

Opção 1 - Via SQL Editor:
```sql
SELECT update_webhook_config(
  'new_goal_notification',
  'https://your-n8n-instance.com/webhook/new-goal',
  true
);
```

Opção 2 - Via interface (criar uma página admin no seu app)

## 🧪 Testando

1. Crie uma nova meta no seu app StudyNice
2. Verifique o n8n para ver se o webhook foi recebido
3. Confirme se a notificação foi enviada no canal configurado

## 📊 Payload de Exemplo

```json
{
  "event_type": "goal_created",
  "goal": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Estudar React Avançado",
    "category": "Programação",
    "daily_target_minutes": 90,
    "created_at": "2026-02-02T14:30:00Z"
  },
  "user": {
    "id": "987fcdeb-51a2-43f1-b456-426614174001",
    "full_name": "Maria Santos",
    "timezone": "America/Sao_Paulo"
  },
  "timestamp": "2026-02-02T14:30:05Z"
}
```

## 🔐 Segurança

- A tabela `webhook_configs` usa RLS e só pode ser modificada via service role
- Use HTTPS para os webhooks do n8n
- Considere adicionar autenticação (header token) no webhook
- Não exponha dados sensíveis nas notificações

## 🚀 Próximos Passos

Você pode estender essa automação para:
- ✅ Notificar quando check-in for realizado
- ✅ Alertar quando streak estiver em risco
- ✅ Enviar relatórios semanais
- ✅ Parabenizar quando meta diária for atingida
- ✅ Gamificação com badges e conquistas

## 🛠️ Troubleshooting

**Webhook não está sendo chamado:**
- Verifique se `pg_net` está habilitado
- Confirme que `is_active = true` na tabela `webhook_configs`
- Verifique logs no Supabase: Database → Logs

**n8n não recebe dados:**
- Teste a URL do webhook com curl/Postman
- Verifique se o workflow está ativo no n8n
- Confirme que a URL está correta no banco

**Erros de permissão:**
- A função usa `SECURITY DEFINER` para executar com privilégios elevados
- Certifique-se de que o trigger foi criado corretamente
