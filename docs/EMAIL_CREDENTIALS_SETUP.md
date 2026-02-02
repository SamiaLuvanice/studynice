# 📧 Configuração de Credenciais de Email no n8n

Este guia mostra como configurar diferentes provedores de email para enviar notificações através do n8n.

## 📋 Opções de Provedores de Email

### 1. Gmail (Recomendado para testes)

#### Passo 1: Criar Senha de App no Gmail
1. Acesse [Google Account](https://myaccount.google.com/)
2. Vá em **Segurança**
3. Ative **Verificação em duas etapas** (se ainda não estiver)
4. Em "Verificação em duas etapas", role até **Senhas de app**
5. Clique em **Senhas de app**
6. Selecione:
   - App: **Email**
   - Dispositivo: **Outro (nome personalizado)** → "n8n StudyNice"
7. Clique em **Gerar**
8. **Copie a senha de 16 caracteres** gerada

#### Passo 2: Configurar no n8n
1. No workflow, clique no node **Send Email Notification**
2. Em **Credentials**, clique no **+** ou selecione **Create New**
3. Preencha:
   ```
   Nome: Gmail StudyNice
   Usuário: seuemail@gmail.com
   Senha: [Cole a senha de app de 16 caracteres]
   Host: smtp.gmail.com
   Porta: 465
   SSL/TLS: ✅ Sim
   ```
4. Clique em **Save** → **Create**

---

### 2. Outlook / Hotmail / Live

#### Configuração no n8n:
```
Nome: Outlook StudyNice
Usuário: seuemail@outlook.com (ou @hotmail.com / @live.com)
Senha: [Sua senha do Outlook]
Host: smtp-mail.outlook.com
Porta: 587
SSL/TLS: ✅ Sim (STARTTLS)
```

**Nota:** Se tiver verificação em duas etapas, use uma [senha de app](https://account.live.com/proofs/AppPassword).

---

### 3. SendGrid (Recomendado para produção)

SendGrid oferece **100 emails grátis por dia** - excelente para produção!

#### Passo 1: Criar conta SendGrid
1. Acesse [SendGrid](https://sendgrid.com/)
2. Crie uma conta gratuita
3. Vá em **Settings** → **API Keys**
4. Clique em **Create API Key**
5. Nome: "n8n StudyNice"
6. Permissões: **Full Access** ou **Mail Send**
7. Copie a API Key (ela só aparece uma vez!)

#### Passo 2: Configurar no n8n
```
Nome: SendGrid StudyNice
Usuário: apikey (literal, exatamente isso)
Senha: [Cole a API Key copiada]
Host: smtp.sendgrid.net
Porta: 587
SSL/TLS: ✅ Sim (STARTTLS)
```

#### Configurar Sender Identity
1. No SendGrid, vá em **Settings** → **Sender Authentication**
2. Escolha **Single Sender Verification**
3. Preencha seus dados e verifique o email
4. Use esse email como **From Email** no n8n

---

### 4. Mailgun (Alternativa profissional)

Mailgun oferece **5.000 emails grátis por mês** nos primeiros 3 meses.

#### Configuração:
1. Crie conta em [Mailgun](https://www.mailgun.com/)
2. Vá em **Sending** → **Domain Settings** → **SMTP Credentials**
3. Copie as credenciais

```
Nome: Mailgun StudyNice
Usuário: postmaster@seu-dominio.mailgun.org
Senha: [Senha fornecida pelo Mailgun]
Host: smtp.mailgun.org
Porta: 587
SSL/TLS: ✅ Sim
```

---

### 5. Amazon SES (Para produção em escala)

Muito barato, mas requer configuração mais avançada.

#### Configuração:
1. Acesse [AWS Console](https://console.aws.amazon.com/ses/)
2. Crie credenciais SMTP
3. Verifique domínio ou email

```
Nome: AWS SES StudyNice
Usuário: [SMTP Username from AWS]
Senha: [SMTP Password from AWS]
Host: email-smtp.us-east-1.amazonaws.com (varia por região)
Porta: 587
SSL/TLS: ✅ Sim
```

---

### 6. Resend (Moderno e fácil)

[Resend](https://resend.com/) - API moderna, 100 emails/dia grátis.

#### Configuração:
1. Crie conta em [Resend](https://resend.com/)
2. Crie uma API Key
3. **No n8n, use o node HTTP Request** (não SMTP):

```javascript
// Node: HTTP Request
URL: https://api.resend.com/emails
Method: POST
Headers:
  Authorization: Bearer [SUA_API_KEY]
  Content-Type: application/json

Body:
{
  "from": "StudyNice <onboarding@resend.dev>",
  "to": "{{ $json.user.email }}",
  "subject": "Nova meta criada: {{ $json.goal.title }}",
  "html": "<h1>🎯 Nova Meta Criada!</h1>..."
}
```

---

### 7. SMTP Próprio (Custom)

Se você tem um servidor próprio ou hospedagem:

```
Nome: Meu SMTP
Usuário: [Seu email]
Senha: [Sua senha]
Host: [smtp.seudominio.com]
Porta: 587 ou 465
SSL/TLS: ✅ Depende do servidor
```

**Onde encontrar suas configurações SMTP:**
- cPanel: Seção "Email Accounts"
- Plesk: "Mail Settings"
- Entre em contato com sua hospedagem

---

## 🔧 Configuração Passo a Passo no n8n

### Opção 1: Durante a criação do Workflow

1. Após importar o workflow JSON
2. Clique no node **Send Email Notification**
3. Você verá um aviso vermelho "Missing credentials"
4. Clique em **Credentials for SMTP Account**
5. Clique em **+ Create New Credential**
6. Escolha **SMTP Account** (já deve estar selecionado)
7. Preencha os dados do provedor escolhido (ex: Gmail)
8. Clique em **Save**

### Opção 2: Criar credenciais antes

1. No n8n, vá no menu lateral → **Credentials**
2. Clique em **+ Add Credential**
3. Busque por "SMTP"
4. Selecione **SMTP Account**
5. Preencha os dados
6. Teste com **Test Connection** (se disponível)
7. Clique em **Save**
8. No workflow, selecione essa credencial criada

---

## ✅ Testando a Configuração

### Teste 1: Dentro do n8n
1. Ative o workflow
2. Clique em **Execute Workflow**
3. Clique no node **Send Email Notification**
4. Clique com botão direito → **Execute Node**
5. Verifique se aparece ✅ sem erros

### Teste 2: Com dados reais
```bash
# Use curl ou Postman para testar o webhook
curl -X POST https://your-n8n.com/webhook/new-goal \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "goal_created",
    "goal": {
      "id": "test-123",
      "title": "Teste de Email",
      "category": "Teste",
      "daily_target_minutes": 30,
      "created_at": "2026-02-02T10:00:00Z"
    },
    "user": {
      "id": "user-123",
      "full_name": "Seu Nome",
      "email": "seuemail@exemplo.com",
      "timezone": "America/Sao_Paulo"
    },
    "timestamp": "2026-02-02T10:00:00Z"
  }'
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Authentication failed"
- **Gmail:** Certifique-se de usar senha de app, não senha normal
- **Outlook:** Verifique se 2FA está configurado
- Confira se usuário e senha estão corretos

### ❌ Erro: "Connection timeout"
- Verifique Host e Porta
- Tente trocar entre 465 (SSL) e 587 (TLS)
- Firewall pode estar bloqueando

### ❌ Emails não chegam (sem erro)
- Verifique pasta de SPAM
- **SendGrid/Mailgun:** Verifique domínio verificado
- Gmail: Pode ter limite de envios

### ❌ Erro: "SSL/TLS error"
- Tente desabilitar SSL/TLS temporariamente
- Use porta 587 com STARTTLS

---

## 🎯 Recomendações

### Para Desenvolvimento/Testes:
✅ **Gmail** - Fácil e rápido

### Para Produção:
✅ **SendGrid** - 100 emails/dia grátis, confiável
✅ **Mailgun** - 5.000/mês nos primeiros meses
✅ **Resend** - API moderna, 100/dia grátis

### Para Alta Escala:
✅ **Amazon SES** - Muito barato ($0.10 por 1000 emails)

---

## 📝 Exemplo de Configuração Gmail (Mais comum)

```yaml
# Configuração Gmail no n8n
Credential Type: SMTP Account
Name: Gmail - StudyNice Notifications
User: studynice.app@gmail.com
Password: abcd efgh ijkl mnop  # Senha de app (16 caracteres)
Host: smtp.gmail.com
Port: 465
Secure: true (SSL/TLS)
Ignore TLS: false
```

**From Email no node:**
```
studynice.app@gmail.com
```

---

## 🔐 Segurança

- ✅ Nunca commite credenciais no código
- ✅ Use senhas de app, não senhas principais
- ✅ No n8n cloud, credenciais ficam criptografadas
- ✅ Limite permissões (ex: SendGrid, use "Mail Send" apenas)
- ✅ Rotacione senhas periodicamente

---

## 📚 Links Úteis

- [Gmail - Senhas de App](https://support.google.com/accounts/answer/185833)
- [SendGrid - Getting Started](https://docs.sendgrid.com/for-developers/sending-email/api-getting-started)
- [Mailgun - SMTP](https://documentation.mailgun.com/en/latest/user_manual.html#sending-via-smtp)
- [n8n - Email Node Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.emailsend/)
- [Resend - Quick Start](https://resend.com/docs/send-with-nodejs)

---

Precisa de ajuda com alguma configuração específica? Me avise!
