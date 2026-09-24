const positions=[
{name:'Société Générale',ticker:'GLE.FR',cat:'CFD',value:7582.05,pnl:3808.08,margin:695.85},
{name:'Société Générale',ticker:'GLE.FR',cat:'STOCK',value:4649.06,pnl:3239.42},
{name:'ALD',ticker:'ALD.FR',cat:'STOCK',value:1522.50,pnl:636.75},
{name:'Core S&P 500',ticker:'SXR8.DE',cat:'ETF',value:730.24,pnl:301.74},
{name:'Credit Agricole',ticker:'ACA.FR',cat:'STOCK',value:523.74,pnl:117.67},
{name:'Bitcoin',ticker:'VBTC.DE',cat:'ETN',value:388.54,pnl:51.56},
{name:'FTSE All-World',ticker:'VWCE.DE',cat:'ETF',value:299.26,pnl:-0.51},
{name:'Artificial Intelligence',ticker:'WTI2.DE',cat:'ETF',value:216.04,pnl:.44},
{name:'Mercedes-Benz',ticker:'MBG.DE',cat:'STOCK',value:126.03,pnl:-20.97},
{name:'Microsoft',ticker:'MSFT.US',cat:'STOCK',value:124.83,pnl:24.84},
{name:'CARDANO',ticker:'CARDANO',cat:'CFD',value:104.79,pnl:-9.15,margin:56.13},
{name:'Richtech Robotics',ticker:'RR.US',cat:'STOCK',value:71.69,pnl:-19.30},
{name:'EDP Renováveis',ticker:'EDPR.PT',cat:'STOCK',value:52,pnl:-47.16},
{name:'OIL',ticker:'OIL',cat:'CFD',value:2562.86,pnl:50.08,margin:271.05},
{name:'NASDAQ 100',ticker:'SXRV.DE',cat:'ETF',value:220.74,pnl:81.03},
{name:'Core MSCI World',ticker:'EUNL.DE',cat:'ETF',value:83.71,pnl:23.98}
];
const eur=n=>new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}).format(n);const total=positions.reduce((a,p)=>a+Math.abs(p.value),0),pnl=positions.reduce((a,p)=>a+p.pnl,0);document.querySelector('#totalValue').textContent=eur(total);document.querySelector('#totalPnl').textContent=eur(pnl);document.querySelector('#totalPnl').className=pnl>=0?'positive':'negative';
function allocation(){let m={};positions.forEach(p=>{m[p.cat]=(m[p.cat]||0)+Math.abs(p.value)});document.querySelector('#allocation').innerHTML=Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="mini"><span>${k}</span><b>${eur(v)}</b><div class="bar"><i style="width:${v/total*100}%"></i></div></div>`).join('');}
function posHTML(p){return `<div class="position"><div><div class="name">${p.name}</div><small>${p.ticker} · ${p.cat}</small></div><div class="value">${eur(Math.abs(p.value))}</div><small>P/L aberto</small><div class="value ${p.pnl>=0?'positive':'negative'}">${eur(p.pnl)}</div></div>`}
function render(filter='ALL'){let a=positions.filter(p=>filter==='ALL'||p.cat===filter).sort((a,b)=>Math.abs(b.value)-Math.abs(a.value));document.querySelector('#positionsList').innerHTML=a.map(posHTML).join('');document.querySelector('#topPositions').innerHTML=a.slice(0,5).map(posHTML).join('')}
allocation();render();document.querySelector('#filter').onchange=e=>render(e.target.value);
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector('#'+b.dataset.tab).classList.add('active')});
const basePrice=97.71,basePnl=50.08,sens=26.22;function sim(v){v=+v;document.querySelector('#oilPrice').textContent=v.toFixed(2).replace('.',',');document.querySelector('#oilInput').value=v.toFixed(2);document.querySelector('#oilSlider').value=v;let est=basePnl+(basePrice-v)*sens;let o=document.querySelector('#oilPnl');o.value=eur(est);o.className=est>=0?'positive':'negative';let be=basePrice+basePnl/sens;document.querySelector('#be').innerHTML=`Break-even aproximado com os custos atuais: <b>$${be.toFixed(2)}</b>. Abaixo desse nível, a simulação fica positiva; acima, negativa.`}sim(basePrice);document.querySelector('#oilSlider').oninput=e=>sim(e.target.value);document.querySelector('#oilInput').onchange=e=>sim(e.target.value);
function risk(){let ml=+(localStorage.maxLoss||250),mm=+(localStorage.maxMargin||2000);document.querySelector('#maxLoss').value=ml;document.querySelector('#maxMargin').value=mm;let a=[];positions.forEach(p=>{if(p.pnl<-ml)a.push(['bad',p.name,`P/L ${eur(p.pnl)} abaixo do limite de ${eur(-ml)}.`]);if(p.cat==='CFD'&&(p.margin||0)>mm)a.push(['warn',p.name,`Margem ${eur(p.margin)} acima do limite definido.`])});a.push(['warn','OIL',`Próximo rollover indicado no relatório/instrumento: 21/10/2026.`]);document.querySelector('#alerts').innerHTML=a.map(x=>`<div class="alert ${x[0]}"><b>${x[1]}</b><div>${x[2]}</div></div>`).join('')||'<div class="alert">Sem alertas pelos limites atuais.</div>'}risk();document.querySelector('#saveRisk').onclick=()=>{localStorage.maxLoss=document.querySelector('#maxLoss').value;localStorage.maxMargin=document.querySelector('#maxMargin').value;risk()};
let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;install.hidden=false});install.onclick=async()=>{if(deferred){deferred.prompt();deferred=null;install.hidden=true}};if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
