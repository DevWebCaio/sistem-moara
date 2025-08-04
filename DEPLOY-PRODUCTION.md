# 🚀 Guia de Deploy para Produção - Solar DG Platform

## 📋 Pré-requisitos

### 1. Contas Necessárias
- ✅ Conta Vercel (gratuita)
- ✅ Conta Stripe (para faturamento)
- ✅ Conta SOLARMAN (para monitoramento)
- ✅ Conta GitHub (para repositório)

### 2. Credenciais Obrigatórias
- **Stripe**: Chaves live (não test)
- **SOLARMAN**: Credenciais de produção
- **Email**: SMTP de produção

## 🔧 Configuração para Produção

### Passo 1: Preparar Credenciais

#### Stripe (Obrigatório)
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Vá em **Developers > API keys**
3. Copie as chaves **live** (não test):
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

#### SOLARMAN (Opcional)
1. Acesse sua conta SOLARMAN
2. Obtenha as credenciais da API:
   ```
   SOLARMAN_APP_ID=your_app_id
   SOLARMAN_APP_SECRET=your_app_secret
   SOLARMAN_USERNAME=your_username
   SOLARMAN_PASSWORD=your_password
   ```

#### Email (Opcional)
1. Configure SMTP para envio de faturas:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

### Passo 2: Deploy na Vercel

#### Opção A: Deploy Automático (Recomendado)

1. **Conecte o GitHub à Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe o repositório `DevWebCaio/sistem-moara`

2. **Configure as variáveis de ambiente**:
   - Vá em **Settings > Environment Variables**
   - Adicione todas as variáveis do arquivo `env.production.example`

3. **Configure o domínio**:
   - Vá em **Settings > Domains**
   - Adicione seu domínio personalizado (opcional)

4. **Deploy automático**:
   - Qualquer push para `main` fará deploy automático

#### Opção B: Deploy Manual

1. **Instale o Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login na Vercel**:
   ```bash
   vercel login
   ```

3. **Execute o script de deploy**:
   ```bash
   ./scripts/deploy-production.sh
   ```

### Passo 3: Configuração de Variáveis na Vercel

Configure estas variáveis no painel da Vercel:

#### Obrigatórias
```env
NEXT_PUBLIC_DEMO_MODE=false
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

#### Opcionais (se usar)
```env
SOLARMAN_API_URL=https://api.solarmanpv.com
SOLARMAN_APP_ID=your_solarman_app_id
SOLARMAN_APP_SECRET=your_solarman_app_secret
SOLARMAN_USERNAME=your_solarman_username
SOLARMAN_PASSWORD=your_solarman_password

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🧪 Testes Pós-Deploy

### 1. Teste Básico
- ✅ Acesse a URL da aplicação
- ✅ Verifique se carrega sem erros
- ✅ Teste navegação entre páginas

### 2. Teste de Funcionalidades Críticas

#### Faturamento Stripe
- ✅ Acesse `/invoices`
- ✅ Clique em "Gerar Nova Fatura"
- ✅ Preencha o formulário
- ✅ Verifique se a fatura é criada

#### Monitoramento SOLARMAN
- ✅ Acesse `/monitoring`
- ✅ Selecione uma usina
- ✅ Verifique dados em tempo real
- ✅ Teste diferentes usinas

#### Gestão de Créditos
- ✅ Acesse `/energy-vault`
- ✅ Selecione diferentes clientes
- ✅ Teste adição de créditos
- ✅ Verifique histórico

### 3. Teste de Performance
- ✅ Teste em diferentes dispositivos
- ✅ Verifique responsividade
- ✅ Teste velocidade de carregamento

## 🔒 Segurança

### Configurações Obrigatórias
1. **HTTPS**: Automático na Vercel
2. **Headers de Segurança**: Configurados no `vercel.json`
3. **Rate Limiting**: Configure se necessário
4. **CORS**: Configure para APIs externas

### Monitoramento
1. **Vercel Analytics**: Ative no painel
2. **Error Tracking**: Configure Sentry ou similar
3. **Uptime Monitoring**: Configure alertas

## 📊 Monitoramento e Analytics

### 1. Vercel Analytics
- Ative no painel da Vercel
- Monitore performance
- Acompanhe métricas de usuários

### 2. Error Tracking
```bash
# Instale Sentry (opcional)
npm install @sentry/nextjs
```

### 3. Logs
- Acesse logs na Vercel
- Configure alertas para erros
- Monitore performance

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Build Falha
```bash
# Verifique logs
vercel logs

# Teste build local
npm run build
```

#### 2. Variáveis de Ambiente
- Verifique se todas estão configuradas
- Teste com `NEXT_PUBLIC_DEMO_MODE=true` primeiro

#### 3. Stripe Não Funciona
- Verifique se as chaves são **live** (não test)
- Confirme se o webhook está configurado
- Teste com modo demo primeiro

#### 4. SOLARMAN Não Conecta
- Verifique credenciais
- Teste API manualmente
- Use modo demo se necessário

## 📈 Otimizações

### 1. Performance
- ✅ Imagens otimizadas
- ✅ Bundle size otimizado
- ✅ Lazy loading configurado
- ✅ PWA habilitado

### 2. SEO
- ✅ Meta tags configuradas
- ✅ Sitemap gerado
- ✅ Robots.txt configurado

### 3. PWA
- ✅ Manifest configurado
- ✅ Service worker pronto
- ✅ Ícones adaptativos

## 🔄 Atualizações

### Deploy Automático
- Push para `main` = deploy automático
- Configure branch protection se necessário

### Deploy Manual
```bash
# Atualizar código
git pull origin main

# Deploy
./scripts/deploy-production.sh
```

## 📞 Suporte

### Em Caso de Problemas
1. **Logs**: Verifique logs na Vercel
2. **GitHub Issues**: Abra issue no repositório
3. **Documentação**: Consulte README.md
4. **Comunidade**: Stack Overflow

### Contatos
- **Email**: suporte@solar-dg.com
- **GitHub**: [Issues](https://github.com/DevWebCaio/sistem-moara/issues)
- **Documentação**: [Wiki](https://github.com/DevWebCaio/sistem-moara/wiki)

---

## ✅ Checklist Final

- [ ] Credenciais Stripe configuradas
- [ ] Variáveis de ambiente definidas
- [ ] Deploy realizado com sucesso
- [ ] Funcionalidades testadas
- [ ] Performance verificada
- [ ] Segurança configurada
- [ ] Monitoramento ativo
- [ ] Backup configurado
- [ ] Documentação atualizada

**🎉 Seu sistema está pronto para produção!** 