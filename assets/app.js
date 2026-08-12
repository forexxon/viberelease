document.addEventListener('DOMContentLoaded', () => {
  const telegramUrl = 'https://t.me/mausharov';

  document.querySelectorAll('a[href="#start"]').forEach((link) => {
    link.setAttribute('href', telegramUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
    link.setAttribute('aria-label', 'Написать Vibe Release в Telegram');
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.setAttribute('tabindex', '-1');
    });
  });

  const badge = document.querySelector('.start-badge');
  const startState = document.querySelector('.start-state');

  if (badge) {
    badge.innerHTML = '<span class="dot dot-blue"></span>ЗАЯВКИ ОТКРЫТЫ';
  }

  if (startState) {
    const description = startState.querySelector('p');
    if (description) {
      description.textContent = 'Напиши в Telegram @mausharov. Сначала коротко посмотрим проект, согласуем объём и только после этого начинаем проверку.';
    }

    const oldButton = startState.querySelector('button');
    if (oldButton) {
      const link = document.createElement('a');
      link.className = 'button primary button-wide';
      link.href = telegramUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Написать в Telegram';
      link.setAttribute('aria-label', 'Написать Vibe Release в Telegram');
      oldButton.replaceWith(link);
    }
  }

  const footerNote = document.querySelector('.footer-note');
  if (footerNote) {
    const contact = document.createElement('div');
    contact.innerHTML = '<a href="https://t.me/mausharov" target="_blank" rel="noopener">Telegram: @mausharov</a>';
    footerNote.prepend(contact);
  }
});
