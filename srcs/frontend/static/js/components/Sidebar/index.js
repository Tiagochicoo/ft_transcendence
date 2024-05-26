import { Abstract } from "/static/js/components/index.js";
import FriendsSection from "./FriendsSection.js";

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
	}

	static async getHtml() {
		if (!USER_ID) {
			return '';
		}

		return `
			<div class="sidebar-wrapper">
				<div class="sidebar-inner-wrapper position-absolute top-0 start-0 py-4 px-3 overflow-y-scroll rounded">
					<h2 class="text-white lh-1 mb-4">
						${i18next.t("sidebar.menu")}
					</h2>

					${await FriendsSection.getHtml()}
				</div>
			</div>
		`;
	}
}
