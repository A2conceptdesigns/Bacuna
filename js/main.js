/* ============================================================
   BACUÑA ARCHITECTURE — Interactions
   ============================================================ */

/* ---- Shared nav + footer (keeps every page consistent) ---- */
const PAGES = [
  ['index.html','Home'],
  ['portfolio.html','Portfolio'],
  ['services.html','Services'],
  ['projects.html','Projects'],
  ['contact.html','Contact'],
];
const here = location.pathname.split('/').pop() || 'index.html';

const logoSVG = `<svg class="n" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 34V16L20 6l14 10v18" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <path d="M14 34V23h12v11" stroke="#B4552E" stroke-width="2" stroke-linejoin="round"/>
</svg>`;

function buildNav(){
  const links = PAGES.map(([h,l])=>{
    if(l==='Contact') return `<a href="${h}" class="nav-cta ${h===here?'active':''}">Let’s build</a>`;
    return `<a href="${h}" class="${h===here?'active':''}">${l}</a>`;
  }).join('');
  const nav = document.createElement('nav');
  nav.className='nav';
  nav.innerHTML = `
    <a class="brand" href="index.html">${logoSVG}<span>Bacuña<b>.</b></span></a>
    <div class="nav-links">${links}</div>
    <button class="burger" aria-label="Menu"><span></span><span></span><span></span></button>`;
  document.body.prepend(nav);

  const burger = nav.querySelector('.burger');
  const menu = nav.querySelector('.nav-links');
  burger.addEventListener('click',()=>{menu.classList.toggle('open');nav.classList.toggle('menu-open')});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');nav.classList.remove('menu-open')}));

  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});
}

function buildFooter(){
  const f = document.createElement('footer');
  f.className='footer wrap';
  f.innerHTML = `
    <div class="footer-top">
      <div class="col">
        <h4>Bacuña Architecture</h4>
        <h2>Let’s design something worth building.</h2>
        <a href="contact.html" class="btn ghost" style="margin-top:2rem;color:var(--paper);border-color:var(--sand)">Start a project <span class="arrow">→</span></a>
      </div>
      <div class="col">
        <h4>Explore</h4>
        ${PAGES.map(([h,l])=>`<a href="${h}">${l}</a>`).join('')}
        <a href="projects.html">Case studies</a>
      </div>
      <div class="col">
        <h4>Studio</h4>
        <a href="mailto:studio@bacuna.arch">studio@bacuna.arch</a>
        <a href="tel:+639170000000">+63 917 000 0000</a>
        <a href="#">Cebu City, Philippines</a>
        <a href="#">Instagram ↗</a>
        <a href="#">LinkedIn ↗</a>
      </div>
    </div>
    <div class="footer-bot">
      <span>© ${'2026'} Bacuña Architecture — RLA #00000</span>
      <span>Design & Build · Interiors · Master Planning</span>
      <span>Made with concrete &amp; care</span>
    </div>`;
  document.body.appendChild(f);
}

/* ---- Cursor ---- */
function cursor(){
  const c = document.createElement('div');
  c.className='cursor';document.body.appendChild(c);
  let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y;
  addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY});
  (function loop(){cx+=(x-cx)*.2;cy+=(y-cy)*.2;c.style.left=cx+'px';c.style.top=cy+'px';requestAnimationFrame(loop)})();
  const hov='a,button,.card,.svc-row,.chip,input,textarea,[data-cursor]';
  document.addEventListener('mouseover',e=>{if(e.target.closest(hov))c.classList.add('big')});
  document.addEventListener('mouseout',e=>{if(e.target.closest(hov))c.classList.remove('big')});
}

/* ---- Scroll reveal ---- */
function reveals(){
  const io = new IntersectionObserver((es)=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.14,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

/* ---- Counters ---- */
function counters(){
  const io = new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target, end=+el.dataset.count, suf=el.dataset.suffix||'';
      let t0=null, dur=1600;
      function step(ts){if(!t0)t0=ts;const p=Math.min((ts-t0)/dur,1);
        const val=Math.floor((1-Math.pow(1-p,3))*end);
        el.textContent=val.toLocaleString()+suf;
        if(p<1)requestAnimationFrame(step)}
      requestAnimationFrame(step);io.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));
}

/* ---- Parallax ---- */
function parallax(){
  const els=[...document.querySelectorAll('[data-parallax]')];
  if(!els.length) return;
  addEventListener('scroll',()=>{
    const vh=innerHeight;
    els.forEach(el=>{
      const r=el.getBoundingClientRect();
      const speed=+el.dataset.parallax||.12;
      const off=(r.top+r.height/2-vh/2)*-speed;
      el.style.transform=`translateY(${off.toFixed(1)}px) scale(1.08)`;
    });
  },{passive:true});
}

/* ---- Scroll progress ---- */
function progress(){
  const p=document.createElement('div');p.className='progress';document.body.appendChild(p);
  addEventListener('scroll',()=>{
    const h=document.documentElement.scrollHeight-innerHeight;
    p.style.width=(scrollY/h*100)+'%';
  },{passive:true});
}

/* ---- Project filters ---- */
function filters(){
  const chips=document.querySelectorAll('.chip');
  if(!chips.length) return;
  const cards=document.querySelectorAll('.card[data-cat]');
  chips.forEach(chip=>chip.addEventListener('click',()=>{
    chips.forEach(c=>c.classList.remove('active'));chip.classList.add('active');
    const f=chip.dataset.filter;
    cards.forEach(card=>{
      const show=f==='all'||card.dataset.cat===f;
      card.classList.toggle('hide',!show);
    });
  }));
}

/* ---- Page transition curtain ---- */
function transitions(){
  const curtain=document.createElement('div');curtain.className='curtain';document.body.appendChild(curtain);
  document.querySelectorAll('a[href]').forEach(a=>{
    const href=a.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto')||href.startsWith('tel')||a.target==='_blank'||href.includes('↗')) return;
    if(!/\.html$/.test(href)) return;
    a.addEventListener('click',e=>{
      if(href===here) return;
      e.preventDefault();
      curtain.classList.add('play');
      setTimeout(()=>location.href=href,520);
    });
  });
}

/* ---- Cinematic hero (cross-dissolving construction sequence) ---- */
function cineHero(){
  const hero=document.getElementById('cineHero');
  if(!hero) return;
  const slides=[...hero.querySelectorAll('.cine-slide')];
  const frameEl=hero.querySelector('.cine-frame');
  const labelEl=hero.querySelector('.cine-label');
  const bar=hero.querySelector('.cine-progress i');
  const total=slides.length, DUR=4400;
  let i=-1;

  // preload so dissolves never flash empty
  slides.forEach(s=>{const u=(s.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/)||[])[1];if(u){const im=new Image();im.src=u;}});

  function pad(n){return String(n).padStart(2,'0');}
  function go(){
    i=(i+1)%total;
    slides.forEach((s,k)=>s.classList.toggle('active',k===i));
    if(frameEl) frameEl.textContent=pad(i+1)+' / '+pad(total);
    if(labelEl) labelEl.textContent=slides[i].dataset.cap;
    if(bar){ bar.style.transition='none'; bar.style.width='0';
      requestAnimationFrame(()=>{ bar.style.transition='width '+DUR+'ms linear'; bar.style.width='100%'; }); }
  }
  go();
  setInterval(go, DUR);
}

/* ---- Scroll-scrubbed render reel (explode + rotate on scroll) ---- */
function reelScrub(){
  const track=document.querySelector('.reel-track');
  const v=document.getElementById('reelVideo');
  if(!track||!v) return;
  const cl=(x,a,b)=>Math.max(a,Math.min(b,x));

  // On touch / small screens, scroll-scrubbing a video is unreliable —
  // just auto-play the render on a loop so the animation is always visible.
  const touch = matchMedia('(hover:none)').matches || matchMedia('(max-width:760px)').matches;
  if(touch){
    v.muted=true; v.loop=true; v.setAttribute('playsinline','');
    const start=()=>{ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); };
    const io=new IntersectionObserver(es=>{ es.forEach(e=>{ e.isIntersecting?start():v.pause(); }); },{threshold:.25});
    io.observe(v);
    start();
    return;
  }

  const meter=document.querySelector('.reel-meter i');
  const state=document.querySelector('.reel-state');
  let dur=0, ready=false, lastSeek=-1, pending=false;
  v.muted=true; v.pause(); v.preload='auto';
  const fast = typeof v.fastSeek==='function';   // Safari/FF: cheap keyframe seeks
  function ok(){ if(v.duration && isFinite(v.duration)){ dur=v.duration; ready=true; try{v.currentTime=0.001;}catch(e){} } }
  v.addEventListener('loadedmetadata',ok);
  v.addEventListener('loadeddata',ok);
  if(v.readyState>=1) ok();

  function prog(){ const r=track.getBoundingClientRect(); const tot=r.height-window.innerHeight; return tot>0?cl(-r.top/tot,0,1):0; }
  // Event-driven + throttled: only seek when the target moved meaningfully,
  // and never while a previous seek is still in flight (kills the lag).
  function apply(){
    pending=false;
    if(!ready) return;
    const p=prog();
    const target=cl(p*dur, 0, dur-0.05);
    if(!v.seeking && Math.abs(target-lastSeek) > 0.05){
      lastSeek=target;
      if(fast) v.fastSeek(target); else { try{ v.currentTime=target; }catch(e){} }
    }
    if(meter) meter.style.width=(p*100).toFixed(1)+'%';
    if(state) state.textContent = p<0.02?'Assembled' : p>0.98?'Fully exploded' : 'Disassembling — '+Math.round(p*100)+'%';
  }
  function onScroll(){ if(!pending){ pending=true; requestAnimationFrame(apply); } }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', onScroll);
  const warm=setInterval(()=>{ if(ready){ apply(); clearInterval(warm); } }, 120);
  v.load();
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded',()=>{
  buildNav();buildFooter();cursor();reveals();counters();parallax();progress();filters();transitions();cineHero();reelScrub();
  requestAnimationFrame(()=>document.body.classList.add('loaded'));
});
