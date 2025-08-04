# Solar DG Platform

Sistema completo de gestão para energia solar distribuída com faturamento Stripe, monitoramento SOLARMAN e gestão de créditos energéticos.

## 🚀 Funcionalidades Principais

### ✅ Faturamento com Stripe
- Processamento automático de faturas
- Integração com créditos energéticos
- Envio de faturas por email
- Dashboard de pagamentos

### ✅ Gestão de Créditos Energéticos
- Cofre energético por cliente
- Rastreamento de transações
- Cálculo automático de créditos
- Histórico detalhado

### ✅ Monitoramento SOLARMAN
- Dados em tempo real dos inversores
- Status de usinas (online/offline)
- Métricas de eficiência
- Alertas automáticos

### ✅ Gestão Completa
- Usinas Solares
- Unidades Consumidoras
- Contratos
- CRM
- Financeiro
- Relatórios

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: TailwindCSS, ShadCN/UI, Radix UI
- **Faturamento**: Stripe
- **Monitoramento**: SOLARMAN API
- **Banco**: Supabase (PostgreSQL)
- **Deploy**: Vercel
- **PWA**: Progressive Web App

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou pnpm
- Conta Stripe
- Conta SOLARMAN
- Conta Vercel (para deploy)

### 1. Clone o repositório
```bash
git clone https://github.com/DevWebCaio/sistem-moara.git
cd sistem-moara
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
# Configurações da Aplicação
NEXT_PUBLIC_APP_NAME=Solar DG Platform
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Demo Mode (true para desenvolvimento, false para produção)
NEXT_PUBLIC_DEMO_MODE=true

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# SOLARMAN Configuration
SOLARMAN_API_URL=https://api.solarmanpv.com
SOLARMAN_APP_ID=your_solarman_app_id
SOLARMAN_APP_SECRET=your_solarman_app_secret
SOLARMAN_USERNAME=your_solarman_username
SOLARMAN_PASSWORD=your_solarman_password

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Execute o projeto
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🚀 Deploy para Produção

### 1. Preparação para Produção

1. **Configure as credenciais reais**:
   - Stripe (chaves live)
   - SOLARMAN (credenciais de produção)
   - Email (SMTP de produção)

2. **Desative o modo demo**:
   ```env
   NEXT_PUBLIC_DEMO_MODE=false
   ```

3. **Configure o domínio**:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

### 2. Deploy na Vercel

#### Opção A: Deploy Automático (Recomendado)
1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente na Vercel
3. Deploy automático a cada push para `main`

#### Opção B: Deploy Manual
```bash
# Instale o Vercel CLI
npm install -g vercel

# Login na Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configuração de Variáveis na Vercel

Configure estas variáveis no painel da Vercel:

**Obrigatórias:**
- `NEXT_PUBLIC_DEMO_MODE` = `false`
- `STRIPE_SECRET_KEY` = sua chave live do Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = sua chave pública live do Stripe

**Opcionais (se usar):**
- `SOLARMAN_*` = credenciais do SOLARMAN
- `SMTP_*` = configurações de email
- `SUPABASE_*` = configurações do Supabase

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código

# Deploy
npm run vercel-build # Build para Vercel
```

## 📱 PWA Features

- ✅ Instalável como app
- ✅ Funciona offline
- ✅ Push notifications
- ✅ Splash screen
- ✅ Ícones adaptativos

## 🔒 Segurança

- ✅ HTTPS obrigatório
- ✅ Headers de segurança
- ✅ Validação de dados
- ✅ Sanitização de inputs
- ✅ Rate limiting

## 📊 Monitoramento

- ✅ Logs estruturados
- ✅ Métricas de performance
- ✅ Error tracking
- ✅ Uptime monitoring

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/DevWebCaio/sistem-moara/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/DevWebCaio/sistem-moara/wiki)
- **Email**: suporte@solar-dg.com

## 🎯 Roadmap

- [ ] Integração com mais provedores de energia
- [ ] Dashboard avançado de analytics
- [ ] API pública para terceiros
- [ ] App mobile nativo
- [ ] Machine Learning para previsões
- [ ] Blockchain para créditos energéticos

---

**Desenvolvido com ❤️ para o futuro da energia solar**
