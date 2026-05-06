# ⚡ VotaAí — Guia Completo de Deploy Gratuito

## O que está incluído no app

| Recurso | Status |
|---|---|
| 5 tipos de slide (MC, Nuvem, Estrelas, Aberta, Escala) | ✅ |
| Firebase Realtime Database (votos ao vivo) | ✅ |
| Link de compartilhamento real por PIN | ✅ |
| QR Code para participantes | ✅ |
| Gemini AI — gera perguntas automaticamente | ✅ |
| Compartilhar via WhatsApp / Web Share API | ✅ |
| Modo demo local (sem Firebase) | ✅ |
| Responsivo (mobile + desktop) | ✅ |

---

## PASSO 1 — Firebase (banco em tempo real)

### 1.1 Criar projeto Firebase
1. Acesse https://console.firebase.google.com
2. Clique em **"Adicionar projeto"** → dê um nome → Next → Criar
3. No menu lateral: **Build → Realtime Database**
4. Clique em **"Criar banco de dados"** → escolha localização → **"Iniciar no modo de teste"**

### 1.2 Registrar app Web
1. Clique no ícone `</>` (Web) na página principal do projeto
2. Dê um apelido → clique em **"Registrar app"**
3. Copie o objeto `firebaseConfig` que aparecer

### 1.3 Colar no index.html
Abra o `index.html` e substitua a seção:

```javascript
const firebaseConfig = {
  apiKey:            "SUA_API_KEY",           // ← cole aqui
  authDomain:        "SEU_PROJETO.firebaseapp.com",
  databaseURL:       "https://SEU_PROJETO-default-rtdb.firebaseio.com",
  projectId:         "SEU_PROJETO",
  storageBucket:     "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId:             "SEU_APP_ID"
};
```

### 1.4 Regras do banco (modo teste — 30 dias grátis)
No Firebase Console → Realtime Database → **Regras**:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
> ⚠️ Para produção, adicione autenticação. Para testes, isso é suficiente.

---

## PASSO 2 — Gemini API Key (grátis)

1. Acesse https://aistudio.google.com/apikey
2. Clique em **"Create API key"** → copie a chave
3. No `index.html`, substitua:

```javascript
window.GEMINI_KEY = "SUA_GEMINI_API_KEY";  // ← cole aqui
```

**Limite gratuito Gemini 2.0 Flash:** 1.500 req/dia, 60 req/min — mais que suficiente.

---

## PASSO 3 — Hospedagem (escolha uma opção)

### 🟢 Opção A: GitHub Pages (recomendado — grátis para sempre)

```bash
# 1. Instale o Git: https://git-scm.com
# 2. Crie conta em github.com
# 3. Crie um repositório público chamado "votaai"

git init
git add index.html
git commit -m "VotaAí app"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/votaai.git
git push -u origin main
```

4. No GitHub: **Settings → Pages → Source: Deploy from branch → main → / (root)**
5. Seu app estará em: `https://SEU_USUARIO.github.io/votaai`

---

### 🔵 Opção B: Netlify (drag & drop — 30 segundos)

1. Acesse https://netlify.com → crie conta gratuita
2. Arraste a pasta `votaai/` para a área de deploy
3. Pronto! URL: `https://nome-aleatorio.netlify.app`
4. Para URL personalizada: **Site settings → Change site name**

---

### 🟡 Opção C: Vercel

```bash
npm install -g vercel
cd votaai
vercel
# Siga as instruções → seu app estará em yourapp.vercel.app
```

---

### 🔴 Opção D: Firebase Hosting (integrado com seu banco)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Selecione seu projeto → public directory: . → single-page app: Yes
firebase deploy
```
App em: `https://SEU_PROJETO.web.app`

---

## Como usar o app

### Apresentador
1. Clique em **"Criar sessão"**
2. Digite um tema e clique em **"✨ Gerar slides com Gemini"** (opcional)
3. Edite/adicione slides manualmente
4. Clique em **"🚀 Criar e iniciar sessão"**
5. Compartilhe o link ou PIN com os participantes
6. Use os botões de navegação para trocar de slide em tempo real

### Participante
1. Acessa o link compartilhado OU vai até o site e clica em **"Entrar com PIN"**
2. Digita o PIN de 4 dígitos
3. Vota/responde os slides em tempo real
4. Quando o apresentador troca de slide, o participante é notificado

---

## Limites do plano gratuito Firebase

| Recurso | Limite gratuito (Spark) |
|---|---|
| Realtime Database armazenamento | 1 GB |
| Transferência de dados | 10 GB/mês |
| Conexões simultâneas | 100 |
| Hospedagem (Firebase Hosting) | 10 GB/mês |

Para sessões de até 100 pessoas simultâneas, o plano gratuito é mais que suficiente.

---

## Estrutura dos dados no Firebase

```
sessions/
  {sessionId}/
    id: "abc123"
    pin: "4829"
    title: "Pesquisa de Opinião"
    host: "João"
    participants: 42
    currentSlide: 0
    active: true
    slides/
      0/
        type: "mc"
        title: "Qual tecnologia você usa?"
        options: ["React", "Vue", "Angular"]
        votes: { "0": 15, "1": 8, "2": 5 }
      1/
        type: "wordcloud"
        title: "Descreva inovação"
        words: ["criatividade", "tecnologia", ...]
```

---

## Dúvidas frequentes

**Q: Funciona sem Firebase?**
Sim! O app tem modo demo local para testes. Votos ficam na memória do navegador.

**Q: Posso ter múltiplas sessões simultâneas?**
Sim, cada sessão tem um ID único e PIN próprio.

**Q: Como personalizar o domínio?**
No Netlify/Vercel, configure um domínio próprio gratuitamente. No GitHub Pages, configure um CNAME.

**Q: O link compartilhado funciona no celular?**
Sim! O app é 100% responsivo. Participantes acessam pelo navegador do celular, sem instalar nada.
