(function(){
var root=document.documentElement, body=document.body;
document.getElementById('pdfBtn').addEventListener('click',function(){document.querySelectorAll('details').forEach(function(d){d.open=true});window.print();});
var tb=document.getElementById('themeBtn');
function paint(){var dk=root.getAttribute('data-theme')==='dark';tb.setAttribute('aria-label',dk?'Switch to light mode':'Switch to dark mode');tb.title=tb.getAttribute('aria-label');}
tb.addEventListener('click',function(){var t=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',t);try{localStorage.setItem('report:theme',t)}catch(e){}paint();});paint();
function retoc(){var t=document.getElementById('toc');if(t)t.remove();try{toc()}catch(e){}}
var vb=document.getElementById('viewBtn');
function setView(v){body.setAttribute('data-view',v);if(vb)document.getElementById('viewName').textContent=v==='marketer'?'Partner':'Business owner';retoc();}
if(vb){vb.addEventListener('click',function(){setView(body.getAttribute('data-view')==='marketer'?'owner':'marketer')});if(/#(partner|marketer)/.test(location.hash))setView('marketer');}
document.querySelectorAll('.cmp button').forEach(function(b){b.addEventListener('click',function(){body.setAttribute('data-cmp',b.dataset.c);document.querySelectorAll('.cmp button').forEach(function(x){x.classList.toggle('on',x===b)})})});
function nf(v){return v>=10000?(v/1000).toFixed(1)+'K':(Math.round(v*10)/10).toLocaleString()}
function init(sc){
sc.querySelectorAll('.filters').forEach(function(fw){var s=fw.closest('section')||sc;fw.querySelectorAll('.fchip').forEach(function(b){b.addEventListener('click',function(){var f=b.dataset.f;fw.querySelectorAll('.fchip').forEach(function(x){x.classList.toggle('on',x===b)});s.querySelectorAll('.tasks.done .tk,#donelist .tk').forEach(function(li){li.style.display=(f==='*'||li.dataset.kind===f)?'':'none'})})})});
sc.querySelectorAll('.t5').forEach(function(w){w.querySelectorAll('.tab').forEach(function(b){b.addEventListener('click',function(){w.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===b)});w.querySelectorAll('.pane').forEach(function(p){p.hidden=p.dataset.p!==b.dataset.p})})})});
sc.querySelectorAll('.trend').forEach(function(w){
 var d=JSON.parse(w.querySelector('script').textContent), svg=w.querySelector('svg'), tip=w.querySelector('.tip'), line=d.t==='line';
 function draw(k){var v=d.s[k], mx=Math.max.apply(null,v.concat([1]))*(line?1.25:1), n=v.length, W=720, H=210, L=8, B=26, T=22, bw=(W-L*2)/n, s='', pts=[];
  for(var i=0;i<n;i++){var h=(H-B-T)*v[i]/mx, x=L+i*bw+bw*0.18, y=H-B-h, last=i===n-1, cx=x+bw*0.32;
   if(line){pts.push(cx.toFixed(1)+','+y.toFixed(1));s+='<circle class="dot" cx="'+cx.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="6"/>';}
   else s+='<rect class="'+(last?'bar1':'bar0')+'" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+(bw*0.64).toFixed(1)+'" height="'+Math.max(h,0).toFixed(1)+'" rx="3"/>';
   if(line||last||i===n-2||i===0)s+='<text class="vlab" x="'+cx.toFixed(1)+'" y="'+(y-(line?12:6)).toFixed(1)+'" text-anchor="middle">'+nf(v[i])+(line&&d.u[k].charAt(0)==='%'?'%':'')+'</text>';
   s+='<text x="'+cx.toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle">'+d.m[i]+'</text>';
   s+='<rect class="hit" data-i="'+i+'" x="'+(L+i*bw).toFixed(1)+'" y="0" width="'+bw.toFixed(1)+'" height="'+H+'"/>';}
  if(line&&pts.length>1)s='<polyline class="ln" points="'+pts.join(' ')+'"/>'+s;
  s+='<line x1="'+L+'" x2="'+(W-L)+'" y1="'+(H-B)+'" y2="'+(H-B)+'" stroke="currentColor" stroke-opacity=".2"/>';
  svg.innerHTML=s;
  svg.querySelectorAll('.hit').forEach(function(r){function show(){var i=+r.dataset.i, bb=svg.getBoundingClientRect(), x=(L+(i+.5)*bw)/W*bb.width;tip.hidden=false;tip.textContent=d.m[i]+': '+(Math.round(v[i]*10)/10).toLocaleString()+' '+d.u[k].toLowerCase();tip.style.left=x+'px';tip.style.top=((H-B-(H-B-T)*v[i]/mx)/H*bb.height)+'px';}
   r.addEventListener('mouseenter',show);r.addEventListener('click',show);r.addEventListener('mouseleave',function(){tip.hidden=true});});}
 var tabs=w.querySelectorAll('.tab');tabs.forEach(function(b){b.addEventListener('click',function(){tabs.forEach(function(x){x.classList.toggle('on',x===b)});draw(b.dataset.k)})});
 draw(Object.keys(d.s)[0]);});
try{labelTables()}catch(e){}
}
var mo=document.getElementById('mo'), ms=document.getElementById('month'), cache={};
if(mo&&ms){
 cache[mo.dataset.month]=mo.innerHTML;
 function setMonth(m){if(m===mo.dataset.month)return;var src=cache[m];if(src==null){var t=document.querySelector('template[data-month="'+m+'"]');if(!t)return;src=t.innerHTML;}
  mo.innerHTML=src;mo.dataset.month=m;ms.value=m;
  var o=ms.options[ms.selectedIndex];document.querySelectorAll('.monthLabel').forEach(function(x){x.textContent=o.text});
  document.querySelectorAll('.cmp button').forEach(function(x){x.classList.toggle('on',x.dataset.c===body.getAttribute('data-cmp'))});
  init(mo);retoc();window.scrollTo(0,0);}
 ms.addEventListener('change',function(){setMonth(ms.value)});
 init(mo);
 var hm=location.hash.match(/(\d{4}-\d{2})/);if(hm)setMonth(hm[1]);
}else init(document);
try{toc()}catch(e){}
})();
