document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const cookieBanner = document.querySelector('[data-cookie-banner]');
  const acceptButton = document.querySelector('[data-cookie-accept]');
  const declineButton = document.querySelector('[data-cookie-decline]');
  const consentKey = 'threpair_cookie_choice';

  const hideBanner = () => {
    if (cookieBanner) cookieBanner.hidden = true;
  };

  const showBanner = () => {
    if (cookieBanner) cookieBanner.hidden = false;
  };

  const saveConsent = (value) => {
    localStorage.setItem(consentKey, value);
    hideBanner();
  };

  if (cookieBanner) {
    const storedConsent = localStorage.getItem(consentKey);
    if (!storedConsent) {
      showBanner();
    } else {
      hideBanner();
    }
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => saveConsent('accepted'));
  }

  if (declineButton) {
    declineButton.addEventListener('click', () => saveConsent('declined'));
  }

  const yearElement = document.querySelector('[data-year]');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
