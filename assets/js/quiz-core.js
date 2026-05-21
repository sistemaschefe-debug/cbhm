// Quiz/session core module (exposes compatibility APIs on window)
// Extracted from index.html to reduce monolith size.
export let quizState = null;
export let timerInterval = null;
export const QUESTION_TIME = 30;
export const CIRCUMFERENCE = 2 * Math.PI * 62;

function getPoints(elapsed){
  if(elapsed<=5)  return 30;
  if(elapsed<=10) return 25;
  if(elapsed<=15) return 20;
  if(elapsed<=20) return 15;
  if(elapsed<=30) return 10;
  return 0;
}

export function startQuiz(){
  if(!window.activeSession?.active){ window.toast && window.toast('Nenhuma sessão ativa. Crie uma sessão primeiro.','err'); window.showScreen && window.showScreen('sAdmin'); return; }

  quizState = {
    questions: window.activeSession.questions||[],
    currentQ:  0,
    teamScores: Object.fromEntries((window.teams||[]).map(t=>[t.id,{score:t.score,streak:0,name:t.name,school:t.school}])),
    answered:  {},
  };

  window.quizState = quizState;
  renderQuizQuestion();
}

export function renderQuizQuestion(){
  const qs   = quizState.questions;
  const idx  = quizState.currentQ;
  if(idx>=qs.length){ endQuiz(); return; }

  const q = qs[idx];
  quizState.answered = {};
  clearInterval(timerInterval);

  document.getElementById('qNumLabel').textContent = `QUESTÃO ${idx+1} DE ${qs.length}`;
  document.getElementById('qCatDisplay').textContent = q.cat||'História Militar';
  document.getElementById('qStatement').textContent  = q.text;

  const keys=['A','B','C','D'];
  document.getElementById('answerGrid').innerHTML = q.opts.map((o,i)=>`
    <button class="ans-btn" id="ans${i}" onclick="adminSelectAnswer(${i})">
      <span class="ans-key">${keys[i]}</span>
      <span>${o}</span>
    </button>
  `).join('');

  renderTeamsPanel();
  updateStreakBar();
  startTimer();
}

export let timerSec = QUESTION_TIME;

export function startTimer(){
  timerSec = QUESTION_TIME;
  updateTimerUI(timerSec);
  timerInterval = setInterval(()=>{
    timerSec--;
    updateTimerUI(timerSec);
    if(timerSec<=0){ clearInterval(timerInterval); revealAnswer(); }
  },1000);
  window.timerInterval = timerInterval;
}

export function updateTimerUI(sec){
  const el = document.getElementById('timerVal'); if(el) el.textContent = sec;
  const pct  = sec/QUESTION_TIME;
  const offset = CIRCUMFERENCE*(1-pct);
  const ring = document.getElementById('ringFill'); if(ring) ring.style.strokeDashoffset = offset;
  if(ring) ring.style.stroke = sec>15 ? 'var(--gold)' : sec>8 ? '#e8a000' : 'var(--red2)';
  const ptsEl = document.getElementById('pointsNow'); if(ptsEl) ptsEl.textContent = getPoints(QUESTION_TIME-sec);
}

export function adminSelectAnswer(optIdx){
  const q   = quizState.questions[quizState.currentQ];
  const elapsed = QUESTION_TIME - timerSec;
  const pts = getPoints(elapsed);
  const correct = optIdx===q.correct;

  document.querySelectorAll('.ans-btn').forEach((b,i)=>{
    b.disabled=true;
    if(i===optIdx) b.classList.add(correct?'correct':'wrong');
    if(i===q.correct) b.classList.add('correct');
  });

  clearInterval(timerInterval);
  if(correct) window.confetti && window.confetti(pts>=30?'#c9a84c':'#2d7a4e');
  setTimeout(()=>nextQuestion(),2200);
}

export function revealAnswer(){
  const q = quizState.questions[quizState.currentQ];
  document.querySelectorAll('.ans-btn').forEach((b,i)=>{
    b.disabled=true;
    if(i===q.correct) b.classList.add('correct');
  });
  setTimeout(()=>nextQuestion(),2000);
}

export function skipQuestion(){ clearInterval(timerInterval); nextQuestion(); }

export function nextQuestion(){
  quizState.currentQ++;
  if(quizState.currentQ>=quizState.questions.length){ endQuiz(); return; }
  renderQuizQuestion();
}

export function scoreTeam(teamId, correct, elapsed){
  const ts = quizState.teamScores;
  if(!ts[teamId]) return;
  const pts = correct ? getPoints(elapsed) : 0;

  if(correct){
    ts[teamId].streak++;
    ts[teamId].score += pts;
  } else {
    ts[teamId].streak = 0;
    ts[teamId].score -= 15;
    if(ts[teamId].score < 0) ts[teamId].score = 0;
  }

  const t = (window.teams||[]).find(t=>t.id===teamId);
  if(t){ t.score=ts[teamId].score; if(window.sb && window._sb) window._sb.from('kv').upsert({ key:'teams', value: window.teams }, { onConflict:'key' }); else window.lsSet && window.lsSet('teams', window.teams); }
  renderTeamsPanel();
}

export function renderTeamsPanel(){
  if(!quizState?.teamScores) return;
  const el = document.getElementById('teamsPanel');
  const sorted = Object.entries(quizState.teamScores).sort((a,b)=>b[1].score-a[1].score);
  el.innerHTML = sorted.map(([id,t])=>`
    <div class="team-panel" id="tp_${id}">
      ${window.teamAvatarHtml ? window.teamAvatarHtml((window.teams||[]).find(tm=>tm.id===id)||{},'team-avatar-sm') : ''}
      <div>
        <div class="tp-name">${t.name ? t.name : ''}</div>
        <div class="tp-school">${t.school ? t.school : ''}</div>
      </div>
      <div class="tp-score">${t.score}<span style="font-size:.65rem;color:var(--muted)"> pts</span></div>
    </div>
  `).join('') || '<p style="color:var(--muted);font-style:italic;font-size:.85rem">Nenhuma equipe registrada.</p>';
}

export function updateStreakBar(){
  const bar = document.getElementById('streakBar');
  const txt = document.getElementById('streakText');
  const best = Object.values(quizState?.teamScores||{}).reduce((a,t)=>Math.max(a,t.streak),0);
  if(best>0){ bar.classList.remove('hidden'); txt.textContent = `Melhor sequência atual: ${best} acertos consecutivos em ≤5s. ${3-best} para o bônus!`; }
  else { bar.classList.add('hidden'); }
}

export function endQuiz(){
  clearInterval(timerInterval);
  (window.teams||[]).forEach(t=>{ if(quizState.teamScores && quizState.teamScores[t.id]) t.score=quizState.teamScores[t.id].score; });
  if(window.sb && window._sb) window._sb.from('kv').upsert({ key:'teams', value: window.teams }, { onConflict:'key' }); else window.lsSet && window.lsSet('teams', window.teams);
  window.showScreen && window.showScreen('sScoreboard');
  window.loadScoreboard && window.loadScoreboard();
  window.confetti && window.confetti('#c9a84c'); window.confetti && window.confetti('#e8c97a');
}

// Expose for legacy inline handlers
window.startQuiz = startQuiz;
window.renderQuizQuestion = renderQuizQuestion;
window.adminSelectAnswer = adminSelectAnswer;
window.revealAnswer = revealAnswer;
window.skipQuestion = skipQuestion;
window.nextQuestion = nextQuestion;
window.scoreTeam = scoreTeam;
window.renderTeamsPanel = renderTeamsPanel;
window.updateStreakBar = updateStreakBar;
window.endQuiz = endQuiz;
window.quizState = quizState;
