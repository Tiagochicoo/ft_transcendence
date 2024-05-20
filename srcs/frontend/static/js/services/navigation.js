import { renderPage } from "./index.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  renderPage();
};

export default navigateTo;
