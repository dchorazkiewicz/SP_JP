(() => {
  const STORAGE_KEY = "sp-font-scale";
  const LEVELS = ["small", "normal", "large", "xlarge"];
  const LABELS = {
    small: "90%",
    normal: "100%",
    large: "115%",
    xlarge: "130%"
  };

  function readLevel() {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return LEVELS.includes(saved) ? saved : "normal";
  }

  function applyLevel(level) {
    const safeLevel = LEVELS.includes(level) ? level : "normal";
    document.documentElement.dataset.spFontScale = safeLevel;
    window.localStorage.setItem(STORAGE_KEY, safeLevel);

    const group = document.querySelector(".sp-font-controls");
    if (!group) return;

    const status = group.querySelector(".sp-font-controls__status");
    if (status) {
      status.textContent = LABELS[safeLevel];
      status.setAttribute("aria-label", `Rozmiar tekstu: ${LABELS[safeLevel]}`);
    }

    group.querySelectorAll("button[data-font-action]").forEach((button) => {
      button.removeAttribute("aria-pressed");
    });

    const resetButton = group.querySelector('[data-font-action="reset"]');
    if (resetButton) {
      resetButton.setAttribute("aria-pressed", String(safeLevel === "normal"));
    }
  }

  function changeLevel(direction) {
    const current = document.documentElement.dataset.spFontScale || readLevel();
    const currentIndex = Math.max(0, LEVELS.indexOf(current));
    const nextIndex = Math.min(
      LEVELS.length - 1,
      Math.max(0, currentIndex + direction)
    );
    applyLevel(LEVELS[nextIndex]);
  }

  function createControls() {
    if (document.querySelector(".sp-font-controls")) return;

    const paletteControl = document.querySelector('[data-md-component="palette"]');
    if (!paletteControl || !paletteControl.parentNode) return;

    const group = document.createElement("div");
    group.className = "sp-font-controls";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", "Rozmiar tekstu");

    group.innerHTML = `
      <button class="sp-font-controls__button" type="button" data-font-action="decrease" aria-label="Zmniejsz tekst" title="Zmniejsz tekst">A−</button>
      <button class="sp-font-controls__button sp-font-controls__button--reset" type="button" data-font-action="reset" aria-label="Przywróć domyślny rozmiar tekstu" title="Domyślny rozmiar tekstu">A</button>
      <button class="sp-font-controls__button" type="button" data-font-action="increase" aria-label="Powiększ tekst" title="Powiększ tekst">A+</button>
      <span class="sp-font-controls__status" aria-live="polite"></span>
    `;

    group.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-font-action]");
      if (!button) return;

      const action = button.dataset.fontAction;
      if (action === "decrease") changeLevel(-1);
      if (action === "increase") changeLevel(1);
      if (action === "reset") applyLevel("normal");
    });

    paletteControl.parentNode.insertBefore(group, paletteControl);
    applyLevel(readLevel());
  }

  applyLevel(readLevel());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createControls, { once: true });
  } else {
    createControls();
  }

  const observer = new MutationObserver(createControls);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
