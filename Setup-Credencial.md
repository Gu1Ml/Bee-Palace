# Setup Local - Credenciais para rodar localmente

## 1. Variáveis de Ambiente

Configure as variáveis antes de rodar:

### Windows (PowerShell)
```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/tdah_app"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "a_senha_postgres"
$env:JWT_SECRET = "chave_jwt"
```

### macOS/Linux
```bash
export DB_URL="jdbc:postgresql://localhost:5432/tdah_app"
export DB_USERNAME="postgres"
export DB_PASSWORD="a_senha_postgres"
export JWT_SECRET="chave_jwt"
```

## 2. Firebase Credentials

1. Baixar seu arquivo `firebase-credentials.json` do Firebase Console
2. Colocar em: `src/main/resources/firebase-credentials.json`

## 3. Rodar

```bash
mvn clean compile
mvn spring-boot:run
```

## Segurança

- ✅ NUNCA commitar credenciais no GitHub
- ✅ Usar variáveis de ambiente para tudo sensível
- ✅ Verificar `.gitignore` antes de fazer push
