import { renderPage } from "/static/js/services/index.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  renderPage();
};

export default navigateTo;
