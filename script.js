// Steven Wilen · QR listing cards
(function(){
var root=document.documentElement;
root.classList.remove('js');
var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header hairline once the page has moved.
var nav=document.querySelector('.nav');
function onNav(){nav.classList.toggle('scrolled',window.scrollY>8)}

// Entrances. Single photos carry .rise; groups carry [data-stagger] and their
// children follow one another, each given --i. Checked on scroll rather than
// via IntersectionObserver, which does not fire reliably inside a nested
// preview frame.
//
// The `js` class is what hides content, so it is only added once a real
// viewport height has been measured, and never with reduced motion. Anything
// already scrolled past counts as seen. Once an entrance has played,
// its hidden state is taken off the element so only resting styles remain.
var queue=[].slice.call(document.querySelectorAll('.rise,[data-stagger]'));
queue.forEach(function(el){
  if(!el.hasAttribute('data-stagger'))return;
  [].forEach.call(el.children,function(c,i){c.style.setProperty('--i',i)});
});
function settle(el){
  var n=el.hasAttribute('data-stagger')?el.children.length:1;
  setTimeout(function(){
    el.classList.remove('rise','on');el.removeAttribute('data-stagger');
  },1700+n*110);
}
function show(el){el.classList.add('on');settle(el)}
var armed=false;
function revealAll(){queue.forEach(show);queue.length=0}
function tick(){
  var vh=window.innerHeight;
  if(!vh)return;
  if(!armed){root.classList.add('js');armed=true;void root.offsetWidth}
  for(var i=queue.length-1;i>=0;i--){
    var el=queue[i],r=el.getBoundingClientRect();
    var vis=Math.min(r.bottom,vh)-Math.max(r.top,0);
    if(r.bottom<0||(r.top<vh*0.9&&(vis>r.height*0.15||vis>120))){show(el);queue.splice(i,1)}
  }
}

// Depth. Photos marked data-depth drift against the scroll by a fraction of
// their distance from the middle of the screen, capped so nothing travels far.
var layers=[].slice.call(document.querySelectorAll('[data-depth]'));
var small=window.matchMedia('(max-width:860px)');
function depth(){
  var vh=window.innerHeight,f=small.matches?.55:1;
  layers.forEach(function(img){
    var box=img.parentNode.getBoundingClientRect();
    if(box.bottom<-200||box.top>vh+200)return;
    var d=box.top+box.height/2-vh/2;
    var y=Math.max(-36,Math.min(36,-d*parseFloat(img.getAttribute('data-depth'))*f));
    img.style.translate='0 '+y.toFixed(1)+'px';
  });
}

// Tilt. On a mouse, the hero cards lean a couple of degrees toward the pointer.
var hero=document.querySelector('.hero'),tilt=document.querySelector('.tilt');
if(!still&&hero&&tilt&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  hero.addEventListener('pointermove',function(e){
    var r=tilt.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    tilt.style.transform='perspective(1400px) rotateX('+(-y*4).toFixed(2)+'deg) rotateY('+(x*5).toFixed(2)+'deg)';
  });
  hero.addEventListener('pointerleave',function(){tilt.style.transform=''});
}

// Reveals and the header run straight off the event; depth is batched per frame.
var busy=false;
function frame(){busy=false;depth()}
function schedule(){onNav();if(still)return;tick();if(!busy){busy=true;requestAnimationFrame(frame)}}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule);
window.addEventListener('load',schedule);
onNav();
if(still){return}
tick();requestAnimationFrame(tick);depth();
setTimeout(tick,300);setTimeout(tick,900);
setTimeout(function(){if(!armed)revealAll()},1500);
})();
