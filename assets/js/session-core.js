function slideTypeLabel(type){
  return {
    multiple: 'Múltipla escolha',
    wordcloud: 'Nuvem de palavras',
    stars: 'Avaliação com estrelas',
    open: 'Pergunta aberta',
    scale: 'Escala',
  }[type] || 'Slide';
}

function getDefaultSlides(templateKey = 'institucional'){
  const now = Date.now();
  const templates = {
    institucional: [
      { id: 'slide-' + now + '-1', type: 'multiple', title: 'Abertura do evento', prompt: 'Qual tema mais representa esta edição?', options: ['Liderança', 'Inovação', 'História', 'Cultura'] },
      { id: 'slide-' + now + '-2', type: 'wordcloud', title: 'Palavra-chave', prompt: 'Digite uma palavra para representar sua expectativa do evento.' },
      { id: 'slide-' + now + '-3', type: 'stars', title: 'Avaliação da abertura', prompt: 'Como você avalia o início da programação?', maxStars: 5 },
      { id: 'slide-' + now + '-4', type: 'open', title: 'Mensagem aberta', prompt: 'Deixe um comentário para a organização.' },
      { id: 'slide-' + now + '-5', type: 'scale', title: 'Relevância percebida', prompt: 'A programação está alinhada com suas expectativas?', min: 1, max: 5, leftLabel: 'Pouco alinhada', rightLabel: 'Muito alinhada' },
    ],
    academico: [
      { id: 'slide-' + now + '-1', type: 'multiple', title: 'Checkpoint de conteúdo', prompt: 'Qual bloco foi mais claro até agora?', options: ['Contexto histórico', 'Estudos de caso', 'Estratégias', 'Discussão'] },
      { id: 'slide-' + now + '-2', type: 'scale', title: 'Nível de dificuldade', prompt: 'Como você classifica a dificuldade do conteúdo?', min: 1, max: 5, leftLabel: 'Fácil', rightLabel: 'Desafiador' },
      { id: 'slide-' + now + '-3', type: 'wordcloud', title: 'Conceitos-chave', prompt: 'Qual conceito você considera mais importante?' },
      { id: 'slide-' + now + '-4', type: 'open', title: 'Dúvidas abertas', prompt: 'Escreva uma dúvida para o instrutor responder.' },
      { id: 'slide-' + now + '-5', type: 'stars', title: 'Ritmo da aula', prompt: 'Como você avalia o ritmo da condução?', maxStars: 5 },
    ],
    feedback: [
      { id: 'slide-' + now + '-1', type: 'stars', title: 'Satisfação geral', prompt: 'Qual sua nota para o evento?', maxStars: 5 },
      { id: 'slide-' + now + '-2', type: 'multiple', title: 'Ponto forte', prompt: 'O que mais agregou valor?', options: ['Conteúdo', 'Interação', 'Organização', 'Infraestrutura'] },
      { id: 'slide-' + now + '-3', type: 'scale', title: 'Recomendação', prompt: 'Qual a chance de recomendar este evento?', min: 1, max: 10, leftLabel: 'Baixa', rightLabel: 'Alta' },
      { id: 'slide-' + now + '-4', type: 'wordcloud', title: 'Sentimento final', prompt: 'Resuma o evento em uma palavra.' },
      { id: 'slide-' + now + '-5', type: 'open', title: 'Sugestões', prompt: 'O que podemos melhorar na próxima edição?' },
    ],
  };

  return templates[templateKey] || templates.institucional;
}

function normalizeSlide(slide){
  return {
    id: slide.id || 'slide-' + Date.now(),
    type: slide.type || 'multiple',
    title: slide.title || 'Novo slide',
    prompt: slide.prompt || '',
    options: Array.isArray(slide.options) ? slide.options.filter(Boolean) : [],
    min: Number(slide.min || 1),
    max: Number(slide.max || 5),
    leftLabel: slide.leftLabel || 'Menor',
    rightLabel: slide.rightLabel || 'Maior',
    maxStars: Number(slide.maxStars || 5),
  };
}

function formatDuration(sec){
  const total = Math.max(0, Math.floor(sec));
  const minutes = String(Math.floor(total / 60)).padStart(2, '0');
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function generateSessionPin(){
  return String(Math.floor(100000 + Math.random() * 900000));
}

window.CBHMSessionCore = {
  slideTypeLabel,
  getDefaultSlides,
  normalizeSlide,
  formatDuration,
  generateSessionPin,
};

window.slideTypeLabel = slideTypeLabel;
window.getDefaultSlides = getDefaultSlides;
window.normalizeSlide = normalizeSlide;
window.formatDuration = formatDuration;
window.generateSessionPin = generateSessionPin;
