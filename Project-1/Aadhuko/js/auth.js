// Login is a local demo session only; it does not authenticate with a server.
const loginForm = document.querySelector('#login-form');
loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const identity = loginForm.elements.identity;
  const password = loginForm.elements.password;
  const identityError = document.querySelector('[data-error="identity"]');
  const passwordError = document.querySelector('[data-error="password"]');
  identityError.textContent = identity.value.trim() ? '' : 'Enter your email or username.';
  passwordError.textContent = password.value.length >= 8 ? '' : 'Enter a password with at least 8 characters.';
  if (identityError.textContent || passwordError.textContent) return;
  try { localStorage.setItem('aadhuko-demo-session', JSON.stringify({ loggedIn: true, identity: identity.value.trim() })); } catch { /* Storage can be disabled in private browsing. */ }
  const params = new URLSearchParams(window.location.search);
  const next = params.get('next') || 'index.html';
  const allowedNext = /^(index\.html(?:\?.*)?(?:#.*)?|register-donor\.html|register-orphanage\.html)$/.test(next) ? next : 'index.html';
  if (params.has('cause')) {
    const destination = new URL(allowedNext, window.location.href);
    destination.searchParams.set('donate', params.get('cause'));
    window.location.href = destination.href;
  } else window.location.href = allowedNext;
});
