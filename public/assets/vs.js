/* ==========================================================================
   FFG VENTURE STUDIO: shared script (multi-page micro-site)
   Every module is guarded so it no-ops on pages that lack its section.
   ========================================================================== */
(function(){
  /* ---- studio tabs (single source of truth for mobile menu + active state) ---- */
  var TABS=[
    {href:'index.html',    label:'Overview'},
    {href:'about.html',    label:'About the Studio', sub:true},
    {href:'vision.html',   label:'The Vision',       sub:true},
    {href:'model.html',    label:'The Model',        sub:true},
    {href:'platform.html', label:'The Platform',     sub:true},
    {href:'faq.html',      label:'FAQ',              sub:true},
    {href:'portfolio.html',label:'Portfolio'},
    {href:'team.html',     label:'Team'},
    {href:'library.html',  label:'Library'},
    {href:'careers.html',  label:'Careers'},
    {href:'founders.html', label:'For Founders'}
  ];
  function currentFile(){
    var p=location.pathname.split('/').pop();
    if(!p||p==='')p='index.html';
    return p.toLowerCase();
  }
  var here=currentFile();

  /* ---- active state on the desktop nav (match by filename) ---- */
  document.querySelectorAll('.nav-links a[href]').forEach(function(a){
    var f=(a.getAttribute('href')||'').split('/').pop().toLowerCase();
    if(f===here) a.classList.add('active');
  });


  /* accordion on the ported pages (one open at a time within a group) */
  document.querySelectorAll('.acc-q').forEach(function(q){
    q.addEventListener('click',function(){
      var item=q.closest('.acc-item'); if(!item) return;
      var wasOpen=item.classList.contains('open');
      var group=item.closest('.acc');
      if(group) group.querySelectorAll('.acc-item.open').forEach(function(o){o.classList.remove('open');});
      if(!wasOpen) item.classList.add('open');
    });
  });


  /* team card biographies */
  document.querySelectorAll('.tm-toggle').forEach(function(b){
    b.addEventListener('click',function(){
      var c=b.closest('.tm-card'); if(c) c.classList.toggle('open');
    });
  });

  /* hero video */
  var v=document.querySelector('.hero-bg-video');
  if(v){v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){});}

  /* nav scrolled state */
  var nav=document.getElementById('nav');
  window.addEventListener('scroll',function(){nav&&nav.classList.toggle('scrolled',window.scrollY>10)},{passive:true});

  /* thesis ghost starburst: slow parallax rotate */
  var ghost=document.getElementById('thesisGhost');
  if(ghost){
    window.addEventListener('scroll',function(){
      ghost.style.transform='translateY(-58%) rotate('+(window.scrollY*0.02)+'deg)';
    },{passive:true});
  }

  /* 3D logo: build a solid extrusion from stacked layers */
  var s3=document.getElementById('star3d');
  if(s3){
    var front=s3.querySelector('img');
    var LAYERS=48, DEPTH=44;
    for(var li=1;li<LAYERS;li++){
      var t=li/(LAYERS-1);
      var c=front.cloneNode();
      c.style.transform='translateZ('+(-DEPTH*t).toFixed(2)+'px)';
      c.style.filter='brightness(0) invert(1) brightness('+(0.92-0.5*t).toFixed(3)+')';
      s3.appendChild(c);
    }
    front.style.transform='translateZ(0)';
    front.style.filter='brightness(0) invert(1)';
  }

  /* grantbook-style scroll color morph: geometry-based, bidirectional-safe.
     Body only ever holds light tints; dark sections are opaque and cover it. */
  var tinted=[].slice.call(document.querySelectorAll('section[data-bg]'));
  if(tinted.length){
    var updateBg=function(){
      var mid=window.innerHeight*0.5;
      for(var ti=0;ti<tinted.length;ti++){
        var r=tinted[ti].getBoundingClientRect();
        if(r.top<=mid&&r.bottom>=mid){
          document.body.style.backgroundColor=tinted[ti].getAttribute('data-bg');
          return;
        }
      }
    };
    window.addEventListener('scroll',updateBg,{passive:true});
    window.addEventListener('resize',updateBg);
    updateBg();
  }

  /* brand carousel: continuous drift you can nudge through with the arrows. */
  var car=document.getElementById('wcarousel');
  if(car){
    car.innerHTML += car.innerHTML;              /* duplicate cards for a seamless loop */
    var cards=car.querySelectorAll('.wcard');
    var half=cards.length/2;
    var loopPoint=0;
    var measure=function(){ loopPoint = cards[half].offsetLeft - cards[0].offsetLeft; };
    measure(); window.addEventListener('resize',measure);
    var cardStep=function(){ return cards[0].getBoundingClientRect().width + 22; };
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var SPEED=0.6;                               /* px/frame ≈ the old marquee pace */
    var pos=0, nudge=0, hover=false, dragging=false;
    var wrap=function(){ if(loopPoint>0){ while(pos>=loopPoint)pos-=loopPoint; while(pos<0)pos+=loopPoint; } };
    var np=document.getElementById('wNext'),pp=document.getElementById('wPrev');
    if(np)np.addEventListener('click',function(){ nudge += cardStep(); });
    if(pp)pp.addEventListener('click',function(){ nudge -= cardStep(); });
    var strip=document.querySelector('.wstrip');
    if(strip){
      strip.addEventListener('pointerenter',function(){ hover=true; });
      strip.addEventListener('pointerleave',function(){ hover=false; });
    }
    car.addEventListener('pointerdown',function(){ dragging=true; });
    window.addEventListener('pointerup',function(){ if(dragging){ dragging=false; pos=car.scrollLeft; wrap(); } });
    car.addEventListener('scroll',function(){ if(dragging) pos=car.scrollLeft; });
    (function frame(){
      if(!dragging&&!document.body.classList.contains('ffg-editing')){
        var move=0;
        if(!hover && !reduce) move += SPEED;
        if(nudge!==0){ var d=nudge*0.14; if(Math.abs(d)<0.5) d=nudge; move+=d; nudge-=d; }
        if(move!==0){ pos+=move; wrap(); car.scrollLeft=pos; }
      }
      requestAnimationFrame(frame);
    })();
  }

  /* scroll reveal */
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;
      e.target.classList.add('visible');
      io.unobserve(e.target);
    });
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  var revealEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  revealEls.forEach(function(el){io.observe(el)});
  /* IntersectionObserver callbacks ride the rendering lifecycle, so in a preview
     iframe or a background tab they can be late or never arrive. Reveal whatever
     is already on screen on the next frame rather than waiting on the observer. */
  function vh(){return window.innerHeight||document.documentElement.clientHeight}
  function paintOnscreen(){
    var n=0;
    revealEls.forEach(function(el){
      if(el.classList.contains('visible'))return;
      var r=el.getBoundingClientRect();
      if(r.top<vh()&&r.bottom>0){el.classList.add('visible');io.unobserve(el);n++}
    });
    return n;
  }
  requestAnimationFrame(paintOnscreen);

  /* stat counters */
  var statrow=document.getElementById('statrow');
  if(statrow){
    var done=false;
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting||done)return;
        done=true;
        statrow.querySelectorAll('.counter').forEach(function(el){
          var t=parseInt(el.getAttribute('data-target'),10)||0,start=null;
          function step(ts){if(!start)start=ts;var k=Math.min((ts-start)/1200,1);el.textContent=Math.round(t*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)}
          requestAnimationFrame(step);
        });
        cio.disconnect();
      });
    },{threshold:0.3});
    cio.observe(statrow);
  }

  /* fallback: never let copy sit invisible waiting on an observer that may not fire */
  setTimeout(function(){
    paintOnscreen();
    if(document.querySelectorAll('.reveal.visible,.reveal-left.visible,.reveal-right.visible').length===0){
      revealEls.forEach(function(el){el.classList.add('visible')});
      document.querySelectorAll('.counter').forEach(function(el){el.textContent=el.getAttribute('data-target')||'0'});
    }
  },400);

  /* quote switcher */
  var qtabs=document.querySelectorAll('.qtab'),qtexts=document.querySelectorAll('.qtext');
  qtabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      var q=tab.getAttribute('data-q');
      qtabs.forEach(function(t){t.classList.toggle('active',t===tab)});
      qtexts.forEach(function(x){x.classList.toggle('active',x.getAttribute('data-q')===q)});
    });
  });

  /* FAQ accordion */
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.closest('.faq-item');
      if(item)item.classList.toggle('open');
    });
  });

  /* mobile menu: built from the studio tabs, active item flagged */
  var toggle=document.querySelector('.mobile-toggle');
  if(toggle&&nav){
    var menu=document.createElement('div');
    menu.className='mobile-menu';
    var html='';
    TABS.forEach(function(t){
      var f=t.href.split('/').pop().toLowerCase();
      var cls=(t.sub?'mm-sub ':'')+(f===here?'active':'');
      html+='<a class="'+cls+'" href="'+t.href+'">'+t.label+'</a>';
    });
    html+='<a class="nav-cta" href="founders.html">Become a Venture Lead</a>';
    menu.innerHTML=html;
    nav.appendChild(menu);
    toggle.addEventListener('click',function(){
      var open=menu.classList.toggle('open');
      toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
    });
    menu.addEventListener('click',function(e){if(e.target.tagName==='A')menu.classList.remove('open')});
  }
})();
