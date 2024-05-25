import { Abstract } from "/static/js/components/index.js";

// Utility Class
export default class extends Abstract {
	constructor() {
		throw new Error("Cannot be instantiated");
	}

	static getBadge({ avatar, username }) {
		return `
			<div class="user-badge d-flex align-items-center gap-1">
				<img src="${MEDIA_URL}${avatar}" class="rounded-circle" style="height:20px; width:20px;" alt="User avatar" />

				<span class="lh-1">
					${username}
				</span>
			</div>
		`;
	}
}
