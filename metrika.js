(function () {
  var counterId = 114655053;
  if (!window.ym) {
    window.ym = function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(script);
  }
  window.ym(counterId, 'init', { defer: location.pathname === '/telegram.html' });
})();
