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

function schedule(){onNav()}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule);
window.addEventListener('load',schedule);
onNav();
if(still){return}
enter();
})();
