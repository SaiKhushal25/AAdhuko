const dialog = document.querySelector('.donate-dialog');
const causeSelect = document.querySelector('#gift-cause');
const sessionKey = 'aadhuko-demo-session';

function getSession() {
  try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; }
}

const loginLink = document.querySelector('.login-link');
const activeSession = getSession();
if (loginLink && activeSession?.loggedIn) {
  loginLink.textContent = 'Log out';
  loginLink.href = '#logout';
  loginLink.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem(sessionKey);
    window.location.reload();
  });
} else if (loginLink) {
  loginLink.href = `login.html?next=${encodeURIComponent('index.html')}`;
}

document.querySelectorAll('.donate-open').forEach((button) => {
  button.addEventListener('click', () => {
    if (!getSession()?.loggedIn) {
      const params = new URLSearchParams({ next: 'index.html' });
      params.set('cause', button.dataset.cause || causeSelect.options[0].textContent);
      window.location.href = `login.html?${params.toString()}`;
      return;
    }
    const cause = button.dataset.cause;
    if (cause) causeSelect.value = cause;
    document.querySelector('.form-message').textContent = '';
    dialog.showModal();
  });
});

// Reopen a donation the visitor selected before going to the login page.
const pendingCause = new URLSearchParams(window.location.search).get('donate');
if (pendingCause && getSession()?.loggedIn && dialog) {
  if ([...causeSelect.options].some((option) => option.value === pendingCause || option.textContent === pendingCause)) {
    causeSelect.value = pendingCause;
  }
  dialog.showModal();
  history.replaceState(null, '', window.location.pathname + window.location.hash);
}

document.querySelectorAll('.amount').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.amount').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    document.querySelector('#gift-custom').value = '';
  });
});

document.querySelector('#gift-custom').addEventListener('input', () => {
  document.querySelectorAll('.amount').forEach((button) => button.classList.remove('active'));
});

document.querySelector('#gift-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.querySelector('.form-message');
  message.textContent = 'Thanks for caring! Donation checkout is not connected in this project demo.';
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
