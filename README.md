# ⚡ CBHM 2026 — Guia Completo de Deploy Gratuito
# site: https://cbhm-rose.vercel.app/

## O que está incluído no app

| Recurso | Status |
|---|---|
| Quiz ao vivo com timer e pontuação | ✅ |
| Sessão com participantes em tempo real | ✅ |
| Placar geral e pódio | ✅ |
| Gemini AI — gera questões automaticamente | ✅ |
| Modo projetor (tela cheia para telão) | ✅ |
| Painel admin com perfis e permissões | ✅ |
| Banco de dados Supabase (sem regras manuais) | ✅ |
| Modo demo local (sem banco de dados) | ✅ |
| Responsivo (mobile + desktop) | ✅ |

---

## PASSO 1 — Supabase (banco de dados gratuito)

> O app foi migrado do Firebase para o **Supabase** — mais simples, sem regras manuais de permissão, painel visual intuitivo e plano gratuito generoso.

### 1.1 Criar conta e projeto

1. Acesse **https://supabase.com** e clique em **"Start your project"**
2. Faça login com GitHub ou e-mail
3. Clique em **"New project"**
   - Dê um nome (ex: `cbhm2026`)
   - Escolha uma senha para o banco (guarde em lugar seguro)
   - Escolha a região mais próxima (ex: `South America (São Paulo)`)
4. Aguarde ~1 minuto enquanto o projeto é criado

### 1.2 Criar a tabela de dados

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Cole o SQL abaixo e clique em **"Run"** (▶):

```sql
-- Cria a tabela principal de dados (key-value com JSON)
CREATE TABLE IF NOT EXISTS kv (
  key   text PRIMARY KEY,
  value jsonb
);

-- Permite leitura e escrita sem autenticação (app público)
ALTER TABLE kv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acesso_publico_leitura"
  ON kv FOR SELECT USING (true);

CREATE POLICY "acesso_publico_escrita"
  ON kv FOR INSERT WITH CHECK (true);

CREATE POLICY "acesso_publico_update"
  ON kv FOR UPDATE USING (true);

CREATE POLICY "acesso_publico_delete"
  ON kv FOR DELETE USING (true);
```

4. Você verá **"Success. No rows returned"** — isso é correto ✅

### 1.3 Ativar o Realtime (para atualizações ao vivo)

1. No menu lateral, clique em **"Database"** → **"Replication"**
2. Na seção **"Tables"**, ative a tabela **`kv`** clicando no toggle
3. O status ficará verde — realtime ativado ✅

### 1.4 Obter as credenciais

1. No menu lateral, clique em **"Project Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Você verá dois valores importantes:
   - **Project URL** → algo como `https://abcxyz.supabase.co`
   - **anon / public key** → uma chave longa começando com `eyJ...`

### 1.5 Colar no index.html

Abra o `index.html` e substitua as linhas no topo do arquivo:

```javascript
window.SUPABASE_URL  = 'https://SEU_PROJETO.supabase.co';  // ← cole a Project URL
window.SUPABASE_KEY  = 'SUA_ANON_KEY';                      // ← cole a anon key
```

**Exemplo:**
```javascript
window.SUPABASE_URL  = 'https://abcxyz123.supabase.co';
window.SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

> ✅ **Não precisa configurar regras de permissão manualmente** — o SQL acima já cuida de tudo.

---

## PASSO 2 — Gemini API Key (grátis)

1. Acesse **https://aistudio.google.com/apikey**
2. Clique em **"Create API key"** → copie a chave
3. No `index.html`, substitua:

```javascript
window.GEMINI_KEY = 'SUA_GEMINI_API_KEY';  // ← cole aqui
```

**Limite gratuito Gemini 2.0 Flash:** 1.500 req/dia, 60 req/min — mais que suficiente.

---

## PASSO 3 — Hospedagem (escolha uma opção)

### 🟢 Opção A: GitHub Pages (recomendado — grátis para sempre)

```bash
# 1. Instale o Git: https://git-scm.com
# 2. Crie conta em github.com
# 3. Crie um repositório público chamado "cbhm2026"

git init
git add index.html README.md
git commit -m "CBHM 2026 app"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cbhm2026.git
git push -u origin main
```

4. No GitHub: **Settings → Pages → Source: Deploy from branch → main → / (root)**
5. Seu app estará em: `https://SEU_USUARIO.github.io/cbhm2026`

---

### 🔵 Opção B: Netlify (drag & drop — 30 segundos)

1. Acesse **https://netlify.com** → crie conta gratuita
2. Arraste a pasta com o `index.html` para a área de deploy
3. Pronto! URL: `https://nome-aleatorio.netlify.app`
4. Para URL personalizada: **Site settings → Change site name**

---

### 🟡 Opção C: Vercel

```bash
npm install -g vercel
vercel
# Siga as instruções → seu app estará em yourapp.vercel.app
```

---

## Como usar o app

### Administrador
1. Na landing page, clique em **"🔐 Acesso Restrito"**
2. Use as credenciais de admin (definidas no código)
3. Configure questões, equipes e sessão no painel lateral
4. Em **Sessão ao Vivo**, crie uma sessão e inicie o quiz
5. Use o **Modo Projetor** para exibir no telão (F11 = tela cheia)

### Participante / Equipe
1. Acessa a URL do app
2. Clica em **"🏛 Entrar como Equipe"**
3. Preenche escola, nome da equipe e código da sessão
4. Aguarda o início da competição

---

## Limites do plano gratuito Supabase

| Recurso | Limite gratuito |
|---|---|
| Banco de dados (PostgreSQL) | 500 MB |
| Transferência de dados | 5 GB/mês |
| Conexões simultâneas | Ilimitadas (pooling) |
| Realtime (websockets) | 200 conexões simultâneas |
| Projetos ativos | 2 projetos |

Para o CBHM com até 200 participantes simultâneos, o plano gratuito é mais que suficiente.

---

## Estrutura dos dados no Supabase

O app usa uma tabela `kv` (chave-valor com JSON) com as seguintes chaves:

```
questions        → array de questões de múltipla escolha
teams            → array de equipes participantes
activeSession    → objeto da sessão ao vivo (slides, respostas, participantes)
settings__landing → configurações da landing page
```

Você pode visualizar e editar os dados diretamente no painel do Supabase:
**Table Editor → kv**

---

## Diferenças em relação ao Firebase (anterior)

| Aspecto | Firebase (antes) | Supabase (agora) |
|---|---|---|
| Configuração de permissões | Regras JSON manuais | SQL simples (já incluído) |
| URL do banco | Precisava de `databaseURL` separada | Apenas URL + anon key |
| Painel visual | Limitado | Completo (SQL Editor, Table Editor) |
| Realtime | Via `onValue` | Via canal PostgreSQL |
| Fallback sem banco | localStorage | localStorage (mantido) |
| Plano gratuito | 1 GB / 100 conexões | 500 MB / 200 conexões |

---

## Dúvidas frequentes

**Q: O app funciona sem Supabase configurado?**
Sim! Se `SUPABASE_URL` contiver `SEU_PROJETO`, o app entra automaticamente em modo demo (localStorage). Tudo funciona localmente, mas dados não são compartilhados entre dispositivos.

**Q: Posso ter múltiplas sessões simultâneas?**
Sim, cada sessão tem um código único. Apenas uma sessão pode estar ativa no banco por vez (a `activeSession` é substituída).

**Q: Os dados ficam salvos entre sessões?**
Sim. Questões e equipes ficam salvas no Supabase permanentemente. A sessão ao vivo é sobrescrita a cada nova sessão criada.

**Q: Como resetar os dados?**
No painel Supabase → **Table Editor → kv** → selecione as linhas e delete, ou use o SQL Editor:
```sql
DELETE FROM kv WHERE key IN ('questions', 'teams', 'activeSession');
```

**Q: O link compartilhado funciona no celular?**
Sim! O app é 100% responsivo. Participantes acessam pelo navegador do celular, sem instalar nada.

**Q: E se o Realtime não funcionar?**
O app tem fallback automático para polling a cada 2 segundos — os participantes ainda veem as atualizações, com leve delay.
