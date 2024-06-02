import { Users } from "/static/js/api/index.js";
import { User } from "/static/js/generators/index.js";
import { doLogout } from "/static/js/services/index.js";
import { Abstract, FontSizeToggle, LanguageToggle } from "./index.js";

export default class extends Abstract {
    constructor(props) {
        super(props);

        this.params = props;
        this.languageToggle = new LanguageToggle();
        this.fontSizeToggle = new FontSizeToggle();
        this.user = {};
    }

    handleLogout() {
        console.log("Logging out user.");
        doLogout();
    }

    async addFunctionality() {
        await this.fontSizeToggle.addFunctionality();
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', this.handleLogout);
        }
    }

    // navbar.individualDashboard should pass the logged userId on href
    // now it is hardcoded
    async getHtml() {
        if (USER_ID) {
            this.user = await Users.get(USER_ID)
                .then((response) => response.data)
                .catch((error) => ({}));
        }

        const userManagementLinks = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${i18next.t("navbar.userManagement")}
                </a>
                <ul class="dropdown-menu">
                    ${USER_ID ? `
                        <li>
                            <a class="dropdown-item" href="/edit-profile" data-link>
                                ${i18next.t("navbar.editProfile")}
                            </a>
                        </li>
                        <li>
                            <button id="logoutButton" class="dropdown-item"">
                                ${i18next.t("navbar.logout")}
                            </button>
                        </li>
                    ` : `
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
                    `}
                </ul>
            </li>
        `;

        return `
            <nav class="navbar navbar-expand-lg fixed-top bg-body-tertiary">
                <div class="container position-relative">
                    <a class="navbar-brand" href="/" data-link>
                        <img src="/static/images/logo-42.png" alt="42 school logo" style="height: 40px;"/>
                    </a>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="/" data-link>
                                    ${i18next.t("navbar.home")}
                                </a>
                            </li>
                            ${USER_ID ? `
                                <li class="nav-item">
                                    <a class="nav-link" href="/pong" data-link>
                                        ${i18next.t("navbar.pong")}
                                    </a>
                                </li>
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        ${i18next.t("navbar.dashboard")}
                                    </a>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" href="/dashboard/individual/1" data-link>
                                                ${i18next.t("navbar.individualDashboard")}
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="/dashboard/general" data-link>
                                                ${i18next.t("navbar.generalDashboard")}
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                            ` : ''}
                            ${userManagementLinks}

                            <li class="nav-item d-block d-sm-none py-1">
                                ${await this.languageToggle.getHtml()}
                            </li>

                            <li class="nav-item d-block d-sm-none py-1">
                                ${await this.fontSizeToggle.getHtml()}
                            </li>
                        </ul>
                    </div>

                    <div class="navbar-side-wrapper">
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navbar navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <div class="d-none d-sm-block">
                            ${await this.languageToggle.getHtml()}
                        </div>

                        <div class="d-none d-sm-block">
                            ${await this.fontSizeToggle.getHtml()}
                        </div>

                        ${Object.keys(this.user).length ? User.getBadge(this.user) : ""}
                    </div>
                </div>
            </nav>
        `;
    }
}
