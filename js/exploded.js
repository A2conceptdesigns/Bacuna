/* ============================================================
   BACUÑA — Scroll-scrubbed exploded HOUSE
   The house assembles into a real building and DISASSEMBLES
   vertically as the user scrolls (reassembles on scroll up).
   ============================================================ */
(function(){
  const mount=document.getElementById('explodeScroll');
  if(!mount) return;
  const NS='http://www.w3.org/2000/svg';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  /* iso projection */
  const E=[48,24], Nx=[-48,24];
  const ZH=48, Ox=300, Oy=560;
  const W=3.0, D=2.3;
  const gap=1.35;
  const P=(u,v,z)=>[ Ox+u*E[0]+v*Nx[0], Oy+u*E[1]+v*Nx[1]-z*ZH ];
  const dyOf=r=>-(r*gap*ZH);

  const svg=document.createElementNS(NS,'svg');
  svg.setAttribute('viewBox','0 0 720 880');
  svg.setAttribute('role','img');
  svg.setAttribute('aria-label','Interactive exploded view of a house — scroll to disassemble');
  mount.appendChild(svg);

  const el=(n,a)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e;};
  const fmt=p=>p[0].toFixed(1)+','+p[1].toFixed(1);
  const poly=(pts,a)=>el('polygon',Object.assign({points:pts.map(fmt).join(' ')},a));

  const defs=el('defs');
  defs.innerHTML=`<filter id="ch" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#171310" flood-opacity="0.28"/></filter>
    <filter id="pl" x="-25%" y="-25%" width="150%" height="170%">
    <feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="#171310" flood-opacity="0.18"/></filter>`;
  svg.appendChild(defs);

  const url=id=>`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=520&h=420`;

  function face(g,c,img,shade,op,glass){
    const A=c[0],B=c[1],Dd=c[3];
    const eU=[B[0]-A[0],B[1]-A[1]], eV=[Dd[0]-A[0],Dd[1]-A[1]];
    const m=`matrix(${eU[0].toFixed(3)},${eU[1].toFixed(3)},${eV[0].toFixed(3)},${eV[1].toFixed(3)},${A[0].toFixed(2)},${A[1].toFixed(2)})`;
    g.appendChild(el('image',{href:img,'xlink:href':img,width:1,height:1,preserveAspectRatio:'none',transform:m,opacity:glass?0.62:1}));
    if(glass) g.appendChild(poly(c,{fill:'#6fa5c4',opacity:.34}));
    if(op)    g.appendChild(poly(c,{fill:shade,opacity:op}));
    g.appendChild(poly(c,{fill:'none',stroke:'#171310','stroke-width':0.7,'stroke-linejoin':'round'}));
  }
  function box(g,u0,u1,v0,v1,z0,z1,img,glass){
    face(g,[P(u0,v1,z0),P(u1,v1,z0),P(u1,v1,z1),P(u0,v1,z1)],img,'#000',0.14,glass);
    face(g,[P(u1,v0,z0),P(u1,v1,z0),P(u1,v1,z1),P(u1,v0,z1)],img,'#000',0.30,glass);
    face(g,[P(u0,v0,z1),P(u1,v0,z1),P(u1,v1,z1),P(u0,v1,z1)],img,'#fff',0.08,glass);
  }

  const CO={foundation:216668,structure:2455119,floors:168447,glass:28733236,facade:15440281,insulation:4482829,cladding:954655,roof:11557060};
  Object.values(CO).forEach(id=>{const im=new Image();im.src=url(id);});

  const S0=0.9, S1=2.1, R0=2.1, RA=3.3;
  const comps=[]; const layerEls=[]; const dys=[];

  function add(rank,name,spec,id,drawer,anchor){
    const g=el('g',{class:'deck-layer'});
    g.setAttribute('filter','url(#pl)');
    drawer(g); svg.appendChild(g);
    layerEls[rank]=g; dys[rank]=dyOf(rank);
    comps.push({rank,name,spec,id,anchor});
  }

  add(0,'Foundation','Reinforced concrete raft',CO.foundation,g=>{
    box(g,-0.15,W+0.15,-0.15,D+0.15,0,0.5,url(CO.foundation));
  },[W+0.15,D/2,0.5]);
  add(1,'Structure','Cast-concrete frame',CO.structure,g=>{
    const a=0.12,w=0.22,img=url(CO.structure);
    [[a,a],[W-a-w,a],[a,D-a-w],[W-a-w,D-a-w]].forEach(([pu,pv])=>box(g,pu,pu+w,pv,pv+w,0.5,S1,img));
    box(g,a,W-a,D-a-w,D-a,S1-0.18,S1,img);
    box(g,W-a-w,W-a,a,D-a,S1-0.18,S1,img);
  },[W-0.12,D/2,S1]);
  add(2,'Floors','Engineered oak',CO.floors,g=>{
    box(g,0.1,W-0.1,0.1,D-0.1,0.5,0.85,url(CO.floors));
  },[W-0.1,D/2,0.85]);
  add(3,'Glass','Insulated glazing',CO.glass,g=>{
    box(g,0,W,0,D,S0,S1,url(CO.glass),true);
  },[W,D/2,S1]);
  add(4,'Facade','Composite panel',CO.facade,g=>{
    box(g,0,W,0,D,S0,S1,url(CO.facade));
  },[W,D/2,S1]);
  add(5,'Insulation','Mineral wool',CO.insulation,g=>{
    box(g,0,W,0,D,S0,S1,url(CO.insulation));
  },[W,D/2,S1]);
  add(6,'Cladding','Charred timber',CO.cladding,g=>{
    box(g,0,W,0,D,S0,S1,url(CO.cladding));
  },[W,D/2,S1]);
  add(7,'Roof','Standing-seam zinc',CO.roof,g=>{
    const r=0.2,u0=-r,u1=W+r,v0=-r,v1=D+r,mid=W/2,img=url(CO.roof);
    const R_0=P(mid,v0,RA),R_1=P(mid,v1,RA);
    const E00=P(u0,v0,R0),E10=P(u1,v0,R0),E11=P(u1,v1,R0),E01=P(u0,v1,R0);
    g.appendChild(poly([E01,E11,R_1],{fill:'#2a2320'}));
    face(g,[E00,R_0,R_1,E01],img,'#fff',0.06);
    face(g,[R_0,E10,E11,R_1],img,'#000',0.24);
    g.appendChild(el('line',{x1:R_0[0],y1:R_0[1],x2:R_1[0],y2:R_1[1],stroke:'#171310','stroke-width':1.1}));
  },[W+0.2,D/2,(R0+RA)/2]);

  /* ---- annotations (aligned to exploded positions) ---- */
  const annot=el('g',{class:'annot'});
  const cx=Ox+(W/2)*E[0]+(D/2)*Nx[0], cyBase=Oy+(W/2)*E[1]+(D/2)*Nx[1];
  annot.appendChild(el('line',{x1:cx,y1:cyBase+dyOf(0),x2:cx,y2:cyBase-RA*ZH+dyOf(7),
    stroke:'#B4552E','stroke-width':1.1,'stroke-dasharray':'2 6',opacity:.55}));
  const lx=500, topY=120, step=82;
  comps.forEach(c=>{
    const ap=P(c.anchor[0],c.anchor[1],c.anchor[2]); ap[1]+=dyOf(c.rank);
    const ly=topY+(7-c.rank)*step;
    const grp=el('g',{});
    grp.appendChild(el('path',{d:`M ${ap[0].toFixed(1)} ${ap[1].toFixed(1)} L ${lx-40} ${ly} L ${lx-8} ${ly}`,fill:'none',stroke:'#171310','stroke-width':1}));
    grp.appendChild(el('circle',{cx:ap[0],cy:ap[1],r:2.6,fill:'#B4552E'}));
    const cs=46,px=lx+4,py=ly-cs/2,cid='cc'+c.rank;
    defs.appendChild(el('clipPath',{id:cid})).appendChild(el('rect',{x:px,y:py,width:cs,height:cs,rx:8}));
    grp.appendChild(el('image',{href:url(c.id),'xlink:href':url(c.id),x:px,y:py,width:cs,height:cs,preserveAspectRatio:'xMidYMid slice','clip-path':`url(#${cid})`,filter:'url(#ch)'}));
    grp.appendChild(el('rect',{x:px,y:py,width:cs,height:cs,rx:8,fill:'none',stroke:'#fff','stroke-width':1.5}));
    const num=el('text',{x:lx+62,y:ly-4,'font-family':'Space Mono, monospace','font-size':11,fill:'#B4552E','letter-spacing':'.12em'});
    num.textContent=String(c.rank+1).padStart(2,'0'); grp.appendChild(num);
    const nm=el('text',{x:lx+84,y:ly-2,'font-family':'Fraunces, serif','font-size':18,fill:'#171310'});
    nm.textContent=c.name; grp.appendChild(nm);
    const sp=el('text',{x:lx+84,y:ly+14,'font-family':'Space Mono, monospace','font-size':10,fill:'#6E645A','letter-spacing':'.03em'});
    sp.textContent=c.spec; grp.appendChild(sp);
    annot.appendChild(grp);
  });
  svg.appendChild(annot);

  /* ---------- scroll scrubbing ---------- */
  const track=mount.closest('.anatomy-track');
  const fill=document.querySelector('.am-fill');
  const state=document.querySelector('.anatomy-state');
  const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  let raf=null;
  function apply(){
    raf=null;
    let p=0;
    if(track){ const r=track.getBoundingClientRect(); const tot=r.height-window.innerHeight;
      p= tot>0 ? clamp(-r.top/tot,0,1) : 0; }
    const f=ease(p);
    for(let i=0;i<layerEls.length;i++){ layerEls[i].style.transform=`translateY(${(f*dys[i]).toFixed(1)}px)`; }
    annot.style.opacity=clamp((f-0.5)/0.35,0,1).toFixed(3);
    if(fill) fill.style.width=(p*100).toFixed(1)+'%';
    if(state) state.textContent = p<0.03?'Assembled' : p>0.97?'Fully exploded' : 'Disassembling — '+Math.round(p*100)+'%';
  }
  function onScroll(){ if(!raf) raf=requestAnimationFrame(apply); }
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll);
  apply();
})();
