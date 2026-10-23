/* Historical recordings: this viewer makes no calls to the tested application. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id), video=$('evidence-video');
  const labels={bug:'Bug observado',inconclusivo:'Em análise',controle:'Controle sem falha visual'};
  $('presentation-mode').addEventListener('click',()=>{const active=document.body.classList.toggle('presenting');$('presentation-mode').setAttribute('aria-pressed',String(active));$('presentation-mode').textContent=active?'Sair da apresentação':'Modo apresentação';window.scrollTo(0,0);});
  let records=[],visible=[],filter='all',current=null;
  const time=value=>`${String(Math.floor(value/60)).padStart(2,'0')}:${String(Math.floor(value%60)).padStart(2,'0')}`;
  function library(){
    const container=$('evidence-list');container.replaceChildren();
    for(const c of visible){
      const button=document.createElement('button');button.className='evidence-card';button.dataset.case=c.id;button.setAttribute('aria-current',String(current?.id===c.id));
      const image=new Image();image.src=c.poster;image.alt='';image.loading='lazy';
      const meta=document.createElement('span');meta.textContent=`${c.id} · ${labels[c.status]} · ${time(c.duration)}`;
      const title=document.createElement('strong');title.textContent=c.title;
      button.append(image,meta,title);button.addEventListener('click',()=>select(c.id,true));container.append(button);
    }
  }
  function select(id,updateHash=true){
    const c=records.find(c=>c.id===id)||visible[0];if(!c)return;
    current=c;video.pause();video.poster=c.poster;
    const source=document.createElement('source');source.src=c.video;source.type='video/mp4';
    const track=document.createElement('track');track.kind='captions';track.label='Português · descrição da evidência';track.srclang='pt-BR';track.src=c.captions;
    video.replaceChildren(source,track);video.load();
    $('case-id').textContent=c.id;$('case-title').textContent=c.title;$('case-status').textContent=labels[c.status];$('case-status').dataset.status=c.status;
    $('case-area').textContent=c.area;$('duration').textContent=`${c.duration.toFixed(2).replace('.',',')} s · integral`;
    $('source-link').href=c.sourceUrl;
    for(const field of ['expected','obtained','why','rule','limit'])$(field).textContent=c[field];
    $('why-title').textContent=c.status==='bug'?'Por que é bug?':c.status==='controle'?'O que o controle demonstra':'Por que ainda está em análise?';
    $('severity').textContent='Criticidade sugerida: '+c.severity;
    $('steps').replaceChildren(...c.steps.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    $('chapters').replaceChildren(...c.events.map(([start,end,text])=>{
      const b=document.createElement('button'),t=document.createElement('time'),s=document.createElement('span');
      t.textContent=time(start);s.textContent=text;b.append(t,s);b.title=`${start.toFixed(1)}–${end.toFixed(1)} segundos`;
      b.addEventListener('click',()=>{if(video.readyState>=1)video.currentTime=start;else video.addEventListener('loadedmetadata',()=>video.currentTime=start,{once:true});video.focus({preventScroll:true});});return b;
    }));
    $('execution').open=false;
    const i=visible.findIndex(x=>x.id===c.id);$('counter').textContent=`${i+1} / ${visible.length}`;
    $('previous').disabled=i<=0;$('next').disabled=i>=visible.length-1;
    library();if(updateHash)history.replaceState(null,'','#'+c.id.toLowerCase());
    $('announcement').textContent=c.id+': '+c.title+'. '+labels[c.status];
    const workspace=document.querySelector('.workspace');workspace.classList.remove('is-switching');void workspace.offsetWidth;workspace.classList.add('is-switching');
  }
  function applyFilter(value){
    filter=value;visible=records.filter(c=>filter==='all'||c.status===filter);
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
    select(visible.some(c=>c.id===current?.id)?current.id:visible[0].id);
  }
  function move(delta){const i=visible.findIndex(c=>c.id===current?.id);if(visible[i+delta])select(visible[i+delta].id);}
  $('previous').addEventListener('click',()=>move(-1));$('next').addEventListener('click',()=>move(1));
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>applyFilter(b.dataset.filter)));
  addEventListener('hashchange',()=>{const c=records.find(c=>'#'+c.id.toLowerCase()===location.hash);if(c){if(filter!=='all'&&c.status!==filter)applyFilter('all');select(c.id,false);}});
  document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest('video,input,textarea,select,button,summary,a'))return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
  fetch('manual-data.json').then(r=>{if(!r.ok)throw Error('Falha ao carregar as evidências.');return r.json();}).then(data=>{records=data.records;visible=records;select(location.hash.slice(1).toUpperCase()||records[0].id,false);}).catch(()=>{$('case-title').textContent='Não foi possível carregar as evidências. Atualize a página ou abra a documentação completa.';});
})();
