# PorPerto 🏘️

Uma plataforma hiperlocal para Mozelos, Santa Maria da Feira, que conecta pessoas que precisam de ajuda com pequenas tarefas a voluntários/freelancers locais.

**🎯 Data de Lançamento**: 7 de setembro de 2025  
**🌍 Localização**: Mozelos, Santa Maria da Feira (raio de 7km)  
**👥 Público**: Comunidade local de Mozelos

## 🚀 Funcionalidades Implementadas

### 🔐 Autenticação & Segurança

- ✅ **Google OAuth 2.0**: Login seguro com conta Google
- ✅ **JWT Authentication**: Tokens seguros para sessões
- ✅ **Rate Limiting**: Proteção contra spam e ataques
- ✅ **CORS & Helmet**: Segurança de headers HTTP
- ✅ **Role-based Access**: Sistema de permissões (USER/ADMIN)

### 🗺️ Geolocalização & Mapas

- ✅ **Restrição Geográfica**: Limitado a Mozelos (raio de 7km)
- ✅ **Mapas Interativos**: Leaflet para visualização de localização
- ✅ **Seletor de Localização**: Interface intuitiva para definir locais

### 📝 Sistema de Pedidos

- ✅ **CRUD Completo**: Criar, editar, visualizar e gerir pedidos
- ✅ **Categorias Predefinidas**: Organização por tipos de serviço
- ✅ **Upload de Imagens**: Galeria de fotos para pedidos
- ✅ **Agendamento**: Data e hora pretendida para o serviço
- ✅ **Orçamento**: Sistema de valores para serviços pagos
- ✅ **Estados**: OPEN, IN_PROGRESS, DONE, CANCELLED, STANDBY

### 👥 Sistema de Aplicações

- ✅ **Candidaturas**: Voluntários podem aplicar-se aos pedidos
- ✅ **Mensagens**: Notas opcionais na candidatura
- ✅ **Aceitação**: Donos dos pedidos podem aceitar candidaturas
- ✅ **Estados**: APPLIED, ACCEPTED, REJECTED

### 💬 Chat em Tempo Real

- ✅ **WebSockets**: Comunicação instantânea via Socket.io
- ✅ **Salas por Pedido**: Chat específico para cada pedido
- ✅ **Notificações**: Alertas de novas mensagens
- ✅ **Histórico**: Persistência de conversas

### ⭐ Sistema de Avaliações

- ✅ **Avaliações Bilaterais**: Entre solicitantes e ajudantes
- ✅ **Sistema de Estrelas**: Rating de 1 a 5 estrelas
- ✅ **Comentários**: Feedback textual opcional
- ✅ **Média de Ratings**: Cálculo automático de avaliação média
- ✅ **Visualização Pública**: Reviews visíveis para todos

### 🔔 Sistema de Notificações

- ✅ **Notificações em Tempo Real**: Via WebSockets
- ✅ **Tipos Múltiplos**: Candidaturas, mensagens, estado de pedidos
- ✅ **Centro de Notificações**: Interface para gerir alertas
- ✅ **Preferências**: Controlo de notificações por email

### 🛡️ Sistema de Denúncias

- ✅ **Denunciar Utilizadores**: Reportar comportamento inadequado
- ✅ **Denunciar Pedidos**: Reportar conteúdo impróprio
- ✅ **Categorias**: SPAM, conteúdo inadequado, fraude, etc.
- ✅ **Gestão Admin**: Interface para resolver denúncias

### 👤 Gestão de Perfil

- ✅ **Avatar Google**: Integração com foto da conta Google
- ✅ **Biografia**: Descrição pessoal do utilizador
- ✅ **Competências**: Sistema de skills/talentos
- ✅ **Histórico**: Visualização de pedidos e candidaturas

### 🎛️ Painel de Administração

- ✅ **Dashboard**: Estatísticas e métricas da plataforma
- ✅ **Gestão de Utilizadores**: Bloquear, desbloquear, promover
- ✅ **Gestão de Pedidos**: Moderar e gerir todos os pedidos
- ✅ **Gestão de Denúncias**: Resolver reports da comunidade
- ✅ **Relatórios de Atividade**: Análise de crescimento e uso
- ✅ **Configurações do Sistema**: Monitorização e saúde da aplicação

## 🛠️ Stack Tecnológica

### Backend (NestJS + GraphQL)

- **NestJS 10+** com TypeScript
- **GraphQL Code-First** com decorators
- **Prisma ORM** + PostgreSQL
- **Socket.io** para WebSockets
- **Sharp** para processamento de imagens
- **JWT + Google OAuth 2.0**
- **Class-validator** para validação
- **Winston** para logging estruturado
- **Helmet + CORS** para segurança

### Frontend (Next.js 14 + React)

- **Next.js 14** com App Router
- **Apollo Client** para GraphQL
- **Tailwind CSS** + **shadcn/ui** para design system
- **React Hook Form** + **Zod** para formulários
- **Leaflet** para mapas interativos
- **Socket.io Client** para tempo real
- **Sonner** para toast notifications
- **Radix UI** para componentes acessíveis

### Infraestrutura & DevOps

- **PostgreSQL** como base de dados principal
- **Docker Compose** para desenvolvimento local
- **Health Checks** para monitorização
- **Rate Limiting** e **Throttling**
- **Logging estruturado** com Winston
- **Environment Variables** para configuração

## ⚡ Instalação e Configuração

### 1. Pré-requisitos

```bash
# Node.js 18+
# PostgreSQL 13+
# Git
```

### 2. Clonar Repositório

```bash
git clone <repository-url>
cd PorPerto
```

### 3. Configurar Base de Dados

```bash
# Criar base de dados PostgreSQL
createdb porperto

# Configurar variáveis de ambiente no backend/.env
DATABASE_URL="postgresql://username:password@localhost:5432/porperto"
```

### 4. 🔑 Configurar Google OAuth (OBRIGATÓRIO)

**⚠️ PASSO CRÍTICO**: A aplicação NÃO funcionará sem estas credenciais!

1. Acede ao [Google Cloud Console](https://console.cloud.google.com/)
2. Cria um novo projeto ou seleciona um existente
3. Ativa a **Google+ API** e **Google OAuth 2.0**
4. Cria credenciais OAuth 2.0:

   - **JavaScript origins**: `http://localhost:3000`, `http://localhost:4000`
   - **Redirect URI**: `http://localhost:4000/auth/google/callback`

5. **Configura o ficheiro `backend/.env`**:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/porperto"

# App URLs
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:4000"
```

📖 **Ver instruções detalhadas**: `SETUP-OAUTH.md`

### 5. Instalar Dependências

```bash
# Backend
cd backend
npm install --legacy-peer-deps

# Frontend
cd ../frontend
npm install --legacy-peer-deps
```

### 6. Executar Migrações

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed  # (opcional - dados de exemplo)
```

### 7. Executar Aplicação

```bash
# Terminal 1: Backend (porta 4000)
cd backend
npm run start:dev

# Terminal 2: Frontend (porta 3000)
cd frontend
npm run dev
```

🎉 **Aplicação disponível em**: http://localhost:3000

## 📁 Estrutura do Projeto

```
PorPerto/
├── backend/                     # NestJS API Backend
│   ├── src/
│   │   ├── auth/               # Google OAuth & JWT
│   │   ├── users/              # Gestão de utilizadores
│   │   ├── requests/           # Sistema de pedidos
│   │   ├── applications/       # Sistema de candidaturas
│   │   ├── messages/           # Chat em tempo real
│   │   ├── reviews/            # Sistema de avaliações
│   │   ├── notifications/      # Sistema de notificações
│   │   ├── reports/            # Sistema de denúncias
│   │   ├── statistics/         # Métricas e analytics
│   │   ├── uploads/            # Gestão de ficheiros
│   │   ├── health/             # Health checks
│   │   └── common/             # Guards, decorators, utils
│   ├── prisma/
│   │   ├── schema.prisma       # Schema da base de dados
│   │   ├── migrations/         # Migrações SQL
│   │   └── seed.ts            # Dados iniciais
│   └── uploads/                # Ficheiros carregados
├── frontend/                   # Next.js Frontend
│   └── src/
│       ├── app/                # App Router (Next.js 14)
│       │   ├── (protected)/    # Rotas protegidas
│       │   │   ├── admin/      # Painel de administração
│       │   │   ├── requests/   # Gestão de pedidos
│       │   │   ├── profile/    # Perfil do utilizador
│       │   │   └── notifications/ # Centro de notificações
│       │   ├── (public)/       # Páginas públicas
│       │   └── auth/           # Autenticação
│       ├── components/         # Componentes React
│       │   ├── ui/             # Componentes base (shadcn/ui)
│       │   ├── auth/           # Componentes de autenticação
│       │   ├── layout/         # Layout e navegação
│       │   └── report/         # Sistema de denúncias
│       └── lib/                # Utilitários
│           ├── graphql/        # Queries e mutations
│           ├── socket.ts       # Cliente WebSocket
│           └── utils.ts        # Funções auxiliares
├── scripts/                    # Scripts de deployment
├── .env.example               # Template de configuração
├── docker-compose.yml         # Docker para desenvolvimento
├── README.md                  # Este ficheiro
└── SETUP-OAUTH.md            # Guia OAuth detalhado
```

## 🎯 Como Usar a Plataforma

### Para Solicitantes (Quem Precisa de Ajuda):

1. **Regista-te** com a tua conta Google
2. **Cria um pedido** descrevendo a tarefa que precisas
3. **Define localização** no mapa (restrito a Mozelos)
4. **Aguarda candidaturas** de voluntários locais
5. **Aceita uma candidatura** e combina os detalhes via chat
6. **Avalia a experiência** após a conclusão

### Para Ajudantes (Voluntários/Freelancers):

1. **Regista-te** e completa o teu perfil
2. **Explora pedidos** disponíveis na tua área
3. **Candidata-te** aos que te interessam
4. **Comunica via chat** se a candidatura for aceita
5. **Executa o serviço** conforme combinado
6. **Recebe avaliação** e constrói a tua reputação

### Para Administradores:

1. **Acede ao painel admin** (utilizadores com role ADMIN)
2. **Monitoriza estatísticas** da plataforma no dashboard
3. **Gere utilizadores** (bloquear/desbloquear)
4. **Modera conteúdo** e resolve denúncias
5. **Analisa relatórios** de atividade e crescimento

## 📊 Métricas e Analytics

O sistema inclui um dashboard completo com:

- **📈 Crescimento**: Novos utilizadores e pedidos
- **⚡ Atividade**: Utilizadores ativos, mensagens trocadas
- **🎯 Conversão**: Taxa de pedidos concluídos
- **⭐ Qualidade**: Avaliações médias da comunidade
- **🛡️ Segurança**: Denúncias pendentes e resolvidas
- **🏥 Saúde**: Uptime, latência e erros do sistema

## 🔧 Scripts Disponíveis

### Backend

```bash
npm run start:dev       # Desenvolvimento com hot reload
npm run build          # Build para produção
npm run start:prod      # Executar build de produção
npm run db:migrate      # Executar migrações
npm run db:seed         # Popular com dados exemplo
npm run db:studio       # Interface visual da BD
npm test               # Executar testes
```

### Frontend

```bash
npm run dev            # Servidor de desenvolvimento
npm run build          # Build otimizado para produção
npm run start          # Servir build de produção
npm run lint           # Verificar código
npm run type-check     # Verificação TypeScript
```

## 🆘 Resolução de Problemas

### ❌ "redirect_uri_mismatch"

- **Causa**: URL de callback OAuth incorreta
- **Solução**: Confirma que tens `http://localhost:4000/auth/google/callback` nas configurações do Google Cloud

### ❌ Erro de Conexão PostgreSQL

- **Causa**: Base de dados não está a executar ou URL incorreta
- **Solução**:

  ```bash
  # Verificar se PostgreSQL está ativo
  sudo service postgresql start

  # Verificar DATABASE_URL no .env
  ```

### ❌ Erro "EADDRINUSE"

- **Causa**: Porta já está ocupada
- **Solução**: Mata processos nas portas 3000/4000 ou altera as portas

### ❌ Problemas com Dependências

- **Solução**: Usa sempre `--legacy-peer-deps` e remove `node_modules` se necessário
  ```bash
  rm -rf node_modules package-lock.json
  npm install --legacy-peer-deps
  ```

### ❌ Erro de Geolocalização

- **Causa**: Browser não suporta ou permissão negada
- **Solução**: Permite acesso à localização ou define manualmente no mapa

## 🚀 Deploy em Produção

### Variáveis de Ambiente (Produção)

```env
# Backend
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:port/db"
GOOGLE_CLIENT_ID="prod-client-id"
GOOGLE_CLIENT_SECRET="prod-client-secret"
JWT_SECRET="super-secure-production-secret"
FRONTEND_URL="https://yourdomain.com"

# Frontend
NEXT_PUBLIC_BACKEND_URL="https://api.yourdomain.com"
NEXT_PUBLIC_WS_URL="https://api.yourdomain.com"
```

### Docker Compose (Opcional)

```bash
# Executar com Docker
docker-compose up -d
```

## 🤝 Contribuir

1. Fork o projeto
2. Cria uma branch para a tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit as mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abre um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - vê o ficheiro `LICENSE` para mais detalhes.

## 📞 Suporte

Para questões ou suporte:

- 📧 Email: [mario@marioamorim.com]

---

**✅ PorPerto - 100% Funcional** - Pronta para a comunidade de Mozelos! 🎉

_Construída com ❤️ para conectar a comunidade local_
