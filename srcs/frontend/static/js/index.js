import { i18nextInit, navigateTo, renderPage, renderSidebar } from "/static/js/services/index.js";

document.addEventListener("DOMContentLoaded", () => {
  // Handle Page Links
  document.body.addEventListener("click", (e) => {
    let currentElement = e.target;

    if (currentElement.matches("[data-link-locale]")) {
      e.preventDefault();
      i18next.changeLanguage(currentElement.getAttribute("data-link-locale"));
      return;
    }

    while (
      currentElement.tagName &&
      (currentElement.matches("[data-link]") || currentElement.parentNode)
    ) {
      if (currentElement.matches("[data-link]")) {
        e.preventDefault();
        navigateTo(currentElement.getAttribute("href"));
        return;
      }

      currentElement = currentElement.parentNode;
    }
  });

  // Handle "Go Back" Button
  window.addEventListener('popstate', (e) => {
    renderPage();
  });

  const renderAll = () => {
    renderPage();
    renderSidebar();
  }

  i18nextInit().then(renderAll);
});
