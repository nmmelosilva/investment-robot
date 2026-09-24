
let data=JSON.parse(localStorage.getItem('irPortfolio')||'null'),positions=data?.positions||[];
const eur=n=>new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(n);
function posHTML(p){return `<div class="position"><div><div class="name">${p.name}</div><small>${p.ticker} · ${p.cat}</small></div><div class="value">${eur(Math.abs(p.value))}</div><small>P/L aberto</small><div class="value ${p.pnl>=0?'positive':'negative'}">${eur(p.pnl)}</div></div>`}
function draw(){
 positions=data?.positions||[];
 const total=positions.reduce((a,p)=>a+Math.abs(p.value),0),pnl=positions.reduce((a,p)=>a+p.pnl,0);
 totalValue.textContent=positions.length?eur(total):'—'; totalPnl.textContent=positions.length?eur(pnl):'—'; totalPnl.className=pnl>=0?'positive':'negative';
 status.textContent=positions.length?`Carteira carregada localmente · ${positions.length} posições`:'Ainda não há carteira neste dispositivo.';
 let m={};positions.forEach(p=>m[p.cat]=(m[p.cat]||0)+Math.abs(p.value));
 allocation.innerHTML=positions.length?Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="mini"><span>${k}</span><b>${eur(v)}</b><div class="bar"><i style="width:${total?v/total*100:0}%"></i></div></div>`).join(''):'<div class="privacy">Importa a carteira privada para veres o dashboard.</div>';
 render(filter.value); risk(); oilSetup();
}
function render(f='ALL'){let a=positions.filter(p=>f==='ALL'||p.cat===f).sort((a,b)=>Math.abs(b.value)-Math.abs(a.value));positionsList.innerHTML=a.map(posHTML).join('');topPositions.innerHTML=a.slice(0,5).map(posHTML).join('')}
filter.onchange=e=>render(e.target.value);
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector('#'+b.dataset.tab).classList.add('active')});
function oilSetup(){let o=data?.oil;if(!o){oilEmpty.hidden=false;oilTools.hidden=true;return}oilEmpty.hidden=true;oilTools.hidden=false;
 function sim(v){v=+v;oilPrice.textContent=v.toFixed(2).replace('.',',');oilInput.value=v.toFixed(2);oilSlider.value=v;let est=o.basePnl+(o.basePrice-v)*o.sensitivity;oilPnl.value=eur(est);oilPnl.className=est>=0?'positive':'negative';let be=o.basePrice+o.basePnl/o.sensitivity;document.querySelector('#be').innerHTML=`Break-even aproximado com os custos atuais: <b>$${be.toFixed(2)}</b>. Próximo rollover registado: <b>${o.nextRollover||'—'}</b>.`} sim(o.basePrice);oilSlider.oninput=e=>sim(e.target.value);oilInput.onchange=e=>sim(e.target.value)}
function risk(){let ml=+(localStorage.maxLoss||250),mm=+(localStorage.maxMargin||2000);maxLoss.value=ml;maxMargin.value=mm;let a=[];positions.forEach(p=>{if(p.pnl<-ml)a.push(['bad',p.name,`P/L ${eur(p.pnl)} abaixo do limite de ${eur(-ml)}.`]);if(p.cat==='CFD'&&(p.margin||0)>mm)a.push(['warn',p.name,`Margem ${eur(p.margin)} acima do limite definido.`])});alerts.innerHTML=a.map(x=>`<div class="alert ${x[0]}"><b>${x[1]}</b><div>${x[2]}</div></div>`).join('')||'<div class="alert">Sem alertas pelos limites atuais.</div>'}
saveRisk.onclick=()=>{localStorage.maxLoss=maxLoss.value;localStorage.maxMargin=maxMargin.value;risk()};
importFile.onchange=async e=>{try{let obj=JSON.parse(await e.target.files[0].text());if(!Array.isArray(obj.positions))throw Error();data=obj;localStorage.setItem('irPortfolio',JSON.stringify(obj));draw();alert('Carteira importada e guardada apenas neste dispositivo.')}catch{alert('Ficheiro de carteira inválido.')}};
clearData.onclick=()=>{if(confirm('Apagar a carteira guardada neste dispositivo?')){localStorage.removeItem('irPortfolio');data=null;draw()}};
let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;install.hidden=false});
install.onclick=async()=>{if(deferred){deferred.prompt();deferred=null;install.hidden=true}};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
draw();
