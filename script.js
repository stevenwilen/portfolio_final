// Steven Wilen · QR listing cards
(function(){
var root=document.documentElement;
root.classList.remove('js');
var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header hairline once the page has moved.
var nav=document.querySelector('.nav');
function onNav(){nav.classList.toggle('scrolled',window.scrollY>8)}

// Entrance. Only the hero has one, and it plays on load, not on scroll; the
// rest of the page is visible from the start. The photo carries .rise, the
// copy carries [data-stagger] and its children follow one another, each given
// --i. The `js` class is what hides the hero, so it is only added when motion
// is allowed; once the entrance has played its hidden state is removed so
// only resting styles remain.
var entering=[].slice.call(document.querySelectorAll('.rise,[data-stagger]'));
function enter(){
  entering.forEach(function(el){
    if(el.hasAttribute('data-stagger'))[].forEach.call(el.children,function(c,i){c.style.setProperty('--i',i)});
  });
  root.classList.add('js');void root.offsetWidth;
  entering.forEach(function(el){
    el.classList.add('on');
    var n=el.hasAttribute('data-stagger')?el.children.length:1;
    setTimeout(function(){el.classList.remove('rise','on');el.removeAttribute('data-stagger')},1700+n*110);
  });
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

// The header runs straight off the event; depth is batched per frame.
var busy=false;
function frame(){busy=false;depth()}
function schedule(){onNav();if(still)return;if(!busy){busy=true;requestAnimationFrame(frame)}}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule);
window.addEventListener('load',schedule);
onNav();
if(still){return}
enter();depth();
})();
