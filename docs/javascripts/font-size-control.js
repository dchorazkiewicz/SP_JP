(() => {
  const STORAGE_KEY = "sp-font-scale";
  const LEVELS = [
    { key: "small", scale: 0.88, label: "88%" },
    { key: "normal", scale: 1, label: "100%" },
    { key: "large", scale: 1.18, label: "118%" },
    { key: "xlarge", scale: 1.36, label: "136%" },
    { key: "xxlarge", scale: 1.54, label: "154%" }
  ];

  function getStoredLevel() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return LEVELS.some((level) => level.key === saved) ? saved : "normal";
    } catch (_) {
      return "normal";
    }
  }

  function storeLevel(level) {
    try {
      window.localStorage.setItem(STORAGE_KEY, level);
    } catch (_) {
      // Zmiana nadal działa w bieżącej sesji, nawet gdy pamięć przeglądarki jest zablokowana.
    }
  }

  function getLevelData(levelKey) {
    return LEVELS.find((level) => level.key === levelKey) || LEVELS[1];
  }

  function updateControls(levelKey) {
    const group = document.querySelector(".sp-font-controls");
    if (!group) return;

    const currentIndex = LEVELS.findIndex((level) => level.key === levelKey);
    const decrease = group.querySelector('[data-font-action="decrease"]');
    const increase = group.querySelector('[data-font-action="increase"]');
    const reset = group.querySelector('[data-font-action="reset"]');
    const status = group.querySelector(".sp-font-controls__status");
    const level = getLevelData(levelKey);

    if (decrease) decrease.disabled = currentIndex <= 0;
    if (increase) increase.disabled = currentIndex >= LEVELS.length - 1;
    if (reset) reset.setAttribute("aria-pressed", String(levelKey === "normal"));

    if (status) {
      status.textContent = level.label;
      status.setAttribute("aria-label", `Rozmiar tekstu: ${level.label}`);
    }
  }

  function applyLevel(levelKey, persist = true) {
    const level = getLevelData(levelKey);

    document.documentElement.dataset.spFontScale = level.key;
    document.documentElement.style.setProperty("--sp-font-scale", String(level.scale));

    if (persist) storeLevel(level.key);
    updateControls(level.key);
  }

  function changeLevel(direction) {
    const currentKey = document.documentElement.dataset.spFontScale || getStoredLevel();
    const currentIndex = Math.max(0, LEVELS.findIndex((level) => level.key === currentKey));
    const nextIndex = Math.min(
      LEVELS.length - 1,
      Math.max(0, currentIndex + direction)
    );

    applyLevel(LEVELS[nextIndex].key);
  }

  function createControls() {
    const existing = document.querySelector(".sp-font-controls");
    if (existing) {
      updateControls(document.documentElement.dataset.spFontScale || getStoredLevel());
      return;
    }

    const headerInner = document.querySelector(".md-header__inner");
    if (!headerInner) return;

    const group = document.createElement("div");
    group.className = "sp-font-controls";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Zmiana rozmiaru tekstu");
    group.innerHTML = `
      <button class="sp-font-controls__button" type="button" data-font-action="decrease" aria-label="Zmniejsz tekst" title="Zmniejsz tekst">A−</button>
      <button class="sp-font-controls__button sp-font-controls__button--reset" type="button" data-font-action="reset" aria-label="Przywróć domyślny rozmiar tekstu" title="Domyślny rozmiar tekstu">A</button>
      <button class="sp-font-controls__button" type="button" data-font-action="increase" aria-label="Powiększ tekst" title="Powiększ tekst">A+</button>
      <span class="sp-font-controls__status" aria-live="polite"></span>
    `;

    const paletteControl = headerInner.querySelector('[data-md-component="palette"]');
    const searchControl = headerInner.querySelector('[data-md-component="search"]');
    const anchor = paletteControl || searchControl;

    if (anchor) {
      headerInner.insertBefore(group, anchor);
    } else {
      headerInner.appendChild(group);
    }

    applyLevel(document.documentElement.dataset.spFontScale || getStoredLevel(), false);
  }

  function initialise() {
    applyLevel(getStoredLevel(), false);
    createControls();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".sp-font-controls button[data-font-action]");
    if (!button) return;

    const action = button.dataset.fontAction;
    if (action === "decrease") changeLevel(-1);
    if (action === "increase") changeLevel(1);
    if (action === "reset") applyLevel("normal");
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => {
      createControls();
      applyLevel(document.documentElement.dataset.spFontScale || getStoredLevel(), false);
    });
  }

  const observer = new MutationObserver(() => createControls());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
