// Replace this value with the final Telegram bot deep link before launch.
const TELEGRAM_BOT_URL = 'https://t.me/LS_education_bot?start=landing';

document.querySelectorAll('.js-telegram-link').forEach((link) => {
  if (TELEGRAM_BOT_URL) {
    link.href = TELEGRAM_BOT_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector('#program')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
