(function(){
var root=document.documentElement, body=document.body;
document.getElementById('pdfBtn').addEventListener('click',function(){document.querySelectorAll('details').forEach(function(d){d.open=true});window.print();});
var tb=document.getElementById('themeBtn');
function paint(){var dk=root.getAttribute('data-theme')==='dark';tb.setAttribute('aria-label',dk?'Switch to light mode':'Switch to dark mode');tb.title=tb.getAttribute('aria-label');}
tb.addEventListener('click',function(){var t=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',t);try{localStorage.setItem('report:theme',t)}catch(e){}paint();});paint();
var vb=document.getElementById('viewBtn');
function setView(v){body.setAttribute('data-view',v);if(vb)document.getElementById('viewName').textContent=v==='marketer'?'Partner':'Business owner';if(window.toc){var t=document.querySelector('.toc');if(t)t.remove();try{toc()}catch(e){}}}
if(vb){vb.addEventListener('click',function(){setView(body.getAttribute('data-view')==='marketer'?'owner':'marketer')});if(/#(partner|marketer)/.test(location.hash))setView('marketer');}
document.querySelectorAll('.cmp button').forEach(function(b){b.addEventListener('click',function(){body.setAttribute('data-cmp',b.dataset.c);document.querySelectorAll('.cmp button').forEach(function(x){x.classList.toggle('on',x===b)})})});
document.querySelectorAll('.fchip').forEach(function(b){b.addEventListener('click',function(){var f=b.dataset.f;document.querySelectorAll('.fchip').forEach(function(x){x.classList.toggle('on',x===b)});document.querySelectorAll('#donelist .tk').forEach(function(li){li.style.display=(f==='*'||li.dataset.kind===f)?'':'none'})})});
document.querySelectorAll('.t5').forEach(function(w){w.querySelectorAll('.tab').forEach(function(b){b.addEventListener('click',function(){w.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('on',x===b)});w.querySelectorAll('.pane').forEach(function(p){p.hidden=p.dataset.p!==b.dataset.p})})})});
function nf(v){return v>=10000?(v/1000).toFixed(1)+'K':Math.round(v).toLocaleString()}
document.querySelectorAll('.trend').forEach(function(w){
 var d=JSON.parse(w.querySelector('script').textContent), svg=w.querySelector('svg'), tip=w.querySelector('.tip');
 function draw(k){var v=d.s[k], mx=Math.max.apply(null,v.concat([1])), n=v.length, W=720, H=210, L=8, B=26, T=22, bw=(W-L*2)/n, s='';
  for(var i=0;i<n;i++){var h=(H-B-T)*v[i]/mx, x=L+i*bw+bw*0.18, y=H-B-h, last=i===n-1;
   s+='<rect class="'+(last?'bar1':'bar0')+'" x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+(bw*0.64).toFixed(1)+'" height="'+Math.max(h,0).toFixed(1)+'" rx="3"/>';
   if(last||i===n-2||i===0)s+='<text class="vlab" x="'+(x+bw*0.32).toFixed(1)+'" y="'+(y-6).toFixed(1)+'" text-anchor="middle">'+nf(v[i])+'</text>';
   s+='<text x="'+(x+bw*0.32).toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle">'+d.m[i]+'</text>';
   s+='<rect class="hit" data-i="'+i+'" x="'+(L+i*bw).toFixed(1)+'" y="0" width="'+bw.toFixed(1)+'" height="'+H+'"/>';}
  s+='<line x1="'+L+'" x2="'+(W-L)+'" y1="'+(H-B)+'" y2="'+(H-B)+'" stroke="currentColor" stroke-opacity=".2"/>';
  svg.innerHTML=s;
  svg.querySelectorAll('.hit').forEach(function(r){function show(){var i=+r.dataset.i, bb=svg.getBoundingClientRect(), x=(L+(i+.5)*bw)/W*bb.width;tip.hidden=false;tip.textContent=d.m[i]+': '+Math.round(v[i]).toLocaleString()+' '+d.u[k].toLowerCase();tip.style.left=x+'px';tip.style.top=((H-B-(H-B-T)*v[i]/mx)/H*bb.height)+'px';}
   r.addEventListener('mouseenter',show);r.addEventListener('click',show);r.addEventListener('mouseleave',function(){tip.hidden=true});});}
 var tabs=w.querySelectorAll('.tab');tabs.forEach(function(b){b.addEventListener('click',function(){tabs.forEach(function(x){x.classList.toggle('on',x===b)});draw(b.dataset.k)})});
 draw(Object.keys(d.s)[0]);});
try{labelTables()}catch(e){}try{toc()}catch(e){}
})();
