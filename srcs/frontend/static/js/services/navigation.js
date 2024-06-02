import { renderPage, sendNotification } from "./index.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  renderPage();
};

const invalidPage = () => {
  sendNotification({
		body: i18next.t("errors.invalid_page")
  });
  navigateTo("/");
}

export { navigateTo, invalidPage};
