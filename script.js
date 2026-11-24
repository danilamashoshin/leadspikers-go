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
  var destination = BOT + '?start=' + start;
  var clickId = q.get('fbclid') || '';
  var hasMetaClickId = /^[A-Za-z0-9_-]{8,512}$/.test(clickId);
  var isPaidMeta = base === 'go' && (hasMetaClickId ||
    (['facebook', 'instagram', 'meta'].includes(parts[0]) && parts[1] === 'paid-social'));
  var pixelId = '1692950309097743';

  var yclid = q.get('yclid') || '';
  if (base === 'go' && /^[0-9]{1,32}$/.test(yclid)) {
    var yandexBridge = new URL('telegram.html', location.href);
    yandexBridge.searchParams.set('source', 'yandex');
    yandexBridge.searchParams.set('ref', start);
    yandexBridge.searchParams.set('yclid', yclid);
    destination = yandexBridge.href;
  } else if (isPaidMeta) {
    var bridge = new URL('telegram.html', location.href);
    bridge.searchParams.set('ref', start);
    if (hasMetaClickId) bridge.searchParams.set('fbclid', clickId);
    destination = bridge.href;

    if (!window.fbq) {
      var pixel = function () {
        if (pixel.callMethod) pixel.callMethod.apply(pixel, arguments);
        else pixel.queue.push(arguments);
      };
      window.fbq = pixel;
      window._fbq = window._fbq || pixel;
      pixel.push = pixel;
      pixel.loaded = true;
      pixel.version = '2.0';
      pixel.queue = [];
      var loader = document.createElement('script');
      loader.async = true;
      loader.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(loader);
    }
    window.fbq('set', 'autoConfig', false, pixelId);
    window.fbq('init', pixelId);
  }

  var clickReported = false;
  document.querySelectorAll('.js-telegram-link').forEach(function (link) {
    link.href = destination;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (!isPaidMeta || !window.fbq) return;

    function reportClick(event) {
      if (!event.isTrusted || event.defaultPrevented || clickReported) return;
      clickReported = true;
      window.fbq('trackSingleCustom', pixelId, 'TelegramClick', {
        cta: link.dataset.telegramCta
      });
    }
    link.addEventListener('click', reportClick);
    link.addEventListener('auxclick', function (event) {
      if (event.button === 1) reportClick(event);
    });
  });
})();
