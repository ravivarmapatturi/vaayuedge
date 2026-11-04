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
function top(){return phone.offsetTop}
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
