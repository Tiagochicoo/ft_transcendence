import { Abstract } from "/static/js/components/index.js";

// Utility Class
export default class extends Abstract {
	constructor() {
		throw new Error("Cannot be instantiated");
	}

	static getBadge({ id, avatar, username }) {
		const isOnline = ONLINE_USERS.find(onlineUserID => onlineUserID == id);

		return `
			<div class="user-badge d-flex align-items-center gap-2 ${isOnline ? 'is-online' : ''}" data-user-id="${id}">
				<img src="${MEDIA_URL}${avatar}" class="rounded-circle" style="height:28px; width:28px;" alt="User avatar" />

				<span class="lh-1">
					${username}
				</span>
			</div>
		`;
	}
}
