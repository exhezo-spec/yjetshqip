document.getElementById('contactForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const button = this.querySelector('[type="submit"]');
  if (button.disabled) return;
  const feedback = document.getElementById('formFeedback');
  const original = button.textContent;
  button.disabled = true;
  button.textContent = 'Duke dërguar…';
  feedback.textContent = '';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(this.action, {
      method: 'POST', body: new FormData(this),
      headers: { Accept: 'application/json' }, signal: controller.signal
    });
    if (!response.ok) throw new Error('send-failed');
    this.hidden = true;
    const success = document.getElementById('successMsg');
    success.classList.add('visible');
    success.setAttribute('tabindex', '-1');
    success.focus();
  } catch (_) {
    feedback.textContent = 'Dërgimi nuk u konfirmua. Të dhënat mbeten këtu. Provo përsëri ose na shkruaj në exhezo@gmail.com.';
  } finally {
    clearTimeout(timer);
    button.disabled = false;
    button.textContent = original;
  }
});
