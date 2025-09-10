# Configuração do Google OAuth

## 1. Criar Projeto no Google Cloud Console

1. Acede ao [Google Cloud Console](https://console.cloud.google.com/)
2. Cria um novo projeto ou seleciona um existente
3. Ativa a **Google+ API** ou **Google Identity API**

## 2. Configurar OAuth 2.0

1. Vai a **APIs & Services** > **Credentials**
2. Clica em **Create Credentials** > **OAuth 2.0 Client IDs**
3. Seleciona **Web application**
4. Configura:
   - **Name**: PorPerto
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (desenvolvimento)
     - `http://localhost:4000` (backend)
   - **Authorized redirect URIs**:
     - `http://localhost:4000/auth/google/callback`

## 3. Obter Credenciais

1. Copia o **Client ID** e **Client Secret**
2. Adiciona ao ficheiro `.env`:

```env
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 4. Configurar Domínios Autorizados

1. No Google Cloud Console, vai a **APIs & Services** > **OAuth consent screen**
2. Adiciona os domínios autorizados:
   - `localhost` (para desenvolvimento)
   - O teu domínio de produção

## 5. Testar Integração

1. Inicia o backend: `cd backend && npm run start:dev`
2. Inicia o frontend: `cd frontend && npm run dev`
3. Acede a `http://localhost:3000` e testa o login

## Notas Importantes

- **Desenvolvimento**: Usa `http://localhost` (não HTTPS)
- **Produção**: Usa sempre HTTPS
- **Callback URL**: Deve corresponder exatamente ao configurado no Google
- **Domínios**: Adiciona todos os domínios onde a aplicação será executada

## Troubleshooting

### Erro "redirect_uri_mismatch"
- Verifica se a URL de callback está corretamente configurada no Google Cloud Console
- A URL deve ser exatamente `http://localhost:4000/auth/google/callback`

### Erro "invalid_client"
- Verifica se o GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão corretos
- Certifica-te que não há espaços extra nas variáveis de ambiente