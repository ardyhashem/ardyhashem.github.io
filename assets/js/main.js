(function () {
  const container = document.querySelector('.prompt-rain');
  if (!container) return;

  const promptTextOptions = [
    'ardy@host:~#',
    '# >_',
    '>_',
    '$ >_',
  ];

  const PROMPT_COUNT = 8;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createPrompt() {
    const el = document.createElement('div');
    el.className = 'prompt-rain__item';

    el.textContent = promptTextOptions[Math.floor(Math.random() * promptTextOptions.length)];

    const startLeft = randomInRange(-10, 100);
    el.style.left = startLeft + 'vw';

    const duration = randomInRange(6, 14);
    const delay = randomInRange(-duration, 0);
    const fontSize = randomInRange(11, 18);

    el.style.fontSize = fontSize + 'px';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = delay + 's';

    container.appendChild(el);
  }

  for (let i = 0; i < PROMPT_COUNT; i++) {
    createPrompt();
  }
})();

// Hover-preview logic
(function () {
  const screenshots = window.PROFILE_SCREENSHOTS || [];

  const preview = document.getElementById("hover-preview");

  // Bold text → random screenshot
  document.querySelectorAll("strong, b").forEach(el => {
    el.addEventListener("mouseenter", () => {
      if (el.closest(".cert")) return;

      const random = screenshots[Math.floor(Math.random() * screenshots.length)];
      preview.innerHTML = `<img src="${random}" />`;
      preview.style.opacity = 1;

      const rect = el.getBoundingClientRect();
      preview.style.left = rect.right + 16 + "px";
      preview.style.top = rect.top + "px";
    });

    el.addEventListener("mouseleave", () => {
      if (!el.closest(".cert")) preview.style.opacity = 0;
    });
  });

  // Cert items → specific certificate image
  document.querySelectorAll(".cert").forEach(cert => {
    cert.addEventListener("mouseenter", () => {
      const img = cert.dataset.cert;
      preview.innerHTML = `<img src="${img}" />`;
      preview.style.opacity = 1;

      const rect = cert.getBoundingClientRect();
      preview.style.left = rect.right + 16 + "px";
      preview.style.top = rect.top + "px";
    });

    cert.addEventListener("mouseleave", () => {
      preview.style.opacity = 0;
    });
  });
})();
