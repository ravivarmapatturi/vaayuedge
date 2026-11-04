(function(){
var stage=document.getElementById('stage');if(!stage)return;
var P=[{k:'voice',c:'#5eead4'},{k:'vision',c:'#fbbf24'},{k:'doc',c:'#a78bfa'}];
var chips=[].slice.call(stage.querySelectorAll('.chip')),scenes=[].slice.call(stage.querySelectorAll('.scene'));
var phone=stage.querySelector('.phone'),cv=stage.querySelector('canvas'),x=cv.getContext('2d');
var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
var cur=0,ball=null,rings=[],sparks=[],wait=0,visible=true,last=0,W=0,H=0,auto=true;
function size(){var r=stage.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0)}
function show(i){cur=i;stage.style.setProperty('--c',P[i].c);chips.forEach(function(b,j){b.setAttribute('aria-pressed',j===i)});scenes.forEach(function(s,j){s.classList.toggle('on',j===i)})}
function clear(){scenes.forEach(function(s){s.classList.remove('on')})}
function drop(i){cur=i;stage.style.setProperty('--c',P[i].c);chips.forEach(function(b,j){b.setAttribute('aria-pressed',j===i)});clear();ball={y:58,v:0,b:0,c:P[i].c}}
function top(){return phone.getBoundingClientRect().top-stage.getBoundingClientRect().top}
function land(){phone.classList.remove('hit');void phone.offsetWidth;phone.classList.add('hit');rings.push({r:12,a:.9,c:ball.c});for(var i=0;i<16;i++){var t=Math.PI+Math.random()*Math.PI;sparks.push({x:W/2,y:top(),vx:Math.cos(t)*140*Math.random(),vy:Math.sin(t)*220*Math.random(),a:1,c:ball.c})}}
function tick(t){requestAnimationFrame(tick);if(!visible)return;var d=Math.min((t-last)/1000,.04);last=t;x.clearRect(0,0,W,H);
 if(ball){ball.v+=1500*d;ball.y+=ball.v*d;var ty=top()-13;
  if(ball.b<2&&ball.y>=ty){ball.y=ty;land();ball.b++;ball.v*=-.42}
  else if(ball.b>=2&&ball.y>ty+60){show(cur);ball=null;wait=6.2}
  if(ball){x.save();if(ball.b>=2){x.beginPath();x.rect(0,0,W,top()+2);x.clip()}
   x.beginPath();x.moveTo(W/2,58);x.lineTo(W/2,ball.y);x.strokeStyle=ball.c+'33';x.lineWidth=2;x.stroke();
   x.shadowColor=ball.c;x.shadowBlur=30;x.fillStyle=ball.c;x.beginPath();x.arc(W/2,ball.y,13,0,7);x.fill();x.restore()}}
 else if(auto){wait-=d;if(wait<=0)drop((cur+1)%3)}
 rings=rings.filter(function(r){r.r+=170*d;r.a-=1.5*d;if(r.a<=0)return false;x.globalAlpha=r.a;x.strokeStyle=r.c;x.lineWidth=2;x.beginPath();x.ellipse(W/2,top(),r.r,r.r*.22,0,0,7);x.stroke();x.globalAlpha=1;return true});
 sparks=sparks.filter(function(s){s.vy+=500*d;s.x+=s.vx*d;s.y+=s.vy*d;s.a-=1.7*d;if(s.a<=0)return false;x.globalAlpha=s.a;x.fillStyle=s.c;x.fillRect(s.x,s.y,3,3);x.globalAlpha=1;return true})}
chips.forEach(function(b,i){b.addEventListener('click',function(){auto=true;if(still)show(i);else{drop(i)}})});
size();addEventListener('resize',size);
if(still){show(0);return}
new IntersectionObserver(function(e){visible=e[0].isIntersecting;last=performance.now()}).observe(stage);
drop(0);last=performance.now();requestAnimationFrame(tick);
})();
(function(){
var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(still)return;
var root=document.documentElement;root.classList.add('motion');
// Headline enters word by word
var h=document.querySelector('.edge-hero h1');
if(h){var n=0;[].slice.call(h.childNodes).forEach(function(c){var t=c.textContent.split(/\s+/).filter(Boolean),f=document.createDocumentFragment(),o=c.nodeType===1?c.cloneNode(false):null;t.forEach(function(w){var s=document.createElement('span');s.className='w';s.style.animationDelay=(n++*55)+'ms';s.textContent=w;(o||f).appendChild(s);(o||f).appendChild(document.createTextNode(' '))});h.replaceChild(o||f,c)})}
// Sections rise in as they enter the screen
var els=document.querySelectorAll('.section-head,.product,.path,.why>div,.data-preview,.index-row,.roadmap>div,.narrow>h2,.narrow>.lede');
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
[].forEach.call(els,function(e){e.classList.add('rv');var i=[].indexOf.call(e.parentNode.children,e);e.style.transitionDelay=Math.min(i,4)*70+'ms';io.observe(e)});
// Light follows the pointer on product cards
[].forEach.call(document.querySelectorAll('.product,.path'),function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')})});
// Phone tilts toward the pointer
var ph=document.querySelector('.phone'),hero=document.querySelector('.edge-hero');
if(ph&&matchMedia('(hover:hover)').matches){hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();ph.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*14+'deg');ph.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*10+'deg')});hero.addEventListener('pointerleave',function(){ph.style.setProperty('--ry','0deg');ph.style.setProperty('--rx','0deg')})}
// Data motes drift through the hero and are drawn toward the device
if(!hero)return;
var cv=document.createElement('canvas');cv.className='motes';cv.setAttribute('aria-hidden','true');hero.insertBefore(cv,hero.firstChild);
var x=cv.getContext('2d'),W=0,H=0,ps=[],on=true,cols=['94,234,212','251,191,36','167,139,250'];
function size(){var r=hero.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0);var want=W<700?18:42;ps=[];for(var i=0;i<want;i++)ps.push(make(true))}
function make(any){return{x:Math.random()*W*(ph?.72:1),y:any?Math.random()*H:-8,vx:(Math.random()-.5)*12,vy:10+Math.random()*22,r:1+Math.random()*1.4,c:cols[Math.floor(Math.random()*3)]}}
function goal(){if(!ph)return{x:W/2,y:H+40};var a=ph.getBoundingClientRect(),b=hero.getBoundingClientRect();return{x:a.left-b.left+a.width/2,y:a.top-b.top+a.height/2}}
var last=performance.now();
function tick(t){requestAnimationFrame(tick);if(!on)return;var d=Math.min((t-last)/1000,.04);last=t;x.clearRect(0,0,W,H);var g=goal();
 ps.forEach(function(p,i){var dx=g.x-p.x,dy=g.y-p.y,m=Math.hypot(dx,dy)||1;var pull=12;p.vx+=dx/m*pull*d;p.vy+=dy/m*pull*d;p.vx*=.995;p.vy*=.995;p.x+=p.vx*d;p.y+=p.vy*d;if((ph&&Math.abs(dx)<125&&Math.abs(dy)<215)||m<30||p.y>H+10||p.x<-10||p.x>W+10)ps[i]=make(false);
  var a=Math.min(1,m/120)*.6;x.fillStyle='rgba('+p.c+','+a+')';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();x.fillStyle='rgba('+p.c+','+a*.16+')';x.beginPath();x.arc(p.x,p.y,p.r*3,0,7);x.fill();
  for(var j=i+1;j<ps.length;j++){var q=ps[j],l=Math.hypot(p.x-q.x,p.y-q.y);if(l<84){x.strokeStyle='rgba('+p.c+','+(1-l/84)*.16+')';x.lineWidth=1;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}})}
size();addEventListener('resize',size);new IntersectionObserver(function(e){on=e[0].isIntersecting;last=performance.now()}).observe(hero);requestAnimationFrame(tick);
})();
