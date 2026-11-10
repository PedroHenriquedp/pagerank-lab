const pages = [
  { id: 'A', name: 'Apostila de grafos', color: '#1967d2' },
  { id: 'B', name: 'Blog de algoritmos', color: '#b3261e' },
  { id: 'C', name: 'Portal de estudos', color: '#137333' },
  { id: 'D', name: 'Notas de aula', color: '#795900' }
];
const originalLinks = [['A','B'],['A','C'],['B','C'],['C','A'],['D','C']].map(([from,to])=>({from,to}));
const changedLinks = [...originalLinks,{from:'C',to:'D'}];
const state = { step:0, guess:null, original:null, changed:null };
const $ = id => document.getElementById(id);
const svgNS = 'http://www.w3.org/2000/svg';

async function calculate(links){
  const response = await fetch('/api/simulate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pages:pages.map(({id})=>({id})),links,damping:.85})});
  if(!response.ok) throw new Error('A simulação não respondeu. Atualize a página e tente novamente.');
  const result = await response.json();
  return { order:result.order.map(index=>pages[index].id),scores:result.history.at(-1).scores };
}

function svg(tag,attributes,parent){const node=document.createElementNS(svgNS,tag);for(const [key,value] of Object.entries(attributes))node.setAttribute(key,value);parent.append(node);return node}
function drawGraph(){
  const root=$('network');root.replaceChildren();const defs=svg('defs',{},root);
  for(const [id,color] of [['arrow','#a9b7c9'],['arrow-active','#1967d2'],['arrow-new','#34a853']]){
    const marker=svg('marker',{id,viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'8',markerHeight:'8',orient:'auto'},defs);
    svg('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:color},marker);
  }
  const edges=[
    ['A','B','M 130 157 Q 196 94 263 79'],
    ['A','C','M 137 176 L 495 176'],
    ['B','C','M 335 84 Q 422 108 503 156'],
    ['C','A','M 504 195 Q 319 270 134 196'],
    ['D','C','M 336 290 Q 421 265 503 196']
  ];
  if(state.step===2)edges.push(['C','D','M 504 199 Q 454 325 338 310']);
  for(const [from,to,d] of edges){const fresh=from==='C'&&to==='D';const active=state.step>0&&(to==='C'||fresh);const path=svg('path',{d,class:`edge${fresh?' new':active?' changed':''}`,'marker-end':`url(#${fresh?'arrow-new':active?'arrow-active':'arrow'})`},root);svg('title',{},path).textContent=`${from} aponta para ${to}`}
  const points={A:[96,176],B:[300,66],C:[540,176],D:[300,306]};
  for(const page of pages){const [x,y]=points[page.id];const group=svg('g',{class:`graph-node${state.step>0&&page.id==='C'?' winner':''}${state.step===2&&page.id==='D'?' promoted':''}`},root);svg('circle',{class:'halo',cx:x,cy:y,r:'42'},group);svg('circle',{class:'disc',cx:x,cy:y,r:'36',fill:page.color},group);svg('text',{class:'letter',x,y:y+2,fill:page.color},group).textContent=page.id;if(innerWidth>680)svg('text',{class:'node-title',x,y:y+64},group).textContent=page.name}
  $('network-badge').textContent=state.step===2?'6 links · 1 novo':'5 links';
  root.setAttribute('aria-label',state.step===2?'Rede de quatro páginas; o novo link C para D está em verde.':'Rede de quatro páginas com links A para B e C, B para C, C para A e D para C.');
}

function rankList(result){const max=Math.max(...result.scores);return `<ol class="rank-list">${result.order.map((id,index)=>{const page=pages.find(p=>p.id===id),score=result.scores[pages.indexOf(page)];return `<li><span class="rank-index">${index+1}º</span><span class="rank-letter" style="color:${page.color}">${id}</span><span class="rank-name">${page.name}<span class="rank-bar"><i style="width:${(score/max*100).toFixed(1)}%"></i></span></span></li>`}).join('')}</ol>`}

function guideMarkup(){
  if(state.step===0)return `<p class="guide-kicker">Passo 1 de 3</p><h3>Qual página você colocaria em primeiro?</h3><p>As setas representam links. Elas mostram qual página indica outra. Observe a rede e escolha seu palpite.</p><div class="choices" role="group" aria-label="Escolha uma página"><button class="choice" type="button" data-guess="A" aria-pressed="${state.guess==='A'}"><b>A</b><small>Apostila</small></button><button class="choice" type="button" data-guess="B" aria-pressed="${state.guess==='B'}"><b>B</b><small>Blog</small></button><button class="choice" type="button" data-guess="C" aria-pressed="${state.guess==='C'}"><b>C</b><small>Portal</small></button><button class="choice" type="button" data-guess="D" aria-pressed="${state.guess==='D'}"><b>D</b><small>Notas</small></button></div><div class="guide-actions"><button class="primary-button" id="next" type="button" ${state.guess?'':'disabled'}>Ver o resultado</button><span class="guide-hint">Escolha uma página para continuar.</span></div>`;
  if(state.step===1)return `<p class="guide-kicker">Passo 2 de 3</p><h3>Os links fazem a importância circular.</h3><p>O PageRank começa com as páginas iguais. A cada rodada, cada página passa sua importância pelos links. A troca se repete até a ordem estabilizar.</p><div class="mini-explain"><strong>Por que C ficou em primeiro?</strong>C recebe indicações de A, B e D. Uma indicação de uma página importante conta mais.</div>${rankList(state.original)}<p class="prediction">Seu palpite: <strong>${state.guess}</strong> · Primeiro lugar: <strong>${state.original.order[0]}</strong></p><div class="guide-actions"><button class="primary-button" id="next" type="button">Adicionar um link</button></div>`;
  return `<p class="guide-kicker">Passo 3 de 3</p><h3>Uma conexão muda o resultado.</h3><p>Adicionamos <strong>C → D</strong>. Agora C também indica D. A página D sobe mesmo sem mudar seu conteúdo.</p><div class="comparison"><div><small>Antes: 5 links</small><strong>${state.original.order.join(' ')}</strong></div><div class="after"><small>Depois: 6 links</small><strong>${state.changed.order.join(' ')}</strong></div></div><div class="insight">D passa do <strong>4º para o ${state.changed.order.indexOf('D')+1}º lugar</strong>. O PageRank reflete a posição de cada página na rede.</div><div class="guide-actions"><button class="secondary-button" id="restart" type="button">Recomeçar</button></div>`;
}

function render({focus=false}={}){
  drawGraph();for(let index=0;index<3;index++){$(`step-${index}`).className=index<state.step?'done':index===state.step?'current':'';if(index===state.step)$(`step-${index}`).setAttribute('aria-current','step');else $(`step-${index}`).removeAttribute('aria-current')}
  $('guide').innerHTML=guideMarkup();
  $('guide').querySelectorAll('[data-guess]').forEach(button=>button.addEventListener('click',()=>{state.guess=button.dataset.guess;for(const choice of $('guide').querySelectorAll('[data-guess]'))choice.setAttribute('aria-pressed',String(choice.dataset.guess===state.guess));$('next').disabled=false;$('guide').querySelector('.guide-hint').textContent=`Seu palpite: página ${state.guess}.`;}));
  $('next')?.addEventListener('click',()=>advance());$('restart')?.addEventListener('click',()=>{state.step=0;state.guess=null;render({focus:true})});
  if(focus){const heading=$('guide').querySelector('h3');heading.tabIndex=-1;heading.focus({preventScroll:true})}
}

function advance(){if(state.step>=2||state.step===0&&!state.guess)return;state.step++;render({focus:true});const graph=$('network');graph.classList.add('network-flow');setTimeout(()=>graph.classList.remove('network-flow'),1000)}
function showError(error){$('guide').innerHTML=`<h3>Não foi possível carregar.</h3><p>${error.message}</p><div class="guide-actions"><button id="retry" class="primary-button" type="button">Tentar novamente</button></div>`;$('retry').onclick=load}
async function load(){try{$('guide').innerHTML='<p class="guide-loading">Preparando a explicação…</p>';[state.original,state.changed]=await Promise.all([calculate(originalLinks),calculate(changedLinks)]);state.step=0;state.guess=null;render()}catch(error){showError(error)}}
addEventListener('resize',()=>drawGraph());
load();
