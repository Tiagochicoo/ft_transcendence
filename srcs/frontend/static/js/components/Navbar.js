import { clearTokens } from "/static/js/services/authService.js";
import { navigateTo } from "/static/js/services/index.js";
import { Abstract, LanguageToggle } from "./index.js";
import { isLoggedIn, getUserIDFromToken } from "../services/authService.js";

export default class extends Abstract {
    constructor(props) {
        super(props);

        this.params = props;
        this.languageToggle = new LanguageToggle();
    }

    handleLogout() {
        console.log("Logging out user.");
        clearTokens();
        navigateTo('/sign-in');
    }

    async addFunctionality() {
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', this.handleLogout);
        }
    }

    // navbar.individualDashboard should pass the logged userId on href
    // now it is hardcoded
    async getHtml() {
        const userManagementLinks = USER_ID ? '' : `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${i18next.t("navbar.userManagement")}
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="/sign-up" data-link>
                            ${i18next.t("navbar.signUp")}
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="/sign-in" data-link>
                            ${i18next.t("navbar.signIn")}
                        </a>
                    </li>
                </ul>
            </li>
        `;

        const logoutLink = USER_ID ? `
            <li class="nav-item" style="margin-right: 20px;">
                <button id="logoutButton" class="btn btn-link nav-link" style="color: inherit;">
                    ${i18next.t("navbar.logout")}
                </button>
            </li>
        ` : '';

        return `
            <nav class="navbar navbar-expand-lg fixed-top bg-body-tertiary">
                <div class="container position-relative">
                    <a class="navbar-brand" href="/" data-link>
                        <img src="/static/images/logo-42.png" style="height: 40px;"/>
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="/" data-link>
                                    ${i18next.t("navbar.home")}
                                </a>
                            </li>
                            ${USER_ID ? `
                                <li class="nav-item">
                                    <a class="nav-link" href="${isUserLoggedIn ? '/pong' : '/sign-in'}" data-link>
                                        ${i18next.t("navbar.pong")}
                                    </a>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        ${i18next.t("navbar.dashboard")}
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" href="${isUserLoggedIn ? '/dashboard/individual/' + getUserIDFromToken() : '/sign-in'}" data-link>
                                                ${i18next.t("navbar.individualDashboard")}
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="${isUserLoggedIn ? '/dashboard/general' : '/sign-in'}" data-link>
                                                ${i18next.t("navbar.generalDashboard")}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            ` : ''}
                            ${userManagementLinks}
                            ${logoutLink}
                        </ul>
                    </div>
                    ${await this.languageToggle.getHtml()}
                </div>
            </nav>
        `;
    }
}
