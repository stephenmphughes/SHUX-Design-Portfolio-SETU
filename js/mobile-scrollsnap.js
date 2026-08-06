// mobile-scrollsnap.min.js — minimal, robust, no IO dependency
(function(){
  const viewport=document.querySelector('.ss-viewport');
  const slides=[...document.querySelectorAll('.ss-slide')];
  const dotsWrap=document.querySelector('.ss-dots');
  if(!viewport||!slides.length||!dotsWrap){return;}

  const svgPath='images/ScrollSnapCarousel/indicatorsnapscroll.svg';
  const ACTIVE='invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)';
  const INACTIVE='invert(76%) sepia(1%) saturate(0%) hue-rotate(346deg) brightness(94%) contrast(87%)';

  // Build dots using your SVG
  dotsWrap.innerHTML='';
  slides.forEach((_,i)=>{
    const b=document.createElement('button');
    b.type='button'; b.className='ss-dot'; b.setAttribute('aria-label',`Go to slide ${i+1}`);
    const img=document.createElement('img'); img.src=svgPath; img.alt='';
    img.style.filter=i===0?ACTIVE:INACTIVE;
    b.appendChild(img);
    b.addEventListener('click',()=>{
      const left=slides[i].offsetLeft - slides[0].offsetLeft; // robust: no width math
      viewport.scrollTo({left,behavior:'smooth'});
    });
    dotsWrap.appendChild(b);
  });
  const dots=[...dotsWrap.querySelectorAll('.ss-dot')];

  // Active state helpers
  function setActive(index){
    index=Math.max(0,Math.min(index,slides.length-1));
    dots.forEach((d,j)=>{
      const img=d.querySelector('img');
      if(j===index){ d.setAttribute('aria-current','true'); img.style.filter=ACTIVE; }
      else { d.removeAttribute('aria-current'); img.style.filter=INACTIVE; }
    });
    slides.forEach((s,j)=>{
      const was=s.classList.contains('is-active');
      const on=j===index;
      if(on&&!was){
        const pic=s.querySelector('img');
        s.classList.add('is-active');
        if(pic){
          pic.style.animation='none';
          void pic.offsetWidth; // restart
          pic.style.animation='ss-snap-in 0.45s ease-out both';
        }
      }else if(!on&&was){
        s.classList.remove('is-active');
        const pic=s.querySelector('img');
        if(pic) pic.style.animation='none';
      }
    });
  }
  function activeIndexFromScroll(){
    const center=viewport.scrollLeft + viewport.getBoundingClientRect().width/2;
    let best=0, bestDist=Infinity;
    slides.forEach((s,i)=>{
      const mid=s.offsetLeft + s.getBoundingClientRect().width/2;
      const dist=Math.abs(center - mid);
      if(dist<bestDist){ best=i; bestDist=dist; }
    });
    return best;
  }

  // Init
  setActive(0);

  // Update on scroll (throttled with rAF)
  let ticking=false;
  viewport.addEventListener('scroll',()=>{
    if(!ticking){
      requestAnimationFrame(()=>{ setActive(activeIndexFromScroll()); ticking=false; });
      ticking=true;
    }
  },{passive:true});

  // Resize: keep alignment robust
  let rt;
  window.addEventListener('resize',()=>{ clearTimeout(rt); rt=setTimeout(()=>setActive(activeIndexFromScroll()),80); });

  // Keyboard (optional; mobile-width only)
  window.addEventListener('keydown',(e)=>{
    if(window.innerWidth>=600) return;
    let i=activeIndexFromScroll();
    if(e.key==='ArrowRight'&&i<slides.length-1){
      smoothScrollTo(viewport, slides[i+1].offsetLeft - slides[0].offsetLeft, 1000);    }
    if(e.key==='ArrowLeft'&&i>0){
      smoothScrollTo(viewport, slides[i-1].offsetLeft - slides[0].offsetLeft, 1000);
    }
  });
})();
function smoothScrollTo(element, target, duration) {
  const start = element.scrollLeft;
  const change = target - start;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    element.scrollLeft = start + change * ease;
    if (progress < 1) requestAnimationFrame(animateScroll);
  }

  requestAnimationFrame(animateScroll);
}
