(() => {
  const STORAGE_KEY = "sp-font-scale";
  const LEVELS = ["small", "normal", "large", "xlarge", "xxlarge"];

  function readLevel() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return LEVELS.includes(saved) ? saved : "normal";
    } catch (_) {
      return "normal";
    }
  }

  function saveLevel(level) {
    try {
      window.localStorage.setItem(STORAGE_KEY, level);
    } catch (_) {
      // Ustawienie nadal działa do końca bieżącej wizyty.
    }
  }

  function applyLevel(level, persist = true) {
    const safeLevel = LEVELS.includes(level) ? level : "normal";
    document.documentElement.dataset.spFontScale = safeLevel;

    if (persist) saveLevel(safeLevel);

    const controls = document.querySelector(".sp-font-controls");
    if (!controls) return;

    const index = LEVELS.indexOf(safeLevel);
    const decrease = controls.querySelector('[data-font-action="decrease"]');
    const increase = controls.querySelector('[data-font-action="increase"]');
    const reset = controls.querySelector('[data-font-action="reset"]');

    if (decrease) decrease.disabled = index === 0;
    if (increase) increase.disabled = index === LEVELS.length - 1;
    if (reset) reset.setAttribute("aria-pressed", String(safeLevel === "normal"));
  }

  function moveLevel(step) {
    const current = document.documentElement.dataset.spFontScale || readLevel();
    const index = Math.max(0, LEVELS.indexOf(current));
    const next = Math.min(LEVELS.length - 1, Math.max(0, index + step));
    applyLevel(LEVELS[next]);
  }

  function createControls() {
    if (document.querySelector(".sp-font-controls")) return;

    const header = document.querySelector(".md-header__inner");
    if (!header) return;

    const controls = document.createElement("div");
    controls.className = "sp-font-controls";
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", "Zmiana rozmiaru tekstu");
    controls.innerHTML = `
      <button class="sp-font-controls__button" type="button" data-font-action="decrease" aria-label="Zmniejsz tekst" title="Zmniejsz tekst">A−</button>
      <button class="sp-font-controls__button sp-font-controls__button--reset" type="button" data-font-action="reset" aria-label="Przywróć domyślny rozmiar tekstu" title="Domyślny rozmiar tekstu">A</button>
      <button class="sp-font-controls__button" type="button" data-font-action="increase" aria-label="Powiększ tekst" title="Powiększ tekst">A+</button>
    `;

    const palette = header.querySelector('[data-md-component="palette"]');
    const search = header.querySelector('[data-md-component="search"]');
    const anchor = palette || search;

    if (anchor) header.insertBefore(controls, anchor);
    else header.appendChild(controls);

    applyLevel(document.documentElement.dataset.spFontScale || readLevel(), false);
  }

  function initialise() {
    applyLevel(readLevel(), false);
    createControls();
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".sp-font-controls button[data-font-action]");
    if (!button) return;

    const action = button.dataset.fontAction;
    if (action === "decrease") moveLevel(-1);
    if (action === "increase") moveLevel(1);
    if (action === "reset") applyLevel("normal");
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
