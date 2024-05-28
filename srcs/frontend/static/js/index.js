import { i18nextInit, navigateTo, renderPage } from "/static/js/services/index.js";

document.addEventListener("DOMContentLoaded", async () => {
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

  // Handle Resize for the OffCanvas Sidebar
  window.addEventListener('resize', (e) => {
    const sidebarOffCanvas = document.querySelector("#sidebar .sidebar-inner-wrapper");
    if (!sidebarOffCanvas) return;

    if (window.innerWidth < 768) {
      sidebarOffCanvas.classList.add("offcanvas");
    } else {
      sidebarOffCanvas.classList.remove("offcanvas");
    }
  });

  // Render Page
  await i18nextInit().then(renderPage);
});
