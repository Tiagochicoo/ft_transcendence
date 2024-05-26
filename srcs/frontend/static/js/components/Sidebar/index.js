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
					<div class="sidebar-inner-wrapper position-absolute top-0 start-0 h-100 w-100 py-4 px-3 overflow-y-scroll rounded">
						<h2 class="text-white lh-1 mb-4">
							Menu
						</h2>

						${await FriendsSection.getHtml()}
					</div>
				</div>
			</div>
		`;
	}
}
