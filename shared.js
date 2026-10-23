/* Shared navigation uses capability-scoped rows; no private project keys. */
(() => {
  'use strict';
  const config=window.SHARED_PRESENTATION_CONFIG, params=new URLSearchParams(location.search);
  let room=params.get('room'),key=params.get('key'),row=null,connected=false,applying=false,joining=false,writing=false,pending={},timer=null,resync=false;
  const configReady=()=>config?.url&&config?.publicKey;
  const validRoom=()=>/^[0-9a-f-]{36}$/i.test(room||'')&&/^[0-9a-f]{32}$/.test(key||'');
  const bridge=()=>window.PresentationBridge;
  const launch=document.createElement('button');launch.className='shared-launch';launch.textContent='Ao vivo';launch.setAttribute('aria-label','Abrir apresentação compartilhada');
  (document.querySelector('.report-meta')||document.querySelector('.header-actions')).prepend(launch);
  const dialog=document.createElement('dialog');dialog.className='shared-dialog';dialog.setAttribute('aria-labelledby','shared-title');
  dialog.innerHTML=`<header><h2 id="shared-title">Apresentação ao vivo</h2><button data-shared-close>Fechar</button></header><p>Abra o mesmo link no celular e no PC. Qualquer participante pode mudar os slides e alternar entre API e Front, mesmo em redes diferentes.</p><div class="shared-actions"><button class="primary" id="shared-create">Criar sessão compartilhada</button></div><section id="shared-active" hidden><label for="shared-link">Link para abrir no outro aparelho</label><input id="shared-link" readonly><span class="shared-room-label" id="shared-room-label"></span><div class="shared-actions"><button id="shared-copy">Copiar link</button><button id="shared-leave">Sair desta sessão</button></div><div class="shared-mobile-controls"><p class="remote-position" id="remote-position"></p><button id="remote-prev">← Anterior</button><button id="remote-next">Próximo →</button><div class="remote-modes"><button data-remote-mode="api">Modo API</button><button data-remote-mode="front">Front · Vídeos</button></div></div><p>Quem possui este link pode controlar esta sessão. Ela fica disponível por até 24 horas. Para usar só neste aparelho, saia da sessão.</p></section><div class="shared-join"><label for="shared-join-link">Já tem uma sessão? Cole o link aqui</label><input id="shared-join-link" type="url" placeholder="Link copiado no outro aparelho"><div class="shared-actions"><button id="shared-join">Entrar na sessão</button></div></div><p class="shared-status" id="shared-status" role="status" aria-live="polite"></p>`;
  document.body.append(dialog);
  if(matchMedia('(max-width:750px)').matches){const mobileLaunch=launch.cloneNode(true);mobileLaunch.classList.add('shared-mobile-launch');mobileLaunch.textContent='Controle ao vivo';mobileLaunch.onclick=()=>{updateInterface();dialog.showModal();};document.body.append(mobileLaunch);}
  const $=id=>document.getElementById(id);
  const status=(message,error=false)=>{$('shared-status').textContent=message;$('shared-status').dataset.error=String(error);launch.textContent=connected?(error?'Reconectando…':'Ao vivo ●'):'Ao vivo';};
  const baseState=()=>({mode:'api',slide:0,variants:{},frontId:'UI-001',frontFilter:'all',...bridge()?.getState()});
  const validate=s=>s&&['api','front'].includes(s.mode)&&Number.isInteger(s.slide)&&s.slide>=0&&s.slide<12&&/^UI-00[1-9]$|^UI-010$/.test(s.frontId)&&['all','bug','inconclusivo','controle'].includes(s.frontFilter)&&s.variants&&typeof s.variants==='object';
  function urlFor(state){const url=new URL(state.mode==='front'?'manual.html':'index.html',location.href);url.searchParams.set('room',room);url.searchParams.set('key',key);url.hash=state.mode==='front'?state.frontId.toLowerCase():'slide-'+(state.slide+1);return url;}
  function updateInterface(){
    launch.dataset.connected=String(connected);$('shared-active').hidden=!connected;$('shared-create').hidden=connected;
    if(!connected)return;
    $('shared-link').value=urlFor(row.state).href;$('shared-room-label').textContent='Sessão '+room.slice(0,8)+' · API e Front sincronizados';
    $('remote-position').textContent=row.state.mode==='api'?`API · slide ${row.state.slide+1} de 12`:`Front · ${row.state.frontId}`;
    document.querySelectorAll('a[href]').forEach(a=>{const url=new URL(a.href,location.href);if(url.origin===location.origin&&/\/(index|manual)\.html$/.test(url.pathname)){url.searchParams.set('room',room);url.searchParams.set('key',key);a.href=url.href;}});
  }
  async function request(path,options={}){
    const response=await fetch(config.url+'/rest/v1/presentation_sessions'+path,{...options,headers:{apikey:config.publicKey,'Content-Type':'application/json','x-room-key':key,...options.headers},signal:AbortSignal.timeout(12000)});
    if(!response.ok)throw Error('Falha na conexão com a sessão ('+response.status+').');
    return response.status===204?null:response.json();
  }
  const fields='id,state,version,expires_at';
  async function read(){const rows=await request('?id=eq.'+encodeURIComponent(room)+'&select='+fields);if(!rows.length)throw Error('Sessão não encontrada, expirada ou link incompleto.');return rows[0];}
  function accept(next){
    if(!validate(next.state))throw Error('O estado da sessão não é compatível com esta apresentação.');
    if(row&&next.version<row.version)return;
    row=next;updateInterface();
    if(row.state.mode!==bridge()?.mode){location.replace(urlFor(row.state));return;}
    applying=true;try{bridge().applyState(row.state);}finally{applying=false;}
  }
  async function poll(){
    if(!connected||joining||writing)return;
    try{const next=await read();if(resync||!row||next.version>row.version){accept(next);resync=false;}status('Sincronizado. Os comandos de qualquer participante atualizam a sessão.');}
    catch(error){status(error.message,true);}
  }
  function schedule(){clearInterval(timer);timer=setInterval(()=>{if(!document.hidden)poll();},1000);}
  async function join(){
    if(joining)return;joining=true;status('Conectando à sessão…');
    try{const next=await read();connected=true;accept(next);status('Sessão conectada.');schedule();if(innerWidth<=750&&!dialog.open)dialog.showModal();}
    catch(error){connected=false;status(error.message,true);dialog.showModal();}
    finally{joining=false;}
  }
  async function flush(){
    if(writing||joining||!connected)return;writing=true;
    try{
      while(Object.keys(pending).length){
        const change=pending;pending={};let saved=false;
        for(let attempt=0;attempt<4;attempt++){
          const next={...row.state,...change};if(!validate(next))throw Error('Comando inválido.');
          const result=await request('?id=eq.'+room+'&version=eq.'+row.version+'&select='+fields,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({state:next})});
          if(result.length){accept(result[0]);saved=true;break;}
          row=await read();
        }
        if(!saved)throw Error('Comandos simultâneos. Tente novamente.');
      }
      status('Sincronizado.');
    }catch(error){pending={};resync=true;status(error.message+' Reconectando ao estado compartilhado.',true);}
    finally{writing=false;}
  }
  function publish(change){if(!connected||applying||joining)return;pending={...pending,...change};flush();}
  window.addEventListener('presentation-change',e=>publish(e.detail));
  launch.onclick=()=>{updateInterface();dialog.showModal();};
  dialog.querySelector('[data-shared-close]').onclick=()=>dialog.close();
  $('shared-create').onclick=async()=>{
    if(!configReady()){status('A conexão do Supabase ainda não foi configurada.',true);return;}
    $('shared-create').disabled=true;
    try{
      room=crypto.randomUUID();key=Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('');
      const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key))),v=>v.toString(16).padStart(2,'0')).join('');
      const result=await request('?select='+fields,{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({id:room,capability_hash:hash,state:baseState()})});
      connected=true;accept(result[0]);history.replaceState(null,'',urlFor(row.state));status('Sessão criada. Copie o link e abra no outro aparelho.');schedule();
    }catch(error){status(error.message,true);}finally{$('shared-create').disabled=false;}
  };
  $('shared-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('shared-link').value);status('Link copiado. Abra no celular e no PC.');}catch{$('shared-link').select();status('Selecione e copie o link acima.');}};
  $('shared-join').onclick=()=>{try{const url=new URL($('shared-join-link').value);const r=url.searchParams.get('room'),k=url.searchParams.get('key');if(!/^[0-9a-f-]{36}$/i.test(r||'')||!/^[0-9a-f]{32}$/.test(k||''))throw Error();const target=new URL(location.href);target.searchParams.set('room',r);target.searchParams.set('key',k);location.assign(target);}catch{status('Cole o link completo de uma sessão.',true);}};
  $('shared-leave').onclick=()=>{connected=false;clearInterval(timer);const url=new URL(location.href);url.searchParams.delete('room');url.searchParams.delete('key');location.assign(url);};
  $('remote-prev').onclick=()=>bridge()?.previous();$('remote-next').onclick=()=>bridge()?.next();
  document.querySelectorAll('[data-remote-mode]').forEach(b=>b.onclick=()=>publish({mode:b.dataset.remoteMode}));
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!connected||!a||e.ctrlKey||e.metaKey||e.shiftKey||a.target==='_blank')return;
    const url=new URL(a.href,location.href);if(url.origin!==location.origin)return;
    const mode=url.pathname.endsWith('/manual.html')?'front':url.pathname.endsWith('/index.html')?'api':null;
    if(mode&&mode!==bridge()?.mode){e.preventDefault();publish({mode});}
  },true);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll();});window.addEventListener('online',poll);
  const ready=()=>{if(!bridge()?.ready()){setTimeout(ready,100);return;}if(validRoom()&&configReady())join();};ready();
})();
