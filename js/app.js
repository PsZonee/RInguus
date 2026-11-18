const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],C=CONFIG;
const H=h=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstChild};
const I=(n,c='')=>`<img class="${c}" src="assets/img/${n}.png" alt="">`;
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
const ctr=e=>{const r=e.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const store={get:k=>{try{return localStorage.getItem(k)}catch(e){}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
const HEARTS=['red_heart','pink_heart','sparkling_heart','growing_heart','two_hearts','sparkles','kiss_mark','heart_with_ribbon'];
/* sound */
let on=store.get('snd')!=='off';const A={};
['pop','pop2','click','nope','whoosh','sparkle','boing','yay'].forEach(n=>A[n]=new Audio(`assets/sounds/${n}.mp3`));
const sfx=(n,v=.8)=>{if(!on)return;const a=A[n].cloneNode();a.volume=v;a.play().catch(()=>{})};
const music=new Audio('assets/sounds/music.mp3');music.loop=true;music.volume=.28;
$('#mu').classList.toggle('off',!on);
$('#mu').onclick=()=>{on=!on;store.set('snd',on?'on':'off');on?music.play().catch(()=>{}):music.pause();$('#mu').classList.toggle('off',!on)};
/* hearts */
function burst(x,y,n=10,spread=130){if(reduce)n=Math.min(n,3);
 for(let i=0;i<n;i++){const s=rnd(20,42),e=H(`<img class="fx" src="assets/img/${pick(HEARTS)}.png" alt="" style="left:${x-s/2}px;top:${y-s/2}px;width:${s}px">`),a=rnd(0,6.28),r=rnd(spread*.4,spread);document.body.append(e);
 e.animate([{transform:'translate(0,0) scale(.3)',opacity:1},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r-40}px) rotate(${rnd(-40,40)}deg) scale(1)`,opacity:1,offset:.6},{transform:`translate(${Math.cos(a)*r*1.1}px,${Math.sin(a)*r+40}px) scale(.8)`,opacity:0}],{duration:rnd(700,1100),easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>e.remove()}}
const confetti=ms=>{const t=setInterval(()=>burst(rnd(60,innerWidth-60),rnd(90,innerHeight*.6),12,200),260);setTimeout(()=>clearInterval(t),ms)};
setInterval(()=>{if(document.hidden||$$('.fl').length>14)return;const s=rnd(20,48),e=H(`<img class="fl" src="assets/img/${pick(HEARTS.slice(0,5))}.png" alt="" style="width:${s}px;left:${rnd(0,innerWidth-s)}px">`);$('#bg').append(e);
 e.animate([{transform:'translate(0,0) rotate(-8deg)',opacity:0},{opacity:.85,offset:.12},{transform:`translate(${rnd(-70,70)}px,${-innerHeight-140}px) rotate(14deg)`,opacity:0}],{duration:rnd(7000,12000),easing:'ease-in'}).onfinish=()=>e.remove()},reduce?2500:850);
addEventListener('pointerdown',e=>{if(!e.target.closest('.nb,#gate'))burst(e.clientX,e.clientY,4,70)});
addEventListener('click',e=>{if(e.target.closest('a,button'))sfx('click',.5)});
/* setup text */
document.title=`For ${C.her}`;$$('.her').forEach(e=>e.textContent=C.her);$('#hello').textContent=C.hello;
$('#open').onclick=e=>{sfx('sparkle');burst(...ctr(e.currentTarget),16,170);if(on)music.play().catch(()=>{});$('#gate').classList.add('gone');setTimeout(()=>$('#gate').remove(),800)};
/* router */
const PAGES=['home','letters','reasons','sorry','play','surprise'],inits={};
function go(first){const id=PAGES.includes(location.hash.slice(2))?location.hash.slice(2):'home';
 const show=()=>{$$('.pg').forEach(p=>p.hidden=p.id!==id);$$('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.p===id));scrollTo(0,0);inits[id]&&inits[id]()};
 if(first)return show();sfx('whoosh');$('#wipe').classList.add('in');setTimeout(()=>{show();$('#wipe').classList.remove('in')},320)}
addEventListener('hashchange',()=>go());
/* home */
const since=new Date(C.since);
const tick=()=>{const s=Math.max(0,(Date.now()-since)/1e3|0);$('#cd').innerHTML=[[s/86400|0,'days'],[s%86400/3600|0,'hours'],[s%3600/60|0,'minutes'],[s%60,'seconds']].map(([v,l])=>`<div class="st"><b>${v}</b><span>${l}</span></div>`).join('')};
tick();setInterval(tick,1000);
let taps=+store.get('taps')||0;$('#taps').textContent=taps;
$('#bigheart').onclick=e=>{taps++;store.set('taps',taps);$('#taps').textContent=taps;sfx(pick(['pop','pop2']));burst(...ctr($('#bigheart')),9);
 $('#tapline').textContent=taps%10?'':'- '+C.tapLines[(taps/10-1)%C.tapLines.length|0]};
/* letters */
inits.letters=()=>{const g=$('#lgrid');if(g.children.length)return;
 C.letters.forEach((l,i)=>{const b=H(`<button class="env st" style="--r:${(i%2?1:-1)*(1+i%3)}deg">${I('envelope')}<small>${l.tag}</small><b>${l.title}</b><span class="seal">${I('red_heart')}</span></button>`);b.onclick=()=>openLetter(l,b);g.append(b)})};
function openLetter(l,b){sfx('sparkle');burst(...ctr(b),8);
 const m=H(`<div class="modal nb"><div class="wrap"><button class="x" aria-label="Close">×</button><img class="gif" src="assets/gifs/letter.gif" alt=""><article class="paper"><h2>${l.title}</h2><p id="tp"></p><p class="sign">With all my love,<br>${C.me}</p></article></div></div>`);
 document.body.append(m);const p=m.querySelector('#tp');let i=0;const t=setInterval(()=>{p.textContent=l.body.slice(0,++i);if(i>=l.body.length)clearInterval(t)},reduce?1:24);
 const close=()=>{clearInterval(t);m.remove()};m.querySelector('.paper').onclick=()=>{clearInterval(t);p.textContent=l.body};
 m.querySelector('.x').onclick=close;m.onclick=e=>{if(e.target===m)close()};m.querySelector('.x').focus()}
/* reasons */
let got=[];try{got=JSON.parse(store.get('got')||'[]').filter(r=>C.reasons.includes(r))}catch(e){}
const chips=()=>{$('#chips').innerHTML=got.map(r=>`<span class="chip">${I('pink_heart')}${r}</span>`).join('');$('#cnt').textContent=`${got.length} of ${C.reasons.length} found`;$('#again').hidden=got.length<C.reasons.length};
inits.reasons=chips;
$('#pull').onclick=()=>{const left=C.reasons.filter(r=>!got.includes(r));if(!left.length)return;const r=pick(left);got.push(r);store.set('got',JSON.stringify(got));
 sfx('pop');burst(...ctr($('#pull img')),8);const c=$('#card');c.innerHTML=I(pick(HEARTS.slice(0,5)))+`<p>${r}</p>`;c.classList.remove('show');void c.offsetWidth;c.classList.add('show');chips();
 if(left.length===1){sfx('yay');confetti(3000)}};
$('#again').onclick=()=>{got=[];store.set('got','[]');$('#card').innerHTML='';chips()};
/* sorry */
let si=+store.get('si')||0;const sMsg=i=>SORRY[(i%SORRY.length+SORRY.length)%SORRY.length];
function showS(i,snd){si=(i%SORRY.length+SORRY.length)%SORRY.length;store.set('si',si);$('#sm').textContent=SORRY[si];$('#sn').textContent=`Page ${si+1} of ${SORRY.length}`;$('#sj').value=si+1;$('#sj').max=SORRY.length;const c=$('#sc');c.classList.remove('show');void c.offsetWidth;c.classList.add('show');if(snd)sfx(pick(['pop','pop2']))}
inits.sorry=()=>showS(si);
$('#sprev').onclick=()=>showS(si-1,1);$('#snext').onclick=()=>showS(si+1,1);$('#srnd').onclick=()=>showS(Math.random()*SORRY.length|0,1);$('#sj').onchange=e=>showS((+e.target.value||1)-1,1);
$('#semail').onclick=()=>{sfx('sparkle');
 const m=H(`<div class="modal nb"><div class="wrap"><button class="x" aria-label="Close">×</button><div class="mail"><h2>Send it by email</h2><label>To<input id="mt" type="email" placeholder="her@email.com"></label><label>Subject<input id="ms" value="I'm sorry, babe"></label><label>How many messages<select id="mc"><option>1</option><option>3</option><option>5</option><option>10</option></select></label><label>Message<textarea id="mb" rows="8"></textarea></label><p class="row"><a class="btn" id="mm" href="#">Open email app</a><a class="btn alt" id="mg" target="_blank" rel="noopener" href="#">Open Gmail</a><button class="btn alt" id="mcopy">Copy text</button></p></div></div></div>`);
 document.body.append(m);const q=s=>m.querySelector(s);q('#mt').value=store.get('to')||'';
 const link=()=>{const to=q('#mt').value.trim(),su=encodeURIComponent(q('#ms').value),bd=encodeURIComponent(q('#mb').value);store.set('to',to);q('#mm').href=`mailto:${to}?subject=${su}&body=${bd}`;q('#mg').href=`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(to)}&su=${su}&body=${bd}`};
 const fill=()=>{q('#mb').value=Array.from({length:+q('#mc').value},(_,j)=>sMsg(si+j)).join('\n\n')+`\n\nLove,\n${C.me}`;link()};
 fill();q('#mc').onchange=fill;m.addEventListener('input',link);
 q('#mcopy').onclick=e=>{const b=e.currentTarget;(navigator.clipboard?navigator.clipboard.writeText(q('#mb').value):Promise.reject()).catch(()=>{q('#mb').select();document.execCommand('copy')});b.textContent='Copied';sfx('pop')};
 const close=()=>m.remove();q('.x').onclick=close;m.onclick=e=>{if(e.target===m)close()}};
/* game */
let best=+store.get('best')||0;$('#best').textContent=best;
function play(){const ar=$('#arena');let score=0,t=25,sp,clock;$('#startbox').hidden=true;$('#res').hidden=true;$('#score').textContent=0;$('#time').textContent=t;sfx('whoosh');
 clock=setInterval(()=>{$('#time').textContent=--t;if(t<=0)end()},1e3);
 const spawn=()=>{if(t<=0)return;const gold=Math.random()<.12,s=rnd(48,72),e=H(`<img class="fh" src="assets/img/${gold?'sparkles':pick(['red_heart','pink_heart','growing_heart','sparkling_heart'])}.png" alt="" style="width:${s}px;left:${rnd(0,ar.clientWidth-s)}px;top:${-s}px">`);ar.append(e);
  e.animate([{transform:'translateY(0) rotate(-10deg)'},{transform:`translateY(${ar.clientHeight+s}px) rotate(10deg)`}],{duration:rnd(2200,3600)*(t<10?.75:1),easing:'ease-in'}).onfinish=()=>e.remove();
  e.onpointerdown=ev=>{score+=gold?3:1;$('#score').textContent=score;burst(ev.clientX,ev.clientY,gold?9:5,90);sfx(gold?'sparkle':pick(['pop','pop2']));e.remove()};
  sp=setTimeout(spawn,rnd(260,560)*(t<10?.7:1))};spawn();
 function end(){clearInterval(clock);clearTimeout(sp);$$('.fh').forEach(x=>x.remove());if(score>best){best=score;store.set('best',best);$('#best').textContent=best}
  const [,h,p]=[...C.gameLines].reverse().find(g=>score>=g[0]);$('#rt').textContent=`${score} hearts. ${h}`;$('#rp').textContent=p;$('#res').hidden=false;sfx('yay');confetti(1200)}}
$('#start').onclick=play;$('#again2').onclick=play;
/* surprise */
let n=0;const yes=$('#yes'),no=$('#no');$('#question').textContent=C.question;$('#yt').textContent=C.yesTitle;$('#ym').textContent=C.yesMessage;
const dodge=e=>{e.preventDefault();n++;sfx('boing');const a=$('#ask');no.style.left=rnd(0,a.clientWidth-no.offsetWidth)+'px';no.style.top=rnd(0,a.clientHeight-no.offsetHeight)+'px';no.textContent=C.noLines[Math.min(n,C.noLines.length-1)];yes.style.transform=`scale(${Math.min(1+n*.12,2)})`};
no.addEventListener('pointerenter',dodge);no.addEventListener('pointerdown',dodge);no.onclick=e=>e.preventDefault();
yes.onclick=()=>{$('#q').hidden=true;$('#ans').hidden=false;sfx('yay');music.volume=.4;confetti(4500)};
$('#kiss').onclick=e=>{sfx('sparkle');for(let i=0;i<3;i++)setTimeout(()=>burst(...ctr($('#ans .gif')),10,200),i*160)};
$('#redo').onclick=()=>{n=0;$('#q').hidden=false;$('#ans').hidden=true;no.textContent=C.noLines[0];no.removeAttribute('style');yes.removeAttribute('style');music.volume=.28};
go(true);
