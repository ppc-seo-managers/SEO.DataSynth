// Shared helpers for the 1c report pages (no data here). Loaded before the page script.
var RLC='#25408a';
function bars(id, rows){
var el=document.getElementById(id); if(!el) return;
var max=Math.max.apply(null,rows.map(function(r){return r[1]}));
el.innerHTML = rows.map(function(r){
return '<div class="barrow"><span class="lbl">'+r[0]+'</span><span class="track"><span class="fill" style="width:'+(r[1]/max*100).toFixed(1)+'%"></span></span><span class="v">'+r[2]+'</span></div>';
}).join('');
}
function arrow(delta){
if (delta > 0) return '<span class="mvUp">▲ +'+delta.toLocaleString()+'</span>';
if (delta < 0) return '<span class="mvDown">▼ '+delta.toLocaleString()+'</span>';
return '<span class="flat">–</span>';
}
function pct(now, prev){
if (prev === 0) return now > 0 ? '<span class="mvNew">new</span>' : '–';
var p = ((now - prev) / prev * 100);
var s = (p>=0?'+':'') + p.toFixed(0) + '%';
return '<span class="'+(p>0?'mvUp':p<0?'mvDown':'flat')+'">'+s+'</span>';
}
function renderGscTable(id, rows){
var el = document.getElementById(id); if(!el) return;
el.innerHTML = '<thead><tr><th>Query</th><th class="num">Clicks</th><th class="num">vs Aug</th><th class="num">Impressions</th><th class="num">vs Aug</th></tr></thead><tbody>' +
rows.map(function(r){
return '<tr><td>'+r.q+'</td>'+
'<td class="num">'+r.c+'</td>'+
'<td class="num">'+arrow(r.c-r.cp)+' <span style="font-size:12px">'+pct(r.c,r.cp)+'</span></td>'+
'<td class="num">'+r.i.toLocaleString()+'</td>'+
'<td class="num">'+arrow(r.i-r.ip)+' <span style="font-size:12px">'+pct(r.i,r.ip)+'</span></td>'+
'</tr>';
}).join('') + '</tbody>';
}
function kwSpark(h,dates){
var pts=h.map(function(v,i){return v==null?null:[i,v]}).filter(Boolean);
if(!pts.length) return '<svg class="spark" viewBox="0 0 72 22"><text class="nodata" x="0" y="15">not ranked</text></svg>';
var vals=pts.map(function(p){return p[1]}), lo=Math.min.apply(null,vals), hi=Math.max.apply(null,vals), span=(hi-lo)||1;
var n=h.length, x=function(i){return n>1?4+i*(64/(n-1)):36}, y=function(v){return 4+((v-lo)/span)*14};
var line=pts.map(function(p){return x(p[0]).toFixed(1)+','+y(p[1]).toFixed(1)}).join(' ');
var last=pts[pts.length-1];
return '<svg class="spark" viewBox="0 0 72 22" aria-label="'+h.map(function(v,i){return dates[i]+': '+(v==null?'not ranked':'#'+v)}).join(', ')+'"><polyline points="'+line+'"/><circle cx="'+x(last[0]).toFixed(1)+'" cy="'+y(last[1]).toFixed(1)+'" r="2.5"/></svg>';
}
function labelTables(){
document.querySelectorAll('table.dt').forEach(function(t){
var hs=[].map.call(t.querySelectorAll('thead th'),function(th){return th.textContent.trim()});
t.querySelectorAll('tbody tr').forEach(function(tr){
[].forEach.call(tr.children,function(td,i){ if(i===0) td.classList.add('head'); else td.setAttribute('data-label',hs[i]||''); });
});
});
}
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function nl2br(s){ return esc(s).trim().replace(/\n+/g,'<br>'); }
function rings(){document.querySelectorAll('[data-ring]').forEach(function(s){var v=+s.dataset.ring,r=19,c=2*Math.PI*r;s.innerHTML='<circle class="bg" cx="24" cy="24" r="'+r+'"/><circle class="fg'+(v<50?' mid':'')+'" cx="24" cy="24" r="'+r+'" stroke-dasharray="'+(c*v/100).toFixed(1)+' '+c.toFixed(1)+'"/>';});}
function kpiSpark(id,v){var s=document.getElementById(id);if(!s)return;var lo=Math.min.apply(null,v),hi=Math.max.apply(null,v),sp=(hi-lo)||1;var p=v.map(function(y,i){return (4+i*64/(v.length-1)).toFixed(1)+','+(18-((y-lo)/sp)*14).toFixed(1)}).join(' ');s.innerHTML='<polyline points="'+p+'"/><circle cx="68" cy="'+(18-((v[v.length-1]-lo)/sp)*14).toFixed(1)+'" r="2.5"/>';}
function area(id,labels,v){var s=document.getElementById(id);if(!s)return;var W=720,H=200,L=44,R=12,T=12,B=28,hi=Math.max.apply(null,v);var yv=function(x){return H-B-(x/hi)*(H-T-B)},xv=function(i){return L+i*(W-L-R)/(labels.length-1)};var out='';[0,hi/2,hi].forEach(function(t){out+='<line class="ax" x1="'+L+'" x2="'+(W-R)+'" y1="'+yv(t).toFixed(1)+'" y2="'+yv(t).toFixed(1)+'"/><text x="'+(L-6)+'" y="'+(yv(t)+4).toFixed(1)+'" text-anchor="end">'+Math.round(t).toLocaleString()+'</text>';});labels.forEach(function(l,i){out+='<text x="'+xv(i).toFixed(1)+'" y="'+(H-8)+'" text-anchor="middle">'+l+'</text>';});var pts=v.map(function(y,i){return xv(i).toFixed(1)+','+yv(y).toFixed(1)});out+='<polygon class="area" fill="'+RLC+'" points="'+xv(0)+','+(H-B)+' '+pts.join(' ')+' '+xv(v.length-1)+','+(H-B)+'"/><polyline class="ln" stroke="'+RLC+'" points="'+pts.join(' ')+'"/>';var last=pts[pts.length-1].split(',');out+='<circle cx="'+last[0]+'" cy="'+last[1]+'" r="3" fill="'+RLC+'"/><text x="'+(+last[0]-6)+'" y="'+(+last[1]-8)+'" text-anchor="end" font-weight="700">'+v[v.length-1].toLocaleString()+'</text>';s.innerHTML=out;}
function distChart(id,days,hist){var s=document.getElementById(id);if(!s)return;var total=hist.length;
var Bc=['#1f6b3a','#6cbf6a','#f5c542','#f28c38','#c0392b'],N=['1–3','4–10','11–20','21–50','51–100'];
var W=720,L=44,T=14,H=150,Bm=28,bw=56,out='';
for(var w=0;w<days.length;w++){var c=[0,0,0,0,0],ranked=0;hist.forEach(function(h){var p=h[w];if(p==null||p>100)return;ranked++;c[p<=3?0:p<=10?1:p<=20?2:p<=50?3:4]++});var x=L+24+w*120,y=H-Bm;for(var b=0;b<5;b++){if(!c[b])continue;var hh=c[b]*(H-T-Bm)/total;y-=hh;out+='<rect x="'+x+'" y="'+y.toFixed(1)+'" width="'+bw+'" height="'+(hh-1).toFixed(1)+'" rx="2" fill="'+Bc[b]+'"/>'}out+='<text x="'+(x+bw/2)+'" y="'+(y-4).toFixed(1)+'" text-anchor="middle" font-weight="700">'+ranked+' of '+total+'</text><text x="'+(x+bw/2)+'" y="'+(H-8)+'" text-anchor="middle">'+days[w]+'</text>'}
out+='<line class="ax" x1="'+L+'" x2="'+(W-12)+'" y1="'+T+'" y2="'+T+'"/><text x="'+(L-6)+'" y="'+(T+4)+'" text-anchor="end">'+total+'</text><text x="'+(L-6)+'" y="'+(H-Bm+4)+'" text-anchor="end">0</text>';
s.innerHTML=out;var lg=document.createElement('div');lg.className='legend';lg.innerHTML=N.map(function(n,i){return'<span><i style="background:'+Bc[i]+'"></i>'+n+'</span>'}).join('');s.parentNode.insertBefore(lg,s.nextSibling);}
// Floating table of contents (2026-10-06). Call toc() once after the sections exist. Builds from the hero (Overview), Highlights, Next steps and every section[data-mod] with a .sectitle, in document order. Rail on wide screens, collapsible button elsewhere; hidden in print.
function toc(){
if(document.getElementById('toc')) return;
var items=[];
function add(el,label,num,id){ if(!el) return; if(!el.id) el.id=id; el.setAttribute('data-toc-target',''); items.push({el:el,label:label,num:num}); }
document.querySelectorAll('.wrap section').forEach(function(s){
if(s.classList.contains('hero')) return add(s,'Overview','','sec-hero');
if(s.querySelector('.hltitle')) return add(s,'Highlights','','sec-highlights');
if(s.classList.contains('next')) return add(s,'Next steps','','sec-next');
var t=s.querySelector('.sectitle'); if(!t) return;
var p=s.querySelector('.sechead .pill'), m=p&&p.textContent.match(/^\s*(\d{2})/);
add(s,t.textContent.trim(),m?m[1]:'','sec-'+(s.getAttribute('data-mod')||items.length));
});
if(items.length<3) return;
var nav=document.createElement('nav'); nav.className='toc noprint'; nav.id='toc'; nav.setAttribute('aria-label','Contents');
nav.innerHTML='<button class="tocbtn" type="button" aria-expanded="false" aria-controls="toclist"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg><span>Contents</span></button><ol class="toclist" id="toclist">'+
items.map(function(it){ return '<li><a href="#'+it.el.id+'"><span class="n">'+(it.num||'·')+'</span><span class="t">'+esc(it.label)+'</span></a></li>'; }).join('')+'</ol>';
document.body.appendChild(nav);
var btn=nav.querySelector('.tocbtn'), lis=nav.querySelectorAll('li'), rail=matchMedia('(min-width:1440px)');
function setOpen(o){ nav.classList.toggle('open',o); btn.setAttribute('aria-expanded',o?'true':'false'); }
btn.addEventListener('click',function(){ setOpen(!nav.classList.contains('open')); });
nav.addEventListener('click',function(e){ if(e.target.closest('a')&&!rail.matches) setOpen(false); });
document.addEventListener('click',function(e){ if(!nav.contains(e.target)) setOpen(false); });
document.addEventListener('keydown',function(e){ if(e.key==='Escape') setOpen(false); });
var tick=false;
function mark(){ tick=false; var line=innerHeight*0.35, cur=0;
items.forEach(function(it,i){ if(it.el.getBoundingClientRect().top<=line) cur=i; });
if(innerHeight+scrollY>=document.documentElement.scrollHeight-2) cur=items.length-1;
lis.forEach(function(li,i){ li.classList.toggle('on',i===cur); }); }
addEventListener('scroll',function(){ if(!tick){ tick=true; requestAnimationFrame(mark); } },{passive:true});
addEventListener('resize',mark); mark();
}
