(() => {
  const categories = {
    noun: {
      label: "Rzeczowniki",
      singular: "rzeczownik",
      search: "rzeczowników",
    },
    verb: {
      label: "Czasowniki",
      singular: "czasownik",
      search: "czasowników",
    },
    adjective: {
      label: "Przymiotniki",
      singular: "przymiotnik",
      search: "przymiotników",
    },
    pronoun: {
      label: "Zaimki",
      singular: "zaimek",
      search: "zaimków",
    },
    adverb: {
      label: "Przysłówki",
      singular: "przysłówek",
    },
    preposition: {
      label: "Przyimki",
      singular: "przyimek",
    },
    conjunction: {
      label: "Spójniki",
      singular: "spójnik",
    },
    particle: {
      label: "Partykuły",
      singular: "partykuła",
    },
    numeral: {
      label: "Liczebniki",
      singular: "liczebnik",
    },
  };

  function initialiseLab(lab) {
    if (lab.dataset.grammarInitialised === "true") {
      return;
    }
    lab.dataset.grammarInitialised = "true";

    const categoryButtons = [...lab.querySelectorAll("[data-grammar-category]")];
    const words = [...lab.querySelectorAll(".grammar-word[data-pos]")];
    const feedback = lab.querySelector("[data-grammar-feedback]");
    const activeCategoryElement = lab.querySelector("[data-active-category]");
    const correctCountElement = lab.querySelector("[data-correct-count]");
    const attemptCountElement = lab.querySelector("[data-attempt-count]");
    const accuracyElement = lab.querySelector("[data-accuracy]");
    const progressElement = lab.querySelector("[data-category-progress]");
    const resetButton = lab.querySelector("[data-grammar-reset]");
    const showAnswersButton = lab.querySelector("[data-show-answers]");

    let selectedCategory = null;
    let attempts = 0;
    let answersVisible = false;
    const identifiedWords = new Set();

    const setFeedback = (message, state = "neutral") => {
      feedback.textContent = message;
      feedback.className = `grammar-feedback is-${state}`;
    };

    const categoryWords = (category) =>
      words.filter((word) => word.dataset.pos === category);

    const updateProgress = () => {
      correctCountElement.textContent = String(identifiedWords.size);
      attemptCountElement.textContent = String(attempts);
      accuracyElement.textContent = attempts
        ? `${Math.round((identifiedWords.size / attempts) * 100)}%`
        : "—";

      if (!selectedCategory) {
        activeCategoryElement.textContent = "Nie wybrano";
        progressElement.textContent = "Wybierz kategorię, aby rozpocząć.";
        return;
      }

      const meta = categories[selectedCategory];
      const total = categoryWords(selectedCategory).length;
      const found = [...identifiedWords].filter(
        (word) => word.dataset.pos === selectedCategory,
      ).length;

      activeCategoryElement.textContent = meta.label;
      progressElement.textContent = `Znaleziono ${found} z ${total} ${meta.search}.`;
    };

    const hideAnswers = () => {
      answersVisible = false;
      lab.classList.remove("show-all-answers");
      showAnswersButton.textContent = "Pokaż wszystkie odpowiedzi";
      showAnswersButton.setAttribute("aria-pressed", "false");
    };

    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        selectedCategory = button.dataset.grammarCategory;
        hideAnswers();

        categoryButtons.forEach((candidate) => {
          const isActive = candidate === button;
          candidate.classList.toggle("is-active", isActive);
          candidate.setAttribute("aria-pressed", String(isActive));
        });

        const meta = categories[selectedCategory];
        setFeedback(
          `Szukasz teraz ${meta.search}. Klikaj wyrazy bezpośrednio w opowiadaniu.`,
          "neutral",
        );
        updateProgress();
      });
    });

    words.forEach((word) => {
      word.addEventListener("click", () => {
        if (answersVisible) {
          setFeedback(
            "Odpowiedzi są teraz pokazane. Ukryj je, aby wrócić do samodzielnego rozpoznawania.",
            "neutral",
          );
          return;
        }

        if (!selectedCategory) {
          setFeedback(
            "Najpierw wybierz część mowy nad opowiadaniem.",
            "warning",
          );
          return;
        }

        if (identifiedWords.has(word)) {
          const actualMeta = categories[word.dataset.pos];
          setFeedback(
            `Wyraz „${word.textContent}” został już poprawnie rozpoznany jako ${actualMeta.singular}.`,
            "neutral",
          );
          return;
        }

        attempts += 1;
        const actualCategory = word.dataset.pos;
        const actualMeta = categories[actualCategory];
        const selectedMeta = categories[selectedCategory];

        if (actualCategory === selectedCategory) {
          identifiedWords.add(word);
          word.classList.add("is-correct");
          setFeedback(
            `Dobrze. „${word.textContent}” to ${actualMeta.singular}.`,
            "correct",
          );
        } else {
          word.classList.remove("is-wrong");
          void word.offsetWidth;
          word.classList.add("is-wrong");
          window.setTimeout(() => word.classList.remove("is-wrong"), 900);
          setFeedback(
            `Nie tym razem. „${word.textContent}” to ${actualMeta.singular}, a szukasz ${selectedMeta.search}.`,
            "incorrect",
          );
        }

        updateProgress();
      });
    });

    showAnswersButton.addEventListener("click", () => {
      answersVisible = !answersVisible;
      lab.classList.toggle("show-all-answers", answersVisible);
      showAnswersButton.textContent = answersVisible
        ? "Ukryj wszystkie odpowiedzi"
        : "Pokaż wszystkie odpowiedzi";
      showAnswersButton.setAttribute("aria-pressed", String(answersVisible));

      setFeedback(
        answersVisible
          ? "Pokazano odpowiedzi dla rzeczowników, czasowników, przymiotników i zaimków."
          : "Odpowiedzi ukryto. Możesz kontynuować samodzielne rozpoznawanie.",
        "neutral",
      );
    });

    resetButton.addEventListener("click", () => {
      selectedCategory = null;
      attempts = 0;
      identifiedWords.clear();
      hideAnswers();

      categoryButtons.forEach((button) => {
        button.classList.remove("is-active");
        button.setAttribute("aria-pressed", "false");
      });

      words.forEach((word) => {
        word.classList.remove("is-correct", "is-wrong");
      });

      setFeedback(
        "Wynik został wyczyszczony. Wybierz część mowy i rozpocznij ponownie.",
        "neutral",
      );
      updateProgress();
    });

    updateProgress();
  }

  function initialiseAllLabs() {
    document.querySelectorAll("[data-grammar-lab]").forEach(initialiseLab);
  }

  document.addEventListener("DOMContentLoaded", initialiseAllLabs);

  if (typeof document$ !== "undefined") {
    document$.subscribe(initialiseAllLabs);
  }
})();
