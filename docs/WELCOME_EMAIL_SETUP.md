# 📧 Email de Boas-Vindas - Configuração

Este documento explica como configurar o email automático de boas-vindas quando um novo usuário se cadastra no StudyNice.

## 📋 Visão Geral

Quando um usuário cria uma conta no StudyNice, um trigger no Supabase dispara automaticamente um webhook para o N8N, que envia um email de boas-vindas personalizado.

## 🔧 Configuração

### Passo 1: Aplicar a Migration no Supabase

Execute a migration que cria o trigger de webhook:

```bash
# Se estiver usando Supabase CLI localmente
supabase db push

# Ou aplique manualmente no SQL Editor do dashboard
```

A migration `20260203_add_welcome_email_webhook.sql` cria:
- Função `notify_n8n_new_user()` que envia dados para o N8N
- Trigger `trigger_notify_n8n_new_user` na tabela `profiles`
- Configuração de webhook na tabela `webhook_configs`

### Passo 2: Importar o Workflow no N8N

1. **Acesse seu N8N** (local ou cloud)

2. **Importe o workflow:**
   - Clique em **Menu (☰) → Import from File**
   - Selecione o arquivo `docs/StudyNice - Welcome Email.json`
   - Ou crie manualmente seguindo a estrutura abaixo

3. **Configure as credenciais SMTP** (se ainda não tiver):
   - Vá em **Credentials** no menu lateral
   - Clique em **New Credential**
   - Selecione **SMTP**
   - Preencha os dados do seu servidor de email

### Passo 3: Configurar o Webhook URL

Após importar o workflow:

1. **Ative o workflow** no N8N

2. **Copie a URL do webhook** gerada (será algo como):
   ```
   https://seu-n8n.com/webhook/welcome
   ```

3. **Atualize a configuração no Supabase:**

Execute no SQL Editor do Supabase:

```sql
SELECT update_webhook_config(
  'welcome_email_notification',
  'https://seu-n8n.com/webhook/welcome',
  true
);
```

Ou via código JavaScript/TypeScript:

```typescript
import { supabase } from '@/integrations/supabase/client';

await supabase.rpc('update_webhook_config', {
  p_webhook_name: 'welcome_email_notification',
  p_webhook_url: 'https://seu-n8n.com/webhook/welcome',
  p_is_active: true
});
```

## 📨 Estrutura do Email

O email de boas-vindas inclui:

- **Cabeçalho visual** com logo do StudyNice (coruja 🦉)
- **Mensagem de boas-vindas** personalizada com o nome do usuário
- **Próximos passos** para começar a usar a plataforma:
  1. Criar primeira meta
  2. Definir objetivo diário
  3. Usar timer Pomodoro
  4. Fazer check-ins diários
- **Dica de produtividade** sobre estudos consistentes
- **CTA (Call-to-Action)** para acessar o dashboard
- **Footer** com informações de suporte

## 🔍 Dados Enviados ao N8N

Quando um usuário se registra, o webhook recebe:

```json
{
  "event_type": "user_created",
  "user": {
    "id": "uuid-do-usuario",
    "full_name": "Nome do Usuário",
    "email": "usuario@email.com",
    "timezone": "America/Sao_Paulo",
    "created_at": "2026-02-03T10:00:00Z"
  },
  "timestamp": "2026-02-03T10:00:00Z"
}
```

## 🎨 Personalização do Email

Você pode customizar o email editando o campo **HTML** no nó "Send Welcome Email":

### Elementos customizáveis:

- **Logo/Emoji**: Altere o 🦉 ou adicione uma imagem
- **Cores**: Ajuste o gradiente (`#ec4899` e `#8b5cf6`)
- **Textos**: Modifique mensagens e instruções
- **URL do CTA**: Atualize `https://studynice.app/dashboard` para sua URL
- **Passos iniciais**: Adicione ou remova etapas
- **Dicas**: Personalize as dicas de produtividade

### Exemplo de customização da cor:

```html
<!-- Trocar gradiente rosa/roxo por azul/verde -->
<div style="background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%);">
```

## 🧪 Testar o Workflow

### Teste Manual no N8N:

1. Abra o workflow no N8N
2. Clique em **Execute Workflow**
3. No nó "Webhook - New User", clique em **Listen for Test Event**
4. Envie um POST request de teste:

```bash
curl -X POST https://seu-n8n.com/webhook/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "body": {
      "event_type": "user_created",
      "user": {
        "id": "test-uuid",
        "full_name": "Teste Silva",
        "email": "seu-email@teste.com",
        "timezone": "America/Sao_Paulo",
        "created_at": "2026-02-03T10:00:00Z"
      },
      "timestamp": "2026-02-03T10:00:00Z"
    }
  }'
```

### Teste Real:

1. Crie uma conta de teste no StudyNice
2. Verifique o email da conta de teste
3. Confira os logs do N8N para ver se o webhook foi acionado

## ⚠️ Troubleshooting

### Email não está sendo enviado

1. **Verifique o workflow está ativo** no N8N
2. **Confira as credenciais SMTP** estão corretas
3. **Valide a URL do webhook** no Supabase:
   ```sql
   SELECT * FROM webhook_configs 
   WHERE webhook_name = 'welcome_email_notification';
   ```
4. **Verifique os logs** do N8N para erros

### Webhook não está sendo chamado

1. **Confirme que a extensão pg_net está habilitada** no Supabase
2. **Verifique o trigger existe**:
   ```sql
   SELECT * FROM information_schema.triggers 
   WHERE trigger_name = 'trigger_notify_n8n_new_user';
   ```
3. **Teste a função manualmente**:
   ```sql
   -- Simular criação de perfil
   INSERT INTO profiles (id, full_name, timezone)
   VALUES (gen_random_uuid(), 'Teste', 'UTC');
   ```

### Email vai para spam

1. Configure **SPF, DKIM e DMARC** no seu domínio
2. Use um serviço de email confiável (SendGrid, Mailgun, AWS SES)
3. Evite palavras que acionam filtros de spam
4. Inclua um link de descadastramento (unsubscribe)

## 🔒 Segurança

- As credenciais SMTP ficam **seguras no N8N**, não no código
- O webhook usa **HTTPS** para comunicação segura
- A tabela `webhook_configs` tem **RLS ativado** (apenas service_role)
- Emails de usuários **não são expostos** publicamente

## 📊 Monitoramento

### Verificar quantos emails foram enviados:

No N8N, vá em **Executions** para ver:
- Total de execuções
- Emails enviados com sucesso
- Erros e falhas
- Tempo médio de execução

### Métricas recomendadas:

- Taxa de entrega (delivery rate)
- Taxa de abertura (open rate)
- Taxa de cliques no CTA
- Emails que foram para spam

## 🚀 Próximos Passos

Após configurar o email de boas-vindas, você pode criar outros workflows:

- **Email de lembrete** para usuários inativos
- **Email de conquista** quando atingir streaks
- **Email semanal** com resumo de progresso
- **Email de motivação** em datas especiais

Veja mais em [`N8N_WORKFLOWS.md`](N8N_WORKFLOWS.md)

---

**Nota:** Certifique-se de respeitar as leis de proteção de dados (LGPD, GDPR) ao enviar emails automáticos.
