import { Abstract } from "/static/js/components/index.js";
import FriendsSection from "./FriendsSection.js";
import MatchesSection from "./MatchesSection.js";
import TournamentsSection from "./TournamentsSection.js";

// Utility Class
export default class extends Abstract {
	constructor() {
		throw new Error("Cannot be instantiated");
	}

	static async addFunctionality() {
		if (!USER_ID) {
			return;
		}

		await FriendsSection.addFunctionality();
		await MatchesSection.addFunctionality();
		await TournamentsSection.addFunctionality();
	}

	static async getHtml() {
		if (!USER_ID) {
			return '';
		}

		return `
			<div class="sidebar-outter-wrapper">
				<div class="sidebar-wrapper">
					<div class="sidebar-inner-wrapper ${window.innerWidth < 768 ? 'offcanvas' : ''} offcanvas-start" tabindex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
						<h2 class="text-white lh-1 mb-4">
							${i18next.t("sidebar.menu")}
						</h2>

						${await FriendsSection.getHtml()}

						${await MatchesSection.getHtml()}

						${await TournamentsSection.getHtml()}
					</div>

					<div class="navbar d-block d-md-none" data-bs-theme="dark" style="--bs-navbar-padding-y:0.75rem; --bs-navbar-padding-x:0.5rem;">
						<button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar" aria-label="Toggle sidebar navigation">
							<span class="navbar-toggler-icon"></span>
						</button>
					</div>
				</div>
			</div>
		`;
	}
}
