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
  add('Bug Hunters', `<button class="cover-logo-button intro-logo" data-go="1" aria-label="Iniciar apresentação Bug Hunters">${window.BUG_HUNTERS_COVER_LOGO}</button>`, 'intro');
  add('Abertura', `<div class="cover-copy"><h1 data-reveal>Bugs da API<em>.</em></h1><h2 data-reveal style="--order:1">Evidências que explicam.</h2><p class="date" data-reveal style="--order:2">Reteste no Postman · ${esc(date)}</p><button class="start" data-go="2" data-reveal style="--order:3">Iniciar apresentação ${right}</button><a class="cover-ui-link" href="manual.html" data-reveal style="--order:4">Evidências da interface em vídeo ↗</a><p class="key-hint" data-reveal style="--order:4">Use as setas para navegar · F para tela cheia</p></div><aside class="metrics" data-reveal style="--order:2"><div class="metric"><strong>7</strong><span>bugs reproduzidos</span></div><div class="metric"><strong>16</strong><span>variações documentadas</span></div></aside>`, 'cover');
  add('Resumo dos bugs', `<h2 data-reveal>7 bugs. 16 variações.</h2><p class="lede" data-reveal style="--order:1">Criação de reservas · POST /booking · Avaliação frente aos critérios do case.</p><table class="summary-table" data-reveal style="--order:2"><thead><tr><th>Ocorrência</th><th>Falha observada</th><th>Variações</th><th>HTTP</th></tr></thead><tbody>${summary.map(s=>`<tr data-go="${3+summary.findIndex(c=>c.id===s.id)}" tabindex="0" role="button" aria-label="Abrir ${esc(s.id)}"><td>${esc(s.id)}</td><td>${esc(s.title)}</td><td>${s.count}</td><td>${esc(s.http)}</td></tr>`).join('')}</tbody></table><p class="overview-note" data-reveal style="--order:3">Selecione uma ocorrência para abrir a evidência. Cada bug reúne suas variações, evidências e análise em uma única tela.</p>`, 'overview');
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
  const glyphs={
    target:icon('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 8-8m-3 0h3v3"/>'),
    error:icon('<circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"/><path d="m8 8 8 8m0-8-8 8" stroke="white" stroke-width="2.6"/>'),
    rule:icon('<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6"/>'),
    reason:icon('<path d="m10 3-.6 2.3-2 .9-2-.7-2 3.5 1.6 1.6v2.3l-1.6 1.6 2 3.5 2-.7 2 .9.6 2.3h4l.6-2.3 2-.9 2 .7 2-3.5-1.6-1.6v-2.3l1.6-1.6-2-3.5-2 .7-2-.9L14 3z"/><circle cx="12" cy="12" r="3"/>'),
    impact:icon('<path d="M5 20v-5m5 5V9m5 11V5m5 15V2"/>'),
    copy:icon('<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>')
  };
  function highlight(text){let result='',cursor=0;const re=/"(?:\\.|[^"\\])*"\s*:?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?/g;for(const match of text.matchAll(re)){result+=esc(text.slice(cursor,match.index));const value=match[0];const type=value.startsWith('"')?(value.trimEnd().endsWith(':')?'key':'string'):'literal';result+='<span class="token-'+type+'">'+esc(value)+'</span>';cursor=match.index+value.length;}return result+esc(text.slice(cursor));}
  const codeLines=text=>text.split('\n').map((line,n)=>'<span class="code-line"><span class="line-number" aria-hidden="true">'+(n+1)+'</span><span class="code-text">'+highlight(line)+'</span></span>').join('');
  function apiPanel(c,i){return '<div class="api-panel"><div class="request-url"><span class="method">POST</span><span class="endpoint">https://restful-booker.herokuapp.com/booking</span><button class="view-evidence" data-image="'+i+'">Ver print ↗</button></div><div class="api-tabs"><span class="tab-active">Body</span><span>Requisição JSON</span><button class="copy-button" data-copy="request" data-case="'+i+'" aria-label="Copiar JSON da requisição">'+glyphs.copy+'</button></div><pre class="code-window request-code" aria-label="Corpo da requisição JSON">'+codeLines(JSON.stringify(c.request,null,2))+'</pre><div class="response-bar"><span class="tab-active">Response'+(c.http===200?' · trecho':'')+'</span><span class="http-status '+(c.http===500?'http-error':'http-success')+'">'+c.http+' '+(c.http===500?'Internal Server Error':'OK')+'</span><span class="response-time">'+c.time+' ms</span><button class="copy-button" data-copy="response" data-case="'+i+'" aria-label="Copiar corpo da resposta">'+glyphs.copy+'</button></div><pre class="code-window response-code '+(c.http===200?'is-json':'')+'" aria-label="'+(c.http===200?'Trecho relevante da resposta JSON':'Corpo da resposta')+'">'+codeLines(c.responseExcerpt)+'</pre></div>';}
  const groupedNotes={
    'BUG-002':{title:'Validação de campos',expected:'A API deve validar campos obrigatórios e tipos de dados, recusando entradas inválidas com uma mensagem controlada.',obtained:'As 6 variações retornaram 500 Internal Server Error, com mensagem genérica de erro interno.',reason:'Campos ausentes e nome como objeto causam erro interno em vez de validação controlada.',impact:'Pode interromper a criação e dificultar a identificação do campo que precisa ser corrigido.'},
    'BUG-003':{title:'Tipo de pagamento',expected:'A API deve exigir um booleano em depositpaid e recusar texto ou número sem criar reserva.',obtained:'Texto "pago" e número 1 foram aceitos com 200 OK e devolvidos como true. IDs 427 e 1858.',reason:'Tipos incompatíveis com booleano são aceitos e convertidos para true.',impact:'Pode representar a situação do pagamento de forma diferente da enviada pela integração.'},
    'BUG-004':{title:'Período invertido'},'BUG-005':{title:'Datas iguais'},'BUG-006':{title:'Reserva retroativa'},
    'BUG-007':{title:'Tipo de preço',expected:'A API deve recusar preço em texto, objeto ou null com validação controlada, sem aceitar valores incompatíveis.',obtained:'Texto e objeto: 200 OK com totalprice null, IDs 49 e 1025. Preço null: 500 Internal Server Error.',reason:'Tipos inválidos no preço são aceitos ou causam erro interno, sem validação adequada.',impact:'Pode gerar respostas sem preço utilizável ou interromper a criação da reserva.'},
    'BUG-008':{title:'Datas inválidas',expected:'A API deve rejeitar datas inexistentes e textos que não representam uma data, sem substituir a entrada por outro valor.',obtained:'Data inexistente: 200 e checkin alterado para 2030-03-02. Texto: 200 e checkin contendo NaN. IDs 761 e 3955.',reason:'Datas inválidas são aceitas e devolvidas com alteração de dia ou valor inutilizável.',impact:'Pode causar inconsistência no período da reserva, na disponibilidade e no cálculo de diárias.'}
  };
  function renderBug(groupIndex,caseIndex){
    const group=summary[groupIndex],c=cases[caseIndex];
    return `<div class="bug-layout"><div class="bug-left"><div class="bug-heading" data-reveal><div class="bug-heading-top"><span class="bug-badge">${esc(group.id)}</span><button class="variations-button" data-variations="${groupIndex}">Ver variações (${group.count})</button></div><h2>${esc(c.title)}</h2><p>${esc(brief[caseIndex])}</p></div><div class="bug-evidence" data-reveal style="--order:1">${apiPanel(c,caseIndex)}</div></div><div class="bug-right"><article class="result expected" data-reveal style="--order:2"><span class="result-icon">${glyphs.target}</span><div><h3>Cenário esperado</h3><p>${esc(c.expected)}</p></div></article><article class="result obtained" data-reveal style="--order:3"><span class="result-icon">${glyphs.error}</span><div><h3>Resultado obtido · ${c.http}</h3><p>${esc(c.obtained)}</p></div></article><aside class="why-strip" data-reveal style="--order:4"><div class="rule"><span class="why-icon">${glyphs.rule}</span><h3>Regra</h3><p>${esc(c.rule)}</p></div><div><span class="why-icon">${glyphs.reason}</span><h3>Por que é bug?</h3><p>${esc(brief[caseIndex])}</p></div><div><span class="why-icon">${glyphs.impact}</span><h3>Impacto possível</h3><p>${esc(c.impact)}</p></div></aside></div></div>`;
  }
  summary.forEach((group,groupIndex)=>add(group.id+' · '+groupedNotes[group.id].title,renderBug(groupIndex,cases.findIndex(c=>c.id===group.id)),'evidence grouped-bug'));
  add('PUT e DELETE · Impedimentos', `<h2 data-reveal>PUT e DELETE: reteste impedido.</h2><div class="blocked-grid"><div data-reveal style="--order:1">${frame({image:'assets/prints/impedimento.png',id:'Controle',title:'GET da reserva 4840 retorna 404'},'blocked')}<p class="blocked-footer">Controle: POST retornou bookingid 4840; a consulta posterior recebeu 404.</p></div><div data-reveal style="--order:2"><h3>O recurso não foi localizado.</h3><p class="blocked-note">Os controles por GET dos IDs <strong>4143, 2492 e 4840</strong> retornaram 404. A pré-condição de uma reserva consultável não foi atendida.</p><div class="status-neutral">Status: impedido.<br>PUT e DELETE não foram concluídos.</div><p class="blocked-note">Esses resultados não confirmam defeitos de atualização ou exclusão. É necessário repetir a criação e consultar a reserva antes de prosseguir.</p><p class="blocked-footer">A origem do 404 não foi determinada. A limpeza dos registros da rodada permanece pendente.</p></div></div>`, 'blocked');
  add('Conclusão e próximos passos', `<h2 data-reveal>Validar a entrada.<br><span>Proteger a reserva.</span></h2><div class="closing-list"><article data-reveal style="--order:1"><h3>01 · Campos e tipos</h3><p>Rejeitar entradas inválidas com validação controlada e indicação do campo a corrigir.</p></article><article data-reveal style="--order:2"><h3>02 · Datas e período</h3><p>Validar datas existentes, ordem do período e restrição de datas retroativas prevista no case.</p></article><article data-reveal style="--order:3"><h3>03 · Reteste e regressão</h3><p>Repetir as 16 variações, validar o fluxo positivo e concluir PUT, DELETE e limpeza.</p></article></div><div class="closing-actions" data-reveal style="--order:4"><a class="secondary-button" href="manual.html">Evidências de utilização em vídeo ↗</a><a class="secondary-button" href="assets/relatorio-api.pdf" target="_blank" rel="noopener">Abrir relatório em PDF ↗</a><button class="secondary-button" data-index>Explorar índice</button><button class="secondary-button" data-go="0">Voltar ao início</button></div>`, 'closing');
  $('slides').innerHTML = slides.map(s=>s.html).join('');
  const sections = [...document.querySelectorAll('.slide')];
  const indexDialog = $('index-dialog'), imageDialog = $('image-dialog'), variantsDialog = $('variants-dialog');
  let current = -1;
  function fit() {document.documentElement.style.setProperty('--scale', Math.min(innerWidth/1920,innerHeight/1080));}
  function go(n, updateHash=true) {
    n = Math.max(0,Math.min(slides.length-1,n));
    if (n === current) return;
    current = n;
    $('presentation').classList.toggle('is-intro',n===0);
    document.querySelector('.cover-logo').getAnimations({subtree:true}).forEach(a=>{if(n===0){a.currentTime=0;a.play();}else a.pause();});
    $('variation-label').textContent=n>=3&&n<=9?`Bug ${String(n-2).padStart(2,'0')} de 7 · ${summary[n-3].count} ${summary[n-3].count===1?'variação':'variações'}`:'Apresentação de resultados';
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
    const entries=[{label:'Bug Hunters',sub:'Logo animada',n:0},{label:'Abertura',sub:'Visão geral',n:1},{label:'Resumo dos bugs',sub:'7 ocorrências · 16 variações',n:2},...summary.map((g,i)=>({label:g.id+' · '+groupedNotes[g.id].title,sub:g.count+' variações · '+g.title,n:3+i})),{label:'PUT e DELETE',sub:'Impedimentos e limites do reteste',n:10},{label:'Conclusão',sub:'Prioridades e relatório em PDF',n:11}].filter(e=>normalize(e.label+' '+e.sub).includes(q));
    $('slide-index').innerHTML=entries.length?entries.map(e=>`<div class="index-entry ${current===e.n||e.analysis&&current===e.n+1?'is-current':''}"><div><strong>${esc(e.label)}</strong><small>${esc(e.sub)}</small></div><div class="index-links"><button data-go="${e.n}">${e.analysis?'Print':'Abrir'}</button>${e.analysis?`<button data-go="${e.n+1}">Análise</button>`:''}</div></div>`).join(''):'<p class="empty-index">Nenhum cenário encontrado.</p>';
  }
  function openVariants(groupIndex){
    const group=summary[groupIndex];$('variants-title').textContent=group.id+' · '+groupedNotes[group.id].title;
    $('variants-list').innerHTML=cases.map((c,i)=>({...c,index:i})).filter(c=>c.id===group.id).map(c=>`<article class="variant-card"><div class="variant-card-heading"><h3>${esc(c.title)}</h3><span class="variant-status">HTTP ${c.http}</span></div><p><strong>Esperado</strong>${esc(c.expected)}</p><p><strong>Obtido</strong>${esc(c.obtained)}</p><p><strong>Por que é bug?</strong>${esc(c.analysis)}</p><button data-select-case="${c.index}" data-group="${groupIndex}">Exibir esta evidência no slide ↗</button></article>`).join('');
    variantsDialog.showModal();
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
    if(e.target.closest('[data-replay-logo]')){document.querySelector('.cover-logo').getAnimations({subtree:true}).forEach(a=>{a.currentTime=0;a.play();});return;}
    const nav=e.target.closest('[data-go]');if(nav){if(indexDialog.open)indexDialog.close();go(Number(nav.dataset.go));return;}
    const variations=e.target.closest('[data-variations]');if(variations){openVariants(Number(variations.dataset.variations));return;}
    const select=e.target.closest('[data-select-case]');if(select){const group=Number(select.dataset.group),i=Number(select.dataset.selectCase);variantsDialog.close();sections[3+group].innerHTML=renderBug(group,i);$('announcement').textContent='Evidência selecionada: '+cases[i].title;sections[3+group].querySelector('[data-variations]').focus({preventScroll:true});return;}
    const image=e.target.closest('[data-image]');if(image){openImage(image.dataset.image);return;}
    const copy=e.target.closest('[data-copy]');if(copy){const c=cases[Number(copy.dataset.case)];const value=copy.dataset.copy==='request'?JSON.stringify(c.request,null,2):(typeof c.response==='string'?c.response:JSON.stringify(c.response,null,2));navigator.clipboard.writeText(value).then(()=>{$('announcement').textContent='JSON copiado.';copy.classList.add('is-copied');setTimeout(()=>copy.classList.remove('is-copied'),1200);}).catch(()=>{$('announcement').textContent='Não foi possível copiar. Selecione o conteúdo do painel.';});return;}
    const close=e.target.closest('[data-close]');if(close)$(close.dataset.close).close();
    if(e.target.closest('[data-index]'))openIndex();
  });
  document.querySelectorAll('tr[data-go]').forEach(row=>row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go(Number(row.dataset.go));}}));
  $('previous').onclick=()=>go(current-1);$('next').onclick=()=>go(current+1);$('open-index').onclick=openIndex;$('fullscreen').onclick=fullscreen;
  $('slide-search').addEventListener('input',renderIndex);
  $('zoom-image').onclick=()=>{const zoomed=$('image-scroll').classList.toggle('is-zoomed');$('zoom-image').textContent=zoomed?'Ajustar à tela':'Ampliar 150%';$('zoom-image').setAttribute('aria-pressed',String(zoomed));};
  document.addEventListener('keydown',e=>{
    if(indexDialog.open||imageDialog.open||variantsDialog.open||e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(current+1);}
    else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(current-1);}
    else if(e.key==='Home'){e.preventDefault();go(0);}
    else if(e.key==='End'){e.preventDefault();go(slides.length-1);}
    else if(e.key.toLowerCase()==='i')openIndex();else if(e.key.toLowerCase()==='f')fullscreen();
  });
  [indexDialog,imageDialog,variantsDialog].forEach(dialog=>dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();}));
  let touchStart=null;
  $('slides').addEventListener('touchstart',e=>{touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
  $('slides').addEventListener('touchend',e=>{if(!touchStart||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)go(current+(dx<0?1:-1));touchStart=null;},{passive:true});
  addEventListener('resize',fit);addEventListener('hashchange',fromHash);
  document.addEventListener('fullscreenchange',()=>{fit();$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Sair da tela cheia':'Ativar tela cheia');});
  fit();fromHash();
})();
