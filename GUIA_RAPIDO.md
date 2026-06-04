# 🎯 GUIA RÁPIDO - 5 MELHORIAS IMPLEMENTADAS

## 1️⃣ NOVO: Você não será mais deslogado a cada 30 minutos ✅
- **Antes**: 15 minutos de sessão
- **Agora**: 8 horas de sessão
- **O que faz**: Você pode deixar o app aberto o dia todo sem ser deslogado!

---

## 2️⃣ NOVO: Campo "Feedback da Resposta" 💬
Você pode agora adicionar uma explicação para cada questão!

### Como usar:
1. Ao criar uma questão, role até o final
2. Encontre o campo **"Feedback da Resposta"**
3. Escreva uma explicação breve (ex: "A resposta correta é B porque a Batalha de X...")
4. Salve a questão
5. Quando os militares responderem, verão o feedback! 📖

**Benefício**: Reduz pedidos de ponderação porque o feedback esclarece dúvidas.

---

## 3️⃣ NOVO: Adicionar Imagens nas Questões 🖼️
Agora você pode colocar imagens junto com a pergunta!

### Como usar:
1. Ao criar uma questão, após preencher a pergunta, encontre **"Imagem da Questão"**
2. Escolha uma das opções:
   - **Cola uma URL**: Se a imagem está na internet (ex: `https://exemplo.com/imagem.jpg`)
   - **Ou upload um arquivo**: Clique em "envie um arquivo de imagem" e escolha do seu PC
3. Salve a questão
4. No quiz, a imagem aparecerá junto com a pergunta! 📸

**Dica**: Imagens ajudam muito em questões de história militar com mapas, fotos, brasões, etc.

---

## 4️⃣ NOVO: Botão "Salvar + Nova Questão" ⬇️
Para NÃO ter que rolar para cima toda vez que cadastra uma questão!

### Como usar:
1. Preencha todos os campos da questão
2. Em vez de clicar em "Salvar Questão", clique em **"Salvar + Nova Questão"**
3. A questão é salva e UM NOVO FORMULÁRIO abre automaticamente! ⚡
4. Continue preenchendo a próxima questão sem rolar

**Ganha tempo**: Muito mais rápido para cadastrar várias questões seguidas!

---

## 5️⃣ NOVO: Importação de Questões em Lote (CSV/JSON) 📥
Não precisa mais copiar/colar um por um! 

### Como usar (MÉTODO 1 - Arquivo JSON):

**Passo 1**: Prepare um arquivo JSON com suas questões
```json
[
  {
    "text": "Qual foi...?",
    "opts": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
    "correct": 0,
    "cat": "Categoria",
    "feedback": "Explicação...",
    "imageUrl": ""
  }
]
```

**Passo 2**: Clique em **"📥 Importar Lote"** na seção de questões

**Passo 3**: Clique em "Arquivo JSON ou CSV" e escolha seu arquivo

**Passo 4**: Clique em "Importar"

✅ Pronto! Suas questões foram adicionadas!

---

### Como usar (MÉTODO 2 - Texto direto):

**Passo 1**: Clique em **"📥 Importar Lote"**

**Passo 2**: Cole um JSON válido no campo **"Ou cole o JSON diretamente"**

```json
[
  {"text":"Pergunta?","opts":["A","B","C","D"],"correct":0,"cat":"Tema","feedback":"","imageUrl":""}
]
```

**Passo 3**: Clique em "Importar"

✅ Pronto!

---

### Como usar (MÉTODO 3 - Arquivo CSV):

**Formato CSV esperado:**
```
Pergunta|Opção A|Opção B|Opção C|Opção D|Resposta (0-3)|Categoria|Feedback
Qual foi...?|Opção 1|Opção 2|Opção 3|Opção 4|0|História|Explicação aqui
```

**Passo 1**: Salve seu arquivo com extensão `.csv`

**Passo 2**: Clique em **"📥 Importar Lote"**

**Passo 3**: Clique em "Arquivo JSON ou CSV" e escolha seu arquivo

**Passo 4**: Clique em "Importar"

✅ Pronto!

---

## 📚 ARQUIVO DE EXEMPLO

Existe um arquivo chamado **`exemplo_questoes_importacao.json`** na pasta do projeto com 10 questões prontas para importar! Use como modelo.

### Como usar:
1. Abra o arquivo `exemplo_questoes_importacao.json` 
2. Clique em "📥 Importar Lote"
3. Cole todo o conteúdo do arquivo no textarea
4. Clique em "Importar"

---

## ⚡ FLUXO RECOMENDADO PARA CADASTRO EM LOTE

### Antes (Lento):
1. Copiar pergunta 1 ❌
2. Colar e preencher ❌
3. Rolar para cima ❌
4. Repetir 50 vezes 😫

### Agora (Rápido):
1. Prepare um arquivo JSON/CSV com TODAS as questões
2. Clique em "📥 Importar Lote"
3. Upload ou cole
4. Pronto! ⚡ 50 questões importadas em 10 segundos!

---

## 🎬 VÍDEO RESUMO (Passos Principais)

### Para ADD Imagem:
Campo "Imagem da Questão" → Upload ou URL → Salvar

### Para ADD Feedback:
Campo "Feedback da Resposta" → Escreva explicação → Salvar

### Para Importar:
📥 Importar Lote → Escolha JSON/CSV → Clique Importar

### Para Criar Rápido:
Salvar + Nova Questão → Preencher → Repetir

---

## ❓ DÚVIDAS FREQUENTES

### P: Posso colocar imagem de um arquivo local?
R: Sim! Use "envie um arquivo de imagem" no modal. A imagem é salva automaticamente.

### P: Preciso da internet para usar imagens?
R: Não se fizer upload do arquivo. Se usar URL, precisa de internet.

### P: Posso editar uma questão importada?
R: Sim! Clique no ✏️ ao lado da questão e edite como normal.

### P: E se errar ao importar?
R: Você pode deletar as questões com 🗑️. Não faz mal importar errado.

### P: Qual formato de imagem é melhor?
R: JPG é mais leve, PNG é mais claro. Qualquer um funciona.

### P: Posso importar questões com acentuação?
R: Sim! Suporta português com acentos normalmente.

---

## 📞 SE ALGO NÃO FUNCIONAR

1. Abra o DevTools (pressione F12)
2. Clique em "Console"
3. Tente novamente
4. Se houver erro em vermelho, copie o erro e envie

---

## 🎯 RESUMO: O QUE MUDOU

| Funcionalidade | Antes | Depois |
|---|---|---|
| Duração da sessão | 15 min | 8 horas |
| Explicação de respostas | Não | Sim ✅ |
| Imagens nas questões | Não | Sim ✅ |
| Novo formulário rápido | Rolar para cima | Botão "Salvar + Nova" ✅ |
| Importar questões | 1 por 1 | Lote inteiro ✅ |

---

**Bora testar! 🚀**
