document.addEventListener("DOMContentLoaded", () => {
  const stories = document.querySelectorAll("[data-grammar-story]");

  stories.forEach((story) => {
    const container = story.parentElement;
    const toggleButtons = container.querySelectorAll("[data-grammar-toggle]");
    const resetButton = container.querySelector("[data-grammar-reset]");

    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.grammarToggle;
        const isActive = story.classList.toggle(`show-${category}`);
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    });

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        ["noun", "verb", "adjective", "pronoun"].forEach((category) => {
          story.classList.remove(`show-${category}`);
        });

        toggleButtons.forEach((button) => {
          button.classList.remove("is-active");
          button.setAttribute("aria-pressed", "false");
        });
      });
    }
  });
});
