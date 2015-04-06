function addBackHandler() {
  var reference = null;
  document.body.addEventListener(
    'touchstart',
    function ontouchstart(e) {
      document.body.removeEventListener('touchstart', ontouchstart);
      if (e.touches.length > 1) {
        return;
      }
      reference =  e.touches[0].pageX;
      console.log('Acaba de empezar el toqueteo! ' + e.touches[0].pageX);
      document.body.addEventListener(
        'touchend',
        function ontouchend(e) {

          if (e.changedTouches.length > 1) {
            return;
          }
          var delta = e.changedTouches[0].pageX - reference;
          if (delta < 0) {
            document.body.removeEventListener('touchend', ontouchend);
            document.body.classList.remove('menu');
          }
        }
      );
    }
  );
}


// window.addEventListener('hashchange', function() {
//   var location = window.location.hash;
//   if (location !== '#menu') {
//     document.body.classList.remove('menu');
//   }
// });

window.onload = function() {
  document.getElementById('h-menu-button').addEventListener(
    'click',
    function() {
      document.body.classList.add('menu');
      // window.location.hash = '#menu';
      addBackHandler();
    }
  );

  document.getElementById('sp-button').addEventListener(
    'click',
    function() {
      document.body.classList.add('new');
    }
  );

  document.getElementById('m-options').addEventListener(
    'click',
    function() {
      document.body.classList.remove('menu');
    }
  );

  document.getElementById('m-options-settings').addEventListener(
    'click',
    function() {
      alert('Settings!');
    }
  );

  document.getElementById('m-options-pulse').addEventListener(
    'click',
    function() {
      alert('Pulse!');
    }
  );

  document.getElementById('m-options-exit').addEventListener(
    'click',
    function() {
      window.location = window.location.origin + '/logout'
    }
  );
}