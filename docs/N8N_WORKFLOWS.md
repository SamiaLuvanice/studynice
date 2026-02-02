# 📚 Biblioteca de Workflows n8n para StudyNice

Coleção de workflows prontos para usar com o StudyNice.

## 🎯 1. Notificação de Nova Meta (Implementado)

**Trigger:** Nova meta criada
**Ações:** Enviar notificação via Discord/Email/Telegram

[Ver documentação completa](./N8N_INTEGRATION.md)

---

## 🔔 2. Lembrete Diário de Estudo (Futuro)

**Trigger:** Cron diário (ex: 9h da manhã)
**Condições:** Usuário ainda não fez check-in hoje
**Ações:** Enviar lembrete personalizado

**Workflow n8n:**
```
Cron Trigger (9:00 AM) 
  → HTTP Request (buscar usuários sem check-in)
  → Loop (para cada usuário)
  → Send Notification (Discord/Email/Telegram)
```

**Endpoint necessário:** `GET /api/users/pending-checkin`

---

## ⚠️ 3. Alerta de Streak em Risco (Futuro)

**Trigger:** Cron diário (ex: 20h)
**Condições:** Usuário tem streak > 0 e não fez check-in hoje
**Ações:** Enviar alerta urgente

**Mensagem exemplo:**
```
🔥 ATENÇÃO! Seu streak de 15 dias está em risco!
Você ainda não registrou estudos hoje.
Restam apenas 4 horas! ⏰
```

---

## 📊 4. Relatório Semanal (Futuro)

**Trigger:** Cron semanal (domingo 18h)
**Ações:** Gerar e enviar relatório da semana

**Dados incluídos:**
- Total de minutos estudados
- Dias completados
- Metas mais cumpridas
- Sugestões de melhoria

**Workflow:**
```
Cron Trigger (Sunday 6PM)
  → HTTP Request (buscar stats semanais)
  → Loop (para cada usuário)
  → Generate PDF/HTML Report
  → Send Email
```

---

## 🏆 5. Sistema de Conquistas (Futuro)

**Triggers:** Vários eventos
**Ações:** Verificar conquistas e notificar

**Exemplos de conquistas:**
- 🔥 "Semana Perfeita" - 7 dias seguidos
- 📚 "Maratonista" - 100 minutos em um dia
- 🎯 "Multi-talento" - 5 metas ativas
- ⭐ "Veterano" - 30 dias de streak

**Workflow:**
```
Webhook (check-in/goal events)
  → Check Achievements Function
  → IF (new achievement unlocked)
  → Send Celebration Notification
  → Update Database
```

---

## 🔄 6. Sincronização com Google Calendar (Futuro)

**Trigger:** Nova sessão de estudo completada
**Ações:** Criar evento no Google Calendar

**Workflow:**
```
Webhook (study_session_completed)
  → Google Calendar: Create Event
    - Title: "📚 {goal_title}"
    - Duration: {duration_minutes} min
    - Description: Notes
```

---

## 📈 7. Export para Google Sheets (Futuro)

**Trigger:** Cron diário (meia-noite)
**Ações:** Exportar dados do dia para planilha

**Dados exportados:**
- Check-ins
- Sessões de estudo
- Progresso de metas
- Stats diárias

**Uso:** Análise avançada, dashboards personalizados

---

## 💬 8. Chatbot de Suporte (Futuro)

**Trigger:** Mensagem no Discord/Telegram
**Ações:** Responder comandos

**Comandos:**
- `/stats` - Ver estatísticas
- `/streak` - Ver streak atual
- `/today` - Progresso de hoje
- `/goals` - Listar metas ativas

**Workflow:**
```
Discord/Telegram Bot Trigger
  → Parse Command
  → HTTP Request (buscar dados)
  → Format Response
  → Send Reply
```

---

## 🎨 9. Gerador de Certificados (Futuro)

**Trigger:** Usuário completa 30/60/90 dias
**Ações:** Gerar e enviar certificado PDF

**Workflow:**
```
Webhook (milestone_reached)
  → Generate Certificate (HTML/PDF)
  → Upload to Cloud Storage
  → Send Email with Certificate
  → Share on Discord (optional)
```

---

## 🤖 10. AI Study Coach (Futuro)

**Trigger:** Semanal ou sob demanda
**Ações:** Análise de dados + sugestões personalizadas

**Workflow:**
```
Trigger
  → Fetch User Data (7-30 days)
  → OpenAI/Claude Analysis
    - Identify patterns
    - Suggest optimizations
    - Motivational message
  → Send Personalized Report
```

**Exemplo de análise:**
```
📊 Análise Semanal - Seu Coach AI

Padrões identificados:
✅ Você estuda melhor entre 14h-16h (85% completion)
⚠️ Segundas-feiras têm baixo engajamento (40%)
🎯 Meta "JavaScript" está 30% acima do target

Sugestões:
1. Concentre estudos pesados na tarde
2. Reduza meta de segunda ou mova para terça
3. Considere aumentar target de JavaScript

Continue assim! 💪
```

---

## 📝 Como Implementar Novos Workflows

1. **Criar trigger/webhook no Supabase** (se necessário)
2. **Configurar workflow no n8n**
3. **Testar com dados reais**
4. **Documentar aqui**
5. **Compartilhar JSON do workflow** (export do n8n)

---

## 🔗 Links Úteis

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Workflows](https://n8n.io/workflows)
- [Supabase Webhooks](https://supabase.com/docs/guides/database/webhooks)
- [pg_net Extension](https://github.com/supabase/pg_net)

---

## 🤝 Contribuindo

Tem um workflow útil? Adicione aqui!
1. Implemente o workflow
2. Documente claramente
3. Adicione exemplo de payload
4. Export JSON do n8n (opcional)
