import { Navbar, Sidebar } from "/static/js/components/index.js";
import {
  GeneralDashboard,
  IndividualDashboard,
  Home,
  SignIn,
  SignUp,
  Match,
  Pong,
  Setup,
} from "/static/js/pages/index.js";
import { refreshUserID } from "/static/js/services/authService.js";
import { navigateTo } from "/static/js/services/index.js";

const ROUTES = [
  { path: "/", title: "Home", page: Home },
  { path: "/pong", title: "Pong", page: Pong },
  { path: "/pong/single/setup", title: "Pong", page: Setup },
  { path: "/pong/single/match", title: "Pong", page: Match },
  { path: "/sign-up", title: "Sign-up", page: SignUp },
  { path: "/sign-in", title: "Sign-in", page: SignIn },
  {
    path: "/dashboard/general",
    title: "General statistics",
    page: GeneralDashboard,
  },
  {
    path: "/dashboard/individual/:userId",
    title: "Individual statistics",
    page: IndividualDashboard,
  },
];

const getParams = (path) => {
  const paramKeys = path.match(/\/:(\w+)*/g);
  const regex = new RegExp(
    "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$",
  );

  let params = {};

  const paramValues = location.pathname.match(regex);

  paramKeys?.forEach((key, i) => {
    let paramKey = key.replace("/:", "");
    params[paramKey] = paramValues[i + 1];
  });

  return params;
};

const doesPathMatch = (path) => {
  const regex = new RegExp(
    "^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$",
  );

  return location.pathname.match(regex) !== null;
};

const isRouteValid = (route) => (
  route && (
    // Non Logged in users can only access home, sign-up and sign-in pages
    (!USER_ID && ['/', '/sign-up', '/sign-in'].includes(route.path)) ||
    // Logged in users cannot access the sign-up and sign-in pages
    (USER_ID && !['/sign-up', '/sign-in'].includes(route.path))
  )
)

const renderSidebar = async () => {
  const sidebar = new Sidebar();
  document.getElementById("sidebar").innerHTML = await sidebar.getHtml();
  await sidebar.addFunctionality();
}

const renderPage = async () => {
  await refreshUserID();

  let thisRoute = ROUTES.find((route) => doesPathMatch(route.path));

  // Invalid routes redirect to the homepage
  if (!isRouteValid(thisRoute)) {
    return navigateTo(USER_ID ? '/' : '/sign-in');
  }

  let params = {};

  if (thisRoute.path.search(":") !== -1) params = getParams(thisRoute.path);

  const page = new thisRoute.page({ title: thisRoute.title, ...params });

  const navbar = new Navbar();
  document.getElementById("navbar").innerHTML = await navbar.getHtml();
  await navbar.addFunctionality();

  document.getElementById("app").innerHTML = await page.getHtml();
  document.title = thisRoute.title;
  await page.addFunctionality();

  const sidebar = document.getElementById("sidebar");
  const chatbox = document.getElementById("chat-box");
  if (USER_ID && !sidebar.innerHTML.length) {
    await renderSidebar();
  } else if (!USER_ID) {
    sidebar.innerHTML = '';
    chatbox.innerHTML = '';
  }
};

export default renderPage;
