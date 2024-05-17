import { Abstract } from "/static/js/components/index.js";
import FriendsSection from "./FriendsSection.js";

export default class extends Abstract {
	constructor(props) {
		super(props);

		this.params = props;
		this.friendsSection = new FriendsSection();
	}

	async addFunctionality() {
		if (!USER_ID) {
			return;
		}

		await this.friendsSection.addFunctionality();
	}

	async getHtml() {
		if (!USER_ID) {
			return '';
		}

		return `
			<div class="sidebar-wrapper">
				<div class="sidebar-inner-wrapper position-absolute top-0 start-0 p-3 overflow-y-scroll rounded">
					<h2 class="text-white lh-1 mb-4">
						Menu
					</h2>

					${await this.friendsSection.getHtml()}
				</div>
			</div>
		`;
	}
}
