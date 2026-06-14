(() => {
  const categoryInfo = {
    noun: {label: "Rzeczowniki", singular: "rzeczownik", searched: "rzeczowników"},
    verb: {label: "Czasowniki", singular: "czasownik", searched: "czasowników"},
    adjective: {label: "Przymiotniki", singular: "przymiotnik", searched: "przymiotników"},
    pronoun: {label: "Zaimki", singular: "zaimek", searched: "zaimków"},
    adverb: {label: "Przysłówki", singular: "przysłówek"},
    preposition: {label: "Przyimki", singular: "przyimek"},
    conjunction: {label: "Spójniki", singular: "spójnik"},
    particle: {label: "Partykuły", singular: "partykuła"},
    numeral: {label: "Liczebniki", singular: "liczebnik"}
  };

  const app = document.querySelector("[data-grammar-app]");
  const storyRoot = app.querySelector("[data-story]");
  const categoryButtons = [...app.querySelectorAll("[data-category]")];
  const activeCategoryElement = app.querySelector("[data-active-category]");
  const correctCountElement = app.querySelector("[data-correct-count]");
  const attemptCountElement = app.querySelector("[data-attempt-count]");
  const accuracyElement = app.querySelector("[data-accuracy]");
  const progressElement = app.querySelector("[data-progress]");
  const feedbackElement = app.querySelector("[data-feedback]");
  const showAnswersButton = app.querySelector("[data-show-answers]");
  const resetButton = app.querySelector("[data-reset]");

  let selectedCategory = null;
  let attempts = 0;
  let answersVisible = false;
  const correctWords = new Set();

  function renderStory() {
    window.SZKLANY_LAS_STORY.forEach((sentence, sentenceIndex) => {
      const paragraph = document.createElement("p");
      const number = document.createElement("span");
      number.className = "sentence-number";
      number.textContent = `${sentenceIndex + 1}.`;
      paragraph.appendChild(number);

      sentence.forEach((token, tokenIndex) => {
        paragraph.appendChild(document.createTextNode(" "));
        const word = document.createElement("button");
        word.type = "button";
        word.className = "word";
        word.textContent = token.t;
        word.dataset.pos = token.p;
        word.dataset.wordId = `${sentenceIndex}-${tokenIndex}`;
        word.setAttribute("aria-label", token.t);
        paragraph.appendChild(word);
        if (token.a) {
          paragraph.appendChild(document.createTextNode(token.a));
        }
      });

      storyRoot.appendChild(paragraph);
    });
  }

  function words() {
    return [...storyRoot.querySelectorAll(".word")];
  }

  function categoryWords(category) {
    return words().filter((word) => word.dataset.pos === category);
  }

  function setFeedback(message, state = "neutral") {
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback is-${state}`;
  }

  function updateDashboard() {
    correctCountElement.textContent = String(correctWords.size);
    attemptCountElement.textContent = String(attempts);
    accuracyElement.textContent = attempts
      ? `${Math.round((correctWords.size / attempts) * 100)}%`
      : "—";

    if (!selectedCategory) {
      activeCategoryElement.textContent = "Nie wybrano";
      progressElement.textContent = "Wybierz kategorię, aby rozpocząć.";
      return;
    }

    const found = categoryWords(selectedCategory).filter((word) =>
      correctWords.has(word.dataset.wordId)
    ).length;
    const total = categoryWords(selectedCategory).length;
    activeCategoryElement.textContent = categoryInfo[selectedCategory].label;
    progressElement.textContent = `Znaleziono ${found} z ${total} ${categoryInfo[selectedCategory].searched}.`;
  }

  function hideAnswers() {
    answersVisible = false;
    app.classList.remove("show-answers");
    showAnswersButton.textContent = "Pokaż odpowiedzi";
    showAnswersButton.setAttribute("aria-pressed", "false");
  }

  function selectCategory(category, clickedButton) {
    selectedCategory = category;
    hideAnswers();

    categoryButtons.forEach((button) => {
      const active = button === clickedButton;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    setFeedback(
      `Szukasz teraz ${categoryInfo[category].searched}. Klikaj wyrazy w opowiadaniu.`,
      "neutral"
    );
    updateDashboard();
  }

  function handleWordClick(word) {
    if (answersVisible) {
      setFeedback("Odpowiedzi są pokazane. Ukryj je, aby wrócić do samodzielnej pracy.", "neutral");
      return;
    }

    if (!selectedCategory) {
      setFeedback("Najpierw wybierz część mowy w panelu po lewej stronie.", "warning");
      return;
    }

    const id = word.dataset.wordId;
    const actualCategory = word.dataset.pos;
    const actualInfo = categoryInfo[actualCategory];

    if (correctWords.has(id)) {
      setFeedback(`Wyraz „${word.textContent}” został już poprawnie rozpoznany jako ${actualInfo.singular}.`, "neutral");
      return;
    }

    attempts += 1;

    if (actualCategory === selectedCategory) {
      correctWords.add(id);
      word.classList.add("is-correct");
      setFeedback(`Dobrze. „${word.textContent}” to ${actualInfo.singular}.`, "correct");
    } else {
      word.classList.remove("is-wrong");
      void word.offsetWidth;
      word.classList.add("is-wrong");
      window.setTimeout(() => word.classList.remove("is-wrong"), 850);
      setFeedback(
        `Nie tym razem. „${word.textContent}” to ${actualInfo.singular}, a szukasz ${categoryInfo[selectedCategory].searched}.`,
        "incorrect"
      );
    }

    updateDashboard();
  }

  function resetApp() {
    selectedCategory = null;
    attempts = 0;
    correctWords.clear();
    hideAnswers();

    categoryButtons.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });

    words().forEach((word) => word.classList.remove("is-correct", "is-wrong"));
    setFeedback("Wynik został wyczyszczony. Wybierz kategorię i rozpocznij ponownie.", "neutral");
    updateDashboard();
  }

  function resizeParentFrame() {
    if (!window.frameElement) return;
    const height = Math.ceil(document.documentElement.scrollHeight + 12);
    window.frameElement.style.height = `${height}px`;
  }

  renderStory();

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => selectCategory(button.dataset.category, button));
  });

  storyRoot.addEventListener("click", (event) => {
    const word = event.target.closest(".word");
    if (word) handleWordClick(word);
  });

  showAnswersButton.addEventListener("click", () => {
    answersVisible = !answersVisible;
    app.classList.toggle("show-answers", answersVisible);
    showAnswersButton.textContent = answersVisible ? "Ukryj odpowiedzi" : "Pokaż odpowiedzi";
    showAnswersButton.setAttribute("aria-pressed", String(answersVisible));
    setFeedback(
      answersVisible
        ? "Pokazano odpowiedzi dla czterech ćwiczonych części mowy."
        : "Odpowiedzi ukryto. Możesz kontynuować samodzielną pracę.",
      "neutral"
    );
  });

  resetButton.addEventListener("click", resetApp);
  updateDashboard();

  window.addEventListener("load", resizeParentFrame);
  window.addEventListener("resize", resizeParentFrame);
  if ("ResizeObserver" in window) {
    new ResizeObserver(resizeParentFrame).observe(document.body);
  }
})();
