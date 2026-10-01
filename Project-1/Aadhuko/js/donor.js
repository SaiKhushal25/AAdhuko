const donorForm = document.querySelector('#donor-form');
const photoInput = document.querySelector('#donor-photo');
const photoPreview = document.querySelector('#donor-photo-preview');

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  photoPreview.replaceChildren();
  if (!file) { photoPreview.textContent = 'No photo selected'; return; }
  if (!file.type.startsWith('image/')) { photoPreview.textContent = 'Choose an image file'; photoInput.value = ''; return; }
  const image = document.createElement('img');
  image.src = URL.createObjectURL(file);
  image.alt = 'Selected profile picture preview';
  photoPreview.append(image);
  const name = document.createElement('span'); name.textContent = file.name; photoPreview.append(name);
});

donorForm.addEventListener('submit', (event) => {
  event.preventDefault();
  donorForm.querySelectorAll('.field-error').forEach((item) => item.textContent = '');
  const password = donorForm.elements.password;
  const confirm = donorForm.elements.confirm;
  const confirmError = donorForm.querySelector('[data-error="confirm"]');
  if (password.value !== confirm.value) confirmError.textContent = 'Passwords do not match.';
  if (!donorForm.reportValidity() || confirmError.textContent) {
    donorForm.querySelector(':invalid')?.focus();
    return;
  }
  const data = Object.fromEntries(new FormData(donorForm).entries());
  // Never retain passwords or file contents in localStorage.
  delete data.password; delete data.confirm; delete data.photo;
  data.photoName = photoInput.files[0]?.name || '';
  try { localStorage.setItem('aadhuko-demo-donor', JSON.stringify(data)); } catch { /* Private browsing may block storage. */ }
  document.querySelector('#donor-success').hidden = false;
  donorForm.hidden = true;
});
