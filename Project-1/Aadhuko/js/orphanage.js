const form = document.querySelector('#orphanage-form');
const steps = [...document.querySelectorAll('.wizard-step')];
const progress = [...document.querySelectorAll('.progress-step')];
let currentStep = 0;

function showStep(index) {
  currentStep = index;
  steps.forEach((step, i) => { step.classList.toggle('active', i === index); step.hidden = i !== index; });
  progress.forEach((item, i) => {
    item.classList.toggle('active', i === index);
    item.classList.toggle('complete', i < index);
    if (i === index) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
  });
  document.querySelector('.progress-steps').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function validateStep(index) {
  let valid = true;
  const active = steps[index];
  active.querySelectorAll('.field-error').forEach((error) => error.textContent = '');
  active.querySelectorAll('[required]').forEach((field) => {
    if (!field.checkValidity()) {
      valid = false;
      const target = field.closest('.field')?.querySelector('.field-error') || active.querySelector('.consent-error');
      if (target) target.textContent = field.validity.valueMissing ? 'This field is required.' : field.validationMessage;
      field.setAttribute('aria-invalid', 'true');
    } else field.removeAttribute('aria-invalid');
  });
  if (!valid) active.querySelector('[aria-invalid="true"]')?.focus();
  return valid;
}

document.querySelectorAll('.wizard-next').forEach((button) => button.addEventListener('click', () => {
  if (validateStep(currentStep)) showStep(Math.min(currentStep + 1, steps.length - 1));
}));
document.querySelectorAll('.wizard-back').forEach((button) => button.addEventListener('click', () => showStep(Math.max(currentStep - 1, 0))));

const galleryInput = document.querySelector('#org-images');
const gallery = document.querySelector('#image-previews');
galleryInput.addEventListener('change', () => {
  gallery.replaceChildren();
  const files = [...galleryInput.files];
  if (files.length > 8) {
    galleryInput.setCustomValidity('Select no more than 8 images.');
    galleryInput.reportValidity();
    galleryInput.value = '';
    return;
  }
  galleryInput.setCustomValidity('');
  files.filter((file) => file.type.startsWith('image/')).forEach((file) => {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = URL.createObjectURL(file); image.alt = `Preview of ${file.name}`;
    const caption = document.createElement('figcaption'); caption.textContent = file.name;
    figure.append(image, caption); gallery.append(figure);
  });
});

document.querySelector('#cert-file').addEventListener('change', (event) => {
  document.querySelector('#cert-file-name').textContent = event.target.files[0]?.name || 'PDF or image. Preview/name only; no upload.';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateStep(currentStep) || !form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form).entries());
  delete data.certificate; delete data.images;
  data.certificateName = document.querySelector('#cert-file').files[0]?.name || '';
  data.imageNames = [...galleryInput.files].map((file) => file.name);
  data.verificationStatus = 'Not verified';
  try { localStorage.setItem('aadhuko-demo-orphanage', JSON.stringify(data)); } catch { /* Private browsing may block storage. */ }
  form.hidden = true;
  document.querySelector('#orphanage-success').hidden = false;
  document.querySelector('#orphanage-success').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

showStep(0);
