
/*
 * Toggle display of element by ID
 */
function toggleDisplay(id) {
  var el = document.getElementById(id);
  if (el.style.display === '') el.style.display = 'none';
  
  if (el.style.display == 'block') {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
  }
}

window.addEventListener('resize', function (event) {
  var el;
  el = document.getElementById('site-menu-mobile');
  if (el) { el.style.display = ''; }
  
  el = document.getElementById('toc');
  if (el) { el.style.display = ''; }
});

// Attach FastClick to mobile menu buttons
FastClick.attach(document.getElementById('site-header'));
FastClick.attach(document.getElementById('toc-mobile-expand'));
