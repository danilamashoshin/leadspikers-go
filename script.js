// Ссылка на бота с меткой источника трафика.
// Без UTM: start=go (go.leadspikers.com) или start=landing (leadspikers.com/leadgen).
// С UTM: start=go__utm_source__utm_medium__utm_campaign__utm_content (латиница, цифры и «-», до 64 символов).
// Бот сохраняет метку при первом запуске, отчёт по источникам — команда /utm у админа.
(function () {
  var BOT = 'https://t.me/LS_education_bot';
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  var base = location.hostname.indexOf('go.') === 0 ? 'go' : 'landing';
  function clean(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20); }
  var q = new URLSearchParams(location.search), parts = KEYS.map(function (k) { return clean(q.get(k)); });
  // Метку из рекламы запоминаем на 30 дней: человек может вернуться на страницу без UTM.
  try {
    if (parts.some(Boolean)) localStorage.setItem('ls_utm', JSON.stringify({ p: parts, t: Date.now() }));
    else {
      var saved = JSON.parse(localStorage.getItem('ls_utm') || 'null');
      if (saved && Date.now() - saved.t < 30 * 864e5) parts = saved.p;
    }
  } catch (e) {}
  var start = parts.some(Boolean) ? [base].concat(parts).join('__').replace(/_+$/, '').slice(0, 64) : base;
  var url = BOT + '?start=' + start;
  var clickId = q.get('fbclid') || '';
  if (base === 'go' && /^[A-Za-z0-9_-]{8,512}$/.test(clickId)) {
    var target = new URL('https://learn.leadspikers.com/meta-telegram.php');
    target.searchParams.set('ref', start);
    target.searchParams.set('fbclid', clickId);
    url = target.href;
  }
  document.querySelectorAll('.js-telegram-link').forEach(function (link) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
})();
