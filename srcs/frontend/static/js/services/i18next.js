import { LOCALES } from "/static/variables.js";
import { renderSidebar, renderPage } from "./index.js";

const i18nextInit = async () => {
  await Promise.all(
    LOCALES.map(async (locale) => {
      return fetch(`/static/locales/${locale}.json`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch translation for ${locale}`);
          }
          return res.json();
        })
        .then((jsonData) => {
          return {
            [locale]: {
              translation: jsonData,
            },
          };
        })
        .catch((error) => {
          throw new Error(
            `Failed to fetch or parse the translation for ${locale}: ${error}`,
          );
        });
    }),
  )
  .then((localesData) => {
    i18next.init({
      lng: LOCALES[0],
      fallbackLng: LOCALES[0],
      resources: localesData.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    });
    i18next.on("languageChanged", async () => {
      await renderSidebar();
      await renderPage();
    });
  })
  .catch((error) => {
    throw new Error(`Failed to initiate the i18next: ${error}`);
  });
};

export default i18nextInit;
