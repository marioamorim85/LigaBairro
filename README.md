# LigaBairro 🏘️

Uma plataforma hiperlocal para Fiães, Santa Maria da Feira, que conecta pessoas que precisam de ajuda com pequenas tarefas a voluntários/freelancers locais.

## 🚀 Funcionalidades Implementadas

- ✅ **Autenticação Google OAuth**: Login seguro com conta Google
- ✅ **Geolocalização**: Restrição geográfica a Fiães (raio de 7km)  
- ✅ **Pedidos de Ajuda**: Criar e gerir pedidos com categorias predefinidas
- ✅ **Sistema de Aplicações**: Voluntários podem candidatar-se a pedidos
- ✅ **Chat em Tempo Real**: WebSockets para comunicação entre utilizadores
- ✅ **Upload de Imagens**: Avatares e imagens para pedidos com Sharp
- ✅ **Sistema de Avaliações**: Rating entre utilizadores
- ✅ **Validação Completa**: Inputs validados com class-validator
- ✅ **Notificações Toast**: Feedback visual para todas as ações
- ✅ **Segurança**: Rate limiting, CORS, Helmet, autenticação JWT

## 🛠️ Stack Tecnológica

### Backend
- **NestJS 10+** com TypeScript
- **GraphQL** (code-first com decorators)
- **Prisma + PostgreSQL** para base de dados
- **Socket.io** para WebSockets
- **Sharp** para processamento de imagens
- **JWT + Google OAuth 2.0** para autenticação

### Frontend  
- **Next.js 14** (App Router)
- **Apollo Client** para GraphQL
- **Tailwind CSS + shadcn/ui** para UI
- **React Hook Form** para formulários
- **Leaflet** para mapas
- **Socket.io Client** para tempo real

## ⚡ Instalação Rápida

### 1. Dependências já Instaladas ✅
```bash
cd LigaBairro/backend && npm install --legacy-peer-deps  # ✅ Feito
cd LigaBairro/frontend && npm install --legacy-peer-deps # ✅ Feito
```

### 2. Configurar Base de Dados
```bash
# Criar base de dados PostgreSQL
createdb ligabairro

# Executar migrações
cd backend
npx prisma migrate dev --name init
npx prisma db seed  # (opcional)
```

### 3. 🔑 Configurar Google OAuth (OBRIGATÓRIO)

**⚠️ PASSO CRÍTICO**: A aplicação NÃO funcionará sem estas credenciais!

1. Vai ao [Google Cloud Console](https://console.cloud.google.com/)
2. Cria projeto e ativa Google+ API
3. Cria credenciais OAuth 2.0:
   - **JavaScript origins**: `http://localhost:3000`, `http://localhost:4000`
   - **Redirect URI**: `http://localhost:4000/auth/google/callback`

4. **Edita o ficheiro `backend/.env`** e substitui:
```env
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

📖 **Ver instruções detalhadas em**: `SETUP-OAUTH.md`

### 4. Executar Aplicação
```bash
# Terminal 1: Backend
cd backend && npm run start:dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

🎉 **Aplicação disponível em**: http://localhost:3000

## 📊 Estado Atual do Projeto

### ✅ 100% Implementado e Funcional:
- Sistema completo de autenticação
- CRUD de pedidos com geolocalização
- Sistema de aplicações e matching
- Chat em tempo real com WebSockets
- Upload e galeria de imagens
- Sistema de avaliações
- Validação completa de todos os inputs
- Notificações toast em tempo real
- Segurança e rate limiting
- Health checks e logs estruturados

### 📁 Ficheiros de Configuração Criados:
- ✅ `backend/.env` - Variáveis de ambiente
- ✅ `frontend/.env` - URLs do backend
- ✅ `backend/.env.example` - Template de configuração
- ✅ `SETUP-OAUTH.md` - Guia de configuração OAuth

## 🗂️ Estrutura Principal

```
LigaBairro/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── auth/              # Google OAuth
│   │   ├── users/             # Gestão utilizadores
│   │   ├── requests/          # Pedidos de ajuda
│   │   ├── applications/      # Sistema candidaturas
│   │   ├── messages/          # Chat tempo real
│   │   ├── uploads/           # Sistema imagens
│   │   └── common/            # Middlewares, guards
│   └── prisma/schema.prisma   # Schema da BD
├── frontend/                   # Next.js App
│   └── src/
│       ├── app/               # Páginas (App Router)
│       ├── components/        # Componentes UI
│       └── lib/               # GraphQL, utils
├── README.md                   # Este ficheiro
├── SETUP-OAUTH.md             # Configuração OAuth
└── .env files                 # Configuração ambiente
```

## 🎯 Para Começar AGORA:

1. **Configura Google OAuth** (passo crítico!)
2. **Inicia PostgreSQL** 
3. **Executa migrações**: `cd backend && npx prisma migrate dev`
4. **Inicia backend**: `npm run start:dev`
5. **Inicia frontend**: `npm run dev`
6. **Testa em**: http://localhost:3000

---

## 🆘 Resolução de Problemas

### ❌ "redirect_uri_mismatch"
- Confirma URL exata no Google Cloud: `http://localhost:4000/auth/google/callback`

### ❌ Erro PostgreSQL
- Confirma que PostgreSQL está a executar
- Verifica DATABASE_URL no `.env`

### ❌ Dependências
- Usa sempre `--legacy-peer-deps`
- Remove `node_modules` e reinstala se necessário

---

**✅ MVP COMPLETO E FUNCIONAL** - Apenas configura Google OAuth para começar!