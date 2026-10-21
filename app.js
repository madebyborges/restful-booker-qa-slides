/* Static presentation: no build step or external dependency. */
(() => {
  'use strict';
  const {cases, summary, date} = window.QA_DATA;
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = path => `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
  const right = icon('<path d="M5 12h14m-6-6 6 6-6 6"/>');
  $('previous').innerHTML = icon('<path d="M19 12H5m6-6-6 6 6 6"/>');
  $('next').innerHTML = right;
  $('open-index').innerHTML = icon('<path d="M4 5h4v4H4zm0 10h4v4H4zM13 5h7m-7 4h7m-7 6h7m-7 4h7"/>') + 'Índice';
  $('fullscreen').innerHTML = icon('<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>');
  const slides = [];
  function add(title, body, className = '') {
    const n = slides.length + 1;
    slides.push({title, html:`<section class="slide ${className}" id="slide-${n}" aria-label="${n}. ${esc(title)}" aria-hidden="true" inert>${body}</section>`});
  }
  add('Abertura', `<div class="cover-copy"><h1 data-reveal>Bugs da API<em>.</em></h1><h2 data-reveal style="--order:1">Evidências que explicam.</h2><p class="date" data-reveal style="--order:2">Reteste no Postman · ${esc(date)}</p><button class="start" data-go="1" data-reveal style="--order:3">Iniciar apresentação ${right}</button><p class="key-hint" data-reveal style="--order:4">Use as setas para navegar · F para tela cheia</p></div><aside class="metrics" data-reveal style="--order:2"><div class="metric"><strong>7</strong><span>bugs reproduzidos</span></div><div class="metric"><strong>16</strong><span>variações documentadas</span></div></aside>`, 'cover');
  add('Resumo dos bugs', `<h2 data-reveal>7 bugs. 16 variações.</h2><p class="lede" data-reveal style="--order:1">Criação de reservas · POST /booking · Avaliação frente aos critérios do case.</p><table class="summary-table" data-reveal style="--order:2"><thead><tr><th>Ocorrência</th><th>Falha observada</th><th>Variações</th><th>HTTP</th></tr></thead><tbody>${summary.map(s=>`<tr data-go="${2+cases.findIndex(c=>c.id===s.id)*2}" tabindex="0" role="button" aria-label="Abrir ${esc(s.id)}"><td>${esc(s.id)}</td><td>${esc(s.title)}</td><td>${s.count}</td><td>${esc(s.http)}</td></tr>`).join('')}</tbody></table><p class="overview-note" data-reveal style="--order:3">Selecione uma ocorrência para abrir a evidência. Cada print é seguido da análise do cenário.</p>`, 'overview');
  const brief = [
    'Campo obrigatório ausente causa erro interno genérico.',
    'Um objeto no nome não recebe validação controlada.',
    'Sobrenome ausente causa erro interno genérico.',
    'Preço ausente causa erro interno genérico.',
    'Pagamento ausente causa erro interno genérico.',
    'Datas ausentes causam erro interno genérico.',
    'Texto no pagamento é aceito e convertido para true.',
    'Número no pagamento é aceito e convertido para true.',
    'Checkout anterior ao check-in é aceito.',
    'Check-in e checkout iguais são aceitos.',
    'Período no passado é aceito para uma nova reserva.',
    'Preço em texto é aceito e devolvido como null.',
    'Preço nulo causa erro interno genérico.',
    'Objeto no preço é aceito e devolvido como null.',
    'Data inexistente é convertida para outro dia.',
    'Texto na data gera uma resposta contendo NaN.'
  ];
  const frame = (c,i) => `<figure class="evidence-frame"><img src="${esc(c.image)}" alt="${esc(c.id+' — '+c.title+': requisição e resposta no Postman')}" loading="lazy"><button class="enlarge" data-image="${i}">Ampliar print ↗</button></figure>`;
  cases.forEach((c,i) => {
    const num = `Variação ${String(i+1).padStart(2,'0')} / 16`;
    add(`${c.id} · ${c.title} · Evidência`, `<div class="case-title" data-reveal><h2>${esc(c.id)} · ${esc(c.title)}</h2><span class="case-number">${num}</span></div><div class="evidence-grid" data-reveal style="--order:1">${frame(c,i)}<div class="result-stack"><article class="result expected"><h3>Cenário esperado</h3><p>${esc(c.expected)}</p></article><article class="result obtained"><h3>Resultado obtido · ${c.http}</h3><p>${esc(c.obtained)}</p></article></div></div><aside class="why-strip" data-reveal style="--order:2"><div class="rule"><h3>Regra</h3><p>${esc(c.rule)}</p></div><div><h3>Por que é bug?</h3><p>${esc(brief[i])}</p></div><div><h3>Impacto possível</h3><p>${esc(c.impact)}</p></div></aside>`);
    add(`${c.id} · ${c.title} · Análise`, `<div class="case-title" data-reveal><h2>Por que é bug?</h2><span class="case-number">${esc(c.id)} · ${esc(c.title)}</span></div><div class="analysis-grid"><article class="gherkin" data-reveal style="--order:1"><h3>Cenário · ${esc(c.title)}</h3><div class="gherkin-line"><b>DADO</b><p>${esc(c.given)}</p></div><div class="gherkin-line"><b>QUANDO</b><p>${esc(c.when)}</p></div><div class="gherkin-line"><b>ENTÃO</b><p>${esc(c.expected)}</p></div></article><div class="reason-stack"><article class="reason rule" data-reveal style="--order:2"><h3>Requisito de referência</h3><p>${esc(c.rule)} · página 2 do case.</p></article><article class="reason" data-reveal style="--order:3"><h3>Relação entre evidência e falha</h3><p>${esc(c.analysis)}</p></article><article class="reason" data-reveal style="--order:4"><h3>Impacto possível</h3><p>${esc(c.impact)}</p></article></div></div><p class="analysis-foot" data-reveal style="--order:5">A evidência demonstra o comportamento da resposta. A causa técnica depende de investigação.</p>`, 'analysis');
  });
  add('PUT e DELETE · Impedimentos', `<h2 data-reveal>PUT e DELETE: reteste impedido.</h2><div class="blocked-grid"><div data-reveal style="--order:1">${frame({image:'assets/prints/impedimento.png',id:'Controle',title:'GET da reserva 4840 retorna 404'},'blocked')}<p class="blocked-footer">Controle: POST retornou bookingid 4840; a consulta posterior recebeu 404.</p></div><div data-reveal style="--order:2"><h3>O recurso não foi localizado.</h3><p class="blocked-note">Os controles por GET dos IDs <strong>4143, 2492 e 4840</strong> retornaram 404. A pré-condição de uma reserva consultável não foi atendida.</p><div class="status-neutral">Status: impedido.<br>PUT e DELETE não foram concluídos.</div><p class="blocked-note">Esses resultados não confirmam defeitos de atualização ou exclusão. É necessário repetir a criação e consultar a reserva antes de prosseguir.</p><p class="blocked-footer">A origem do 404 não foi determinada. A limpeza dos registros da rodada permanece pendente.</p></div></div>`, 'blocked');
  add('Conclusão e próximos passos', `<h2 data-reveal>Validar a entrada.<br><span>Proteger a reserva.</span></h2><div class="closing-list"><article data-reveal style="--order:1"><h3>01 · Campos e tipos</h3><p>Rejeitar entradas inválidas com validação controlada e indicação do campo a corrigir.</p></article><article data-reveal style="--order:2"><h3>02 · Datas e período</h3><p>Validar datas existentes, ordem do período e restrição de datas retroativas prevista no case.</p></article><article data-reveal style="--order:3"><h3>03 · Reteste e regressão</h3><p>Repetir as 16 variações, validar o fluxo positivo e concluir PUT, DELETE e limpeza.</p></article></div><div class="closing-actions" data-reveal style="--order:4"><a class="secondary-button" href="assets/relatorio-api.pdf" target="_blank" rel="noopener">Abrir relatório em PDF ↗</a><button class="secondary-button" data-index>Explorar índice</button><button class="secondary-button" data-go="0">Voltar ao início</button></div>`, 'closing');
  $('slides').innerHTML = slides.map(s=>s.html).join('');
  const sections = [...document.querySelectorAll('.slide')];
  const indexDialog = $('index-dialog'), imageDialog = $('image-dialog');
  let current = -1;
  function fit() {document.documentElement.style.setProperty('--scale', Math.min(innerWidth/1920,innerHeight/1080));}
  function go(n, updateHash=true) {
    n = Math.max(0,Math.min(slides.length-1,n));
    if (n === current) return;
    current = n;
    sections.forEach((s,i)=>{s.classList.toggle('is-active',i===n);s.classList.toggle('is-before',i<n);s.inert=i!==n;s.setAttribute('aria-hidden',String(i!==n));});
    $('counter').textContent = `${String(n+1).padStart(2,'0')} / ${slides.length}`;
    $('progress-fill').style.width = `${(n+1)/slides.length*100}%`;
    const progress = document.querySelector('.progress');progress.setAttribute('aria-valuenow',n+1);progress.setAttribute('aria-valuemax',slides.length);
    $('previous').disabled=n===0;$('next').disabled=n===slides.length-1;
    $('announcement').textContent = `Slide ${n+1} de ${slides.length}: ${slides[n].title}`;
    if(updateHash) history.replaceState(null,'',`#slide-${n+1}`);
  }
  function fromHash() {const match=location.hash.match(/^#slide-(\d+)$/);go(match?Number(match[1])-1:0,false);}
  function openIndex() {renderIndex();indexDialog.showModal();$('slide-search').focus();}
  const normalize = s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function renderIndex() {
    const q=normalize($('slide-search').value);
    const entries=[{label:'Abertura',sub:'Visão geral',n:0},{label:'Resumo dos bugs',sub:'7 ocorrências · 16 variações',n:1},...cases.map((c,i)=>({label:c.id+' · '+c.title,sub:'Variação '+String(i+1).padStart(2,'0')+' · HTTP '+c.http,n:2+i*2,analysis:true})),{label:'PUT e DELETE',sub:'Impedimentos e limites do reteste',n:34},{label:'Conclusão',sub:'Prioridades e relatório em PDF',n:35}].filter(e=>normalize(e.label+' '+e.sub).includes(q));
    $('slide-index').innerHTML=entries.length?entries.map(e=>`<div class="index-entry ${current===e.n||e.analysis&&current===e.n+1?'is-current':''}"><div><strong>${esc(e.label)}</strong><small>${esc(e.sub)}</small></div><div class="index-links"><button data-go="${e.n}">${e.analysis?'Print':'Abrir'}</button>${e.analysis?`<button data-go="${e.n+1}">Análise</button>`:''}</div></div>`).join(''):'<p class="empty-index">Nenhum cenário encontrado.</p>';
  }
  function openImage(i) {
    const c=i==='blocked'?{id:'Controle',title:'GET /booking/4840 · 404',image:'assets/prints/impedimento.png',original:'assets/originals/impedimento.png'}:cases[Number(i)];
    $('image-title').textContent=c.id+' · '+c.title;$('large-image').src=c.image;$('large-image').alt=c.id+' · '+c.title;
    $('original-image').href=c.original;$('image-scroll').classList.remove('is-zoomed');$('zoom-image').textContent='Ampliar 150%';$('zoom-image').setAttribute('aria-pressed','false');imageDialog.showModal();$('image-scroll').scrollTo(0,0);
  }
  async function fullscreen() {
    try {if(document.fullscreenElement) await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
    catch {$('announcement').textContent='Tela cheia indisponível neste navegador. Use F11 para ampliar a janela.';}
  }
  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-go]');if(nav){if(indexDialog.open)indexDialog.close();go(Number(nav.dataset.go));return;}
    const image=e.target.closest('[data-image]');if(image){openImage(image.dataset.image);return;}
    const close=e.target.closest('[data-close]');if(close)$(close.dataset.close).close();
    if(e.target.closest('[data-index]'))openIndex();
  });
  document.querySelectorAll('tr[data-go]').forEach(row=>row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go(Number(row.dataset.go));}}));
  $('previous').onclick=()=>go(current-1);$('next').onclick=()=>go(current+1);$('open-index').onclick=openIndex;$('fullscreen').onclick=fullscreen;
  $('slide-search').addEventListener('input',renderIndex);
  $('zoom-image').onclick=()=>{const zoomed=$('image-scroll').classList.toggle('is-zoomed');$('zoom-image').textContent=zoomed?'Ajustar à tela':'Ampliar 150%';$('zoom-image').setAttribute('aria-pressed',String(zoomed));};
  document.addEventListener('keydown',e=>{
    if(indexDialog.open||imageDialog.open||e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(current+1);}
    else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(current-1);}
    else if(e.key==='Home'){e.preventDefault();go(0);}
    else if(e.key==='End'){e.preventDefault();go(slides.length-1);}
    else if(e.key.toLowerCase()==='i')openIndex();else if(e.key.toLowerCase()==='f')fullscreen();
  });
  [indexDialog,imageDialog].forEach(dialog=>dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();}));
  let touchStart=null;
  $('slides').addEventListener('touchstart',e=>{touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  $('slides').addEventListener('touchend',e=>{if(!touchStart||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)go(current+(dx<0?1:-1));touchStart=null;},{passive:true});
  addEventListener('resize',fit);addEventListener('hashchange',fromHash);
  document.addEventListener('fullscreenchange',()=>{fit();$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Sair da tela cheia':'Ativar tela cheia');});
  fit();fromHash();
})();
