const SIGN_SLUGS = {dash:'dashi',dem:'demi',bin:'binjaket',gaf:'gaforrja',luan:'luani',vir:'virgjeresha',pel:'peshorja',akr:'akrepi',she:'shigjetari',bri:'bricjapi',uju:'ujori',pesh:'peshqit'};
let restoringSign = false;
let currentSign = null;
function storedSign() { try { return localStorage.getItem('ys_sign'); } catch (_) { return null; } }
function updateResultActions(key, period) {
  currentSign = key;
  const url = new URL('/horoskopi/' + SIGN_SLUGS[key] + '/', location.origin);
  if (period !== 'ditor') url.searchParams.set('period', period);
  // Keep a sign page's canonical identity when users choose another sign.
  const stateUrl = new URL(location.href);
  stateUrl.searchParams.set('sign', key);
  stateUrl.searchParams.set('period', period);
  history.replaceState(null, '', stateUrl);
  const actions = document.getElementById(period + 'Actions');
  const status = document.getElementById(period + 'Status');
  const remember = actions.querySelector('[data-remember]');
  const syncRemember = () => {
    remember.textContent = storedSign() === key ? 'Harro shenjën time' : 'Mbaje mend shenjën time';
    remember.setAttribute('aria-pressed', String(storedSign() === key));
  };
  syncRemember();
  status.textContent = period === 'ditor' ? 'Për datën ' + now.toLocaleDateString('sq-AL', {day:'numeric', month:'long', year:'numeric'}) : '';
  remember.onclick = () => {
    try {
      if (storedSign() === key) { localStorage.removeItem('ys_sign'); status.textContent = 'Shenja u hoq nga ky shfletues.'; }
      else { localStorage.setItem('ys_sign', key); status.textContent = 'Shenja u ruajt në këtë shfletues.'; }
      syncRemember();
    } catch (_) { status.textContent = 'Shfletuesi nuk lejon ruajtjen. Mund të ruash lidhjen e faqes.'; }
  };
  const shareText = 'Horoskopi ' + ({ditor:'ditor',mujor:'mujor',vjetor:'vjetor'})[period] + ' — ' + S[key].n + ' | Yjet Shqip';
  actions.querySelector('[data-whatsapp]').href = 'https://wa.me/?text=' + encodeURIComponent(shareText + '\n' + url.href);
  actions.querySelector('[data-copy]').onclick = async () => {
    try { await navigator.clipboard.writeText(url.href); status.textContent = 'Lidhja u kopjua.'; }
    catch (_) {
      status.textContent = 'Kopjo këtë lidhje: ';
      const input = document.createElement('input');
      input.value = url.href; input.readOnly = true; input.setAttribute('aria-label', 'Lidhja e horoskopit');
      input.style.cssText = 'width:100%;padding:10px;margin-top:8px';
      status.appendChild(input); input.focus(); input.select();
    }
  };
}
function restoreHoroscope() {
  const params = new URLSearchParams(location.search);
  const key = [document.body.dataset.sign, params.get('sign'), storedSign()].find(value => Object.hasOwn(SIGN_SLUGS, value));
  if (!key) return;
  const requested = params.get('period');
  const period = ['ditor','mujor','vjetor'].includes(requested) ? requested : 'ditor';
  const index = ['ditor','mujor','vjetor'].indexOf(period);
  const grid = ['gridDitor','gridMujor','gridVjetor'][index];
  restoringSign = true;
  showSection(period === 'ditor' ? 'horoskopi' : period, document.querySelectorAll('#subnav button')[index]);
  showHoroImpl(key, period, document.querySelector('#' + grid + ' [data-sign="' + key + '"]'));
  restoringSign = false;
}
document.querySelectorAll('#subnav button').forEach((button, index) => {
  button.addEventListener('click', () => {
    if (!currentSign) return;
    const period = ['ditor','mujor','vjetor'][index];
    const grid = ['gridDitor','gridMujor','gridVjetor'][index];
    restoringSign = true;
    showHoroImpl(currentSign, period, document.querySelector('#' + grid + ' [data-sign="' + currentSign + '"]'));
    restoringSign = false;
  });
});
restoreHoroscope();
window.addEventListener('popstate', restoreHoroscope);
