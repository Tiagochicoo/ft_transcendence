import { Abstract } from "/static/js/components/index.js";
import FriendsSection from "./FriendsSection.js";

export default class extends Abstract {
	constructor(props) {
		super(props);

		this.params = props;
	}

	async addFunctionality() {
		if (!USER_ID) {
			return;
		}

		await FriendsSection.addFunctionality();
	}

	async getHtml() {
		if (!USER_ID) {
			return '';
		}

		return `
			<div class="sidebar-outter-wrapper">
				<div class="sidebar-wrapper">
					<div class="sidebar-inner-wrapper ${window.innerWidth < 768 ? 'offcanvas' : ''} offcanvas-start" tabindex="-1" id="offcanvasSidebar" aria-labelledby="offcanvasSidebarLabel">
						<h2 class="text-white lh-1 mb-4">
							Menu
						</h2>

						${await FriendsSection.getHtml()}
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
