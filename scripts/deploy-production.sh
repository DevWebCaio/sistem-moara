#!/bin/bash

# Script de Deploy para Produção - Solar DG Platform
# Uso: ./scripts/deploy-production.sh

set -e

echo "🚀 Iniciando deploy para produção..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCESSO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script no diretório raiz do projeto"
fi

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    log "Instalando Vercel CLI..."
    npm install -g vercel
fi

# Verificar se está logado no Vercel
if ! vercel whoami &> /dev/null; then
    log "Faça login na Vercel..."
    vercel login
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
    warning "Há mudanças não commitadas. Deseja continuar? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        error "Deploy cancelado. Faça commit das mudanças primeiro."
    fi
fi

# Build de produção
log "Fazendo build de produção..."
npm run build

if [ $? -ne 0 ]; then
    error "Build falhou. Corrija os erros antes de continuar."
fi

success "Build concluído com sucesso!"

# Verificar variáveis de ambiente
log "Verificando variáveis de ambiente..."

# Lista de variáveis obrigatórias para produção
REQUIRED_VARS=(
    "NEXT_PUBLIC_DEMO_MODE"
    "STRIPE_SECRET_KEY"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        warning "Variável $var não está definida. Configure-a na Vercel."
    fi
done

# Deploy para produção
log "Fazendo deploy para produção..."
vercel --prod --yes

if [ $? -eq 0 ]; then
    success "Deploy concluído com sucesso!"
    
    # Obter URL do deploy
    DEPLOY_URL=$(vercel ls --prod | grep "sistem-moara" | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOY_URL" ]; then
        success "Aplicação disponível em: $DEPLOY_URL"
        
        # Testar a aplicação
        log "Testando aplicação..."
        if curl -s -f "$DEPLOY_URL" > /dev/null; then
            success "Aplicação está respondendo corretamente!"
        else
            warning "Aplicação pode não estar respondendo. Verifique manualmente."
        fi
    fi
    
    # Informações pós-deploy
    echo ""
    echo "📋 Checklist pós-deploy:"
    echo "✅ Verifique se a aplicação está funcionando"
    echo "✅ Teste as funcionalidades principais:"
    echo "   - Faturamento Stripe"
    echo "   - Monitoramento SOLARMAN"
    echo "   - Gestão de créditos energéticos"
    echo "✅ Configure domínio personalizado (se necessário)"
    echo "✅ Configure monitoramento e alertas"
    echo "✅ Teste em diferentes dispositivos"
    
else
    error "Deploy falhou. Verifique os logs e tente novamente."
fi

echo ""
success "Deploy para produção concluído! 🎉" 