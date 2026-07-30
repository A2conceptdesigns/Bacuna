/* ============================================================
   BACUÑA — Isometric "built from the ground up" animation
   Draws an architectural house layer by layer and loops.
   ============================================================ */
(function(){
  const mount = document.getElementById('isoHouse');
  if(!mount) return;

  const NS='http://www.w3.org/2000/svg';
  const TW=44, TH=24, ZH=24, ox=262, oy=196;      // iso projection params
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  // palette
  const C={
    topA:'#ECE4D7', leftA:'#CBBCA4', rightA:'#B6A78E',   // walls
    topP:'#D9CDB8', leftP:'#B3A488', rightP:'#A1927A',   // plinth
    slab:'#F2ECE0', slabL:'#DBD0BE', slabR:'#CBBFA9',    // slabs
    post:'#2A2320', glass:'#B4552E', edge:'#1c1712',
    roofT:'#E4DCCF', roofL:'#C7B79E', roofR:'#B3A386'
  };

  // iso projection  (x = east, y = north/depth, z = height)
  const P=(x,y,z)=>[ (ox+(x-y)*TW).toFixed(1), (oy+(x+y)*TH - z*ZH).toFixed(1) ];

  const svg=document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox','0 0 520 500');
  svg.setAttribute('role','img');
  svg.setAttribute('aria-label','Architectural house under construction');
  mount.appendChild(svg);

  // soft ground shadow (always visible)
  const shadow=el('ellipse',{cx:280,cy:392,rx:186,ry:46,fill:'rgba(23,19,16,.10)'});
  svg.appendChild(shadow);

  function el(name,attrs){const e=document.createElementNS(NS,name);for(const k in attrs)e.setAttribute(k,attrs[k]);return e;}
  const pts=a=>a.map(p=>p.join(',')).join(' ');
  function quad(a,b,c,d,fill,o){return el('polygon',Object.assign({points:pts([a,b,c,d]),fill:fill,stroke:C.edge,'stroke-width':1.3,'stroke-linejoin':'round'},o||{}));}

  // faces
  const fRight=(g,x1,y0,y1,z0,z1,f,o)=>g.appendChild(quad(P(x1,y0,z0),P(x1,y1,z0),P(x1,y1,z1),P(x1,y0,z1),f,o));
  const fLeft =(g,x0,x1,y1,z0,z1,f,o)=>g.appendChild(quad(P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1),f,o));
  const fTop  =(g,x0,x1,y0,y1,z,f,o) =>g.appendChild(quad(P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z),f,o));

  function box(g,x0,x1,y0,y1,z0,z1,cL,cR,cT){
    fLeft(g,x0,x1,y1,z0,z1,cL); fRight(g,x1,y0,y1,z0,z1,cR); fTop(g,x0,x1,y0,y1,z1,cT);
  }
  // window helpers (glass panes on a face plane)
  const winR=(g,x1,ya,yb,za,zb)=>g.appendChild(quad(P(x1,ya,za),P(x1,yb,za),P(x1,yb,zb),P(x1,ya,zb),C.glass,{opacity:.20,'stroke-width':.9}));
  const winL=(g,y1,xa,xb,za,zb,f)=>g.appendChild(quad(P(xa,y1,za),P(xb,y1,za),P(xb,y1,zb),P(xa,y1,zb),f||C.glass,{opacity:f?1:.20,'stroke-width':.9}));

  function G(phase){const g=el('g',{opacity:0}); g.dataset.phase=phase; svg.appendChild(g); return g;}

  /* ---------- LAYERS (built in order) ---------- */
  const layers=[];

  // 1 · Site plot with grid
  (()=>{ const g=G('01 · Site &amp; foundation');
    box(g,-0.6,4.6,-0.6,3.8,-0.35,0,'#D8CBB5','#C7B99F','#E9E1D2');
    for(let i=-0.6;i<=4.61;i+=0.65){ g.appendChild(el('line',{x1:P(i,-0.6,0)[0],y1:P(i,-0.6,0)[1],x2:P(i,3.8,0)[0],y2:P(i,3.8,0)[1],stroke:'#B7A98D','stroke-width':.6,opacity:.5})); }
    for(let j=-0.6;j<=3.81;j+=0.65){ g.appendChild(el('line',{x1:P(-0.6,j,0)[0],y1:P(-0.6,j,0)[1],x2:P(4.6,j,0)[0],y2:P(4.6,j,0)[1],stroke:'#B7A98D','stroke-width':.6,opacity:.5})); }
    layers.push(g);
  })();

  // 2 · Foundation plinth
  (()=>{ const g=G('01 · Site &amp; foundation');
    box(g,0.1,3.9,0.1,3.1,0,0.5,C.leftP,C.rightP,C.topP);
    layers.push(g);
  })();

  // 3 · Structural frame (columns)
  (()=>{ const g=G('02 · Structural frame');
    const cols=[[0.25,0.25],[3.47,0.25],[0.25,2.67],[3.47,2.67],[1.86,0.25],[1.86,2.67]];
    cols.forEach(([cx,cy])=>box(g,cx,cx+0.28,cy,cy+0.28,0.5,3.9,C.post,'#1f1a16','#3a322c'));
    // beam ties across the top of the frame
    g.appendChild(el('line',{x1:P(0.39,0.39,3.9)[0],y1:P(0.39,0.39,3.9)[1],x2:P(3.61,0.39,3.9)[0],y2:P(3.61,0.39,3.9)[1],stroke:C.post,'stroke-width':2.5}));
    g.appendChild(el('line',{x1:P(3.61,0.39,3.9)[0],y1:P(3.61,0.39,3.9)[1],x2:P(3.61,2.81,3.9)[0],y2:P(3.61,2.81,3.9)[1],stroke:C.post,'stroke-width':2.5}));
    layers.push(g);
  })();

  // 4 · Ground-floor walls + glazing + door
  (()=>{ const g=G('02 · Structural frame');
    box(g,0.25,3.75,0.25,2.95,0.5,3.8,C.leftA,C.rightA,C.topA);
    winR(g,3.75,0.55,1.25,1.35,3.25); winR(g,3.75,1.55,2.35,1.35,3.25);
    winL(g,2.95,0.55,1.35,1.35,3.25);
    winL(g,2.95,2.65,3.35,0.5,2.75,C.post);   // front door
    layers.push(g);
  })();

  // 5 · Mid floor slab (overhangs)
  (()=>{ const g=G('03 · Floor &amp; envelope');
    box(g,0.05,3.95,0.05,3.15,3.8,4.12,C.slabL,C.slabR,C.slab);
    layers.push(g);
  })();

  // 6 · Upper storey walls + glazing
  (()=>{ const g=G('03 · Floor &amp; envelope');
    box(g,0.35,3.65,0.35,2.85,4.12,6.4,C.leftA,C.rightA,C.topA);
    winR(g,3.65,0.65,1.4,4.75,6.05); winR(g,3.65,1.7,2.45,4.75,6.05);
    winL(g,2.85,0.65,1.45,4.75,6.05); winL(g,2.85,1.75,2.55,4.75,6.05);
    layers.push(g);
  })();

  // 7 · Roof slab (deep overhang)
  (()=>{ const g=G('04 · Topping out');
    box(g,-0.05,4.05,-0.05,3.25,6.4,6.78,C.roofL,C.roofR,C.roofT);
    layers.push(g);
  })();

  // 8 · Details — rooftop volume, tree, dimension line
  (()=>{ const g=G('✓ Ready to build');
    // rooftop penthouse / stair box
    box(g,1.35,2.25,0.95,1.75,6.78,7.7,C.leftA,C.rightA,C.topA);
    // a slim tree beside the house
    const t=P(4.35,1.2,0);
    g.appendChild(el('line',{x1:t[0],y1:t[1],x2:t[0],y2:(+t[1]-46),stroke:'#5a4a3a','stroke-width':3}));
    g.appendChild(el('circle',{cx:t[0],cy:(+t[1]-56),r:22,fill:'#8a9b6a',opacity:.9,stroke:C.edge,'stroke-width':1}));
    // dimension line along the front-left base
    const a=P(0.25,2.95,0), b=P(3.75,2.95,0);
    const ay=+a[1]+20, by=+b[1]+20;
    g.appendChild(el('line',{x1:a[0],y1:ay,x2:b[0],y2:by,stroke:C.glass,'stroke-width':1}));
    g.appendChild(el('line',{x1:a[0],y1:ay-5,x2:a[0],y2:ay+5,stroke:C.glass,'stroke-width':1}));
    g.appendChild(el('line',{x1:b[0],y1:by-5,x2:b[0],y2:by+5,stroke:C.glass,'stroke-width':1}));
    const mx=(+a[0]+ +b[0])/2, my=(ay+by)/2;
    g.appendChild(el('text',{x:mx,y:my+16,fill:C.glass,'font-family':'Space Mono, monospace','font-size':12,'text-anchor':'middle',transform:`rotate(9 ${mx} ${my})`,'letter-spacing':'.08em'})).textContent='13.40 M';
    layers.push(g);
  })();

  /* ---------- Animation loop ---------- */
  const readout=document.getElementById('buildPhase');
  const setPhase=t=>{ if(readout) readout.innerHTML=t; };

  layers.forEach(l=>{ l.style.transformBox='fill-box'; });

  if(reduce){ layers.forEach(l=>l.style.opacity=1); setPhase('✓ Ready to build'); return; }

  const STEP=340, RISE='transform 1s cubic-bezier(.22,1,.36,1), opacity .7s ease';

  function reset(){
    layers.forEach(l=>{ l.style.transition='none'; l.style.transform='translateY(78px)'; l.style.opacity='0'; });
    svg.getBoundingClientRect(); // reflow
  }
  function play(){
    reset();
    layers.forEach((l,i)=>{
      setTimeout(()=>{
        l.style.transition=RISE;
        l.style.transform='translateY(0)';
        l.style.opacity='1';
        setPhase(l.dataset.phase);
      }, 260 + i*STEP);
    });
    const built = 260 + layers.length*STEP + 900;
    setTimeout(()=>{                       // hold, then dissolve and replay
      setTimeout(()=>{
        [...layers].reverse().forEach((l,i)=>setTimeout(()=>{
          l.style.transition='transform .55s ease, opacity .45s ease';
          l.style.opacity='0'; l.style.transform='translateY(26px)';
        }, i*70));
        setTimeout(play, layers.length*70 + 700);
      }, 2600);
    }, built);
  }

  // start when the hero is on screen
  const io=new IntersectionObserver((e,o)=>{ if(e[0].isIntersecting){ play(); o.disconnect(); } },{threshold:.2});
  io.observe(mount);
})();
