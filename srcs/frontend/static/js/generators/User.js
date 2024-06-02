import { Abstract } from "/static/js/components/index.js";

// Utility Class
export default class extends Abstract {
	constructor() {
		throw new Error("Cannot be instantiated");
	}

	static getBadge(user) {
		if (!user || !user.id) {
			return '';
		}

		const { id, avatar, username } = user;
		const isOnline = ONLINE_USERS.find(onlineUserID => onlineUserID == id);

		return `
			<a class="user-badge d-flex align-items-center gap-2 ${isOnline ? 'is-online' : ''}" data-user-id="${id}" href="/dashboard/individual/${id}" data-link>
				<img src="${MEDIA_URL}${avatar}" class="rounded-circle" style="height:28px; width:28px;" alt="User avatar" />

				<div class="online-circle">
				</div>

				<span class="lh-2">
					${username}
				</span>
			</a>
		`;
	}

	static getProfile(user) {
		if (!user || !user.id) {
			return '';
		}

		return `
			<div class="user-profile d-flex align-items-center flex-wrap gap-2">
				<img src="${MEDIA_URL}${user.avatar}" class="rounded-circle" alt="User avatar" />

				<div class="user-profile d-flex flex-column">
					<p class="font-weight-bold mb-0">
						<strong>
							${user.username}
						</strong>
					</p>

					<p class="mb-0">
						<strong>
							Matches won:
						</strong>
						${user.num_games_won}/${user.num_games}
					</p>

					<p class="mb-0">
						<strong>
							Tournaments won:
						</strong>
						${user.num_tournaments_won}/${user.num_tournaments}
					</p>
				</div>
			</div>
		`;
	}
}
