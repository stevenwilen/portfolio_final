// Steven Wilen · QR listing cards
document.documentElement.classList.remove('js');

// One-time section entrances. 12px, 400ms, fired when 15% of the group is in
// view. Checked on scroll rather than via IntersectionObserver, which does not
// fire reliably inside a nested preview frame.
//
// The `js` class is what hides content, so it is only added once a real
// viewport height has been measured — if that never happens, the page stays
// fully visible rather than blank. A safety net reveals anything still queued
// after 1.5s, so no mistimed measurement can leave a section invisible.
var queue=[].slice.call(document.querySelectorAll('.rise'));
var armed=false;
function revealAll(){queue.forEach(function(el){el.classList.add('in')});queue.length=0}
function tick(){
  var vh=window.innerHeight;
  if(!vh){return}
  if(!armed){document.documentElement.classList.add('js');armed=true}
  for(var i=queue.length-1;i>=0;i--){
    var el=queue[i],r=el.getBoundingClientRect();
    var vis=Math.min(r.bottom,vh)-Math.max(r.top,0);
    if(r.top<vh*0.92&&(vis>r.height*0.15||vis>120)){el.classList.add('in');queue.splice(i,1)}
  }
}
window.addEventListener('scroll',tick,{passive:true});
window.addEventListener('resize',tick);
window.addEventListener('load',tick);
tick();requestAnimationFrame(tick);
setTimeout(tick,300);setTimeout(tick,900);
setTimeout(function(){if(!armed){document.documentElement.classList.add('js')}revealAll()},1500);

// FAQ disclosures. Work with animation disabled; the panel is a real [hidden].
document.querySelectorAll('.q button').forEach(function(btn){
  btn.addEventListener('click',function(){
    var panel=document.getElementById(btn.getAttribute('aria-controls'));
    var open=btn.getAttribute('aria-expanded')==='true';
    document.querySelectorAll('.q button').forEach(function(b){
      b.setAttribute('aria-expanded','false');
      document.getElementById(b.getAttribute('aria-controls')).hidden=true;
    });
    if(!open){btn.setAttribute('aria-expanded','true');panel.hidden=false}
  });
});
