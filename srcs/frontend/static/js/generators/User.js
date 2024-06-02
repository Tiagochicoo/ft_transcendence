import { Abstract } from "/static/js/components/index.js";

// Utility Class
export default class extends Abstract {
	constructor() {
		throw new Error("Cannot be instantiated");
	}

	static parseDate(rawDate) {
		const date = new Date(rawDate);
		return date.toLocaleDateString();
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
			<div class="user-profile d-flex align-items-center flex-wrap gap-3">
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

	static getMatchesTable(user, matches) {
		return `
			<div class="matches-table">
				<table class="table table-hover text-center">
					<thead class="table-secondary">
						<tr>
							<th colspan="5"">${i18next.t("dashboard.matches")}</th>
						</tr>

						<tr>
							<th scope="col">ID</th>
							<th scope="col">${i18next.t("dashboard.date")}</th>
							<th scope="col">${i18next.t("dashboard.opponent")}</th>
							<th scope="col">${i18next.t("dashboard.winner")}</th>
							<th scope="col">${i18next.t("dashboard.score")}</th>
						</tr>
					</thead>

					<tbody class="table-group-divider">
						${matches.map(match => {
							const isWinner = (match.winner.id == user.id);
							return `
								<tr class="${isWinner ? 'won' : 'lost'}">
									<th scope="row">${match.id}</th>
									<td>${this.parseDate(match.created_on)}</td>
									<td>${match.user1.id == user.id ? match.user2.username : match.user1.username}</td>
									<td>${match.winner.username}</td>
									<td>${isWinner ? match.score : -match.score}</td>
								</tr>
							`
						}).join("")}
					</tbody>

					<tfoot class="table-group-divider">
						<tr>
							<td colspan="2" class="text-center">
								${i18next.t("dashboard.totalMatches")}${user.num_games}
							</td>

							<td colspan="1">
							</td>

							<td colspan="2" class="text-center">
								${i18next.t("dashboard.totalWins")}${user.num_games_won}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		`;
	}

	static getTournamentsTable(user, tournament_users) {
		return `
			<div class="matches-table">
				<table class="table table-hover text-center">
					<thead class="table-secondary">
						<tr>
							<th colspan="5"">${i18next.t("dashboard.tournaments")}</th>
						</tr>

						<tr>
							<th scope="col">ID</th>
							<th scope="col">${i18next.t("dashboard.date")}</th>
							<th scope="col">${i18next.t("dashboard.winner")}</th>
							<th scope="col">${i18next.t("dashboard.position")}</th>
						</tr>
					</thead>

					<tbody class="table-group-divider">
						${tournament_users.map(tournament_user => {
							const isWinner = (tournament_user.tournament.winner.id == user.id);
							return `
								<tr class="${isWinner ? 'won' : 'lost'}">
									<th scope="row">${tournament_user.id}</th>
									<td>${this.parseDate(tournament_user.tournament.created_on)}</td>
									<td>${tournament_user.tournament.winner.username}</td>
									<td>${tournament_user.position + 1}º</td>
								</tr>
							`
						}).join("")}
					</tbody>

					<tfoot class="table-group-divider">
						<tr>
							<td colspan="2" class="text-center">
								${i18next.t("dashboard.totalTournaments")}${user.num_tournaments}
							</td>

							<td colspan="1">
							</td>

							<td colspan="2" class="text-center">
								${i18next.t("dashboard.totalWins")}${user.num_tournaments_won}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		`;
	}

	static getRankingsTable(users) {
		users = users.map(user => ({
			...user,
			score: (user.num_games_won * 5) + (user.num_tournaments_won * 10)
		})).sort((a, b) => {
			if (a.score < b.score) {
				return 1;
			} else if (a.score > b.score) {
				return -1;
			} else if (a.id < b.id) {
				return 1;
			} else if (a.id > b.id) {
				return -1;
			}
			return 0;
		});

		return `
			<div class="matches-table">
				<table class="table table-hover text-center">
					<thead class="table-secondary">
						<tr>
							<th colspan="3"">${i18next.t("dashboard.rankings")}</th>
						</tr>

						<tr>
							<th scope="col">${i18next.t("dashboard.rank")}</th>
							<th scope="col">${i18next.t("dashboard.username")}</th>
							<th scope="col">${i18next.t("dashboard.score")}</th>
						</tr>
					</thead>

					<tbody class="table-group-divider">
						${users.map((user, index) => {
							const isUser = (user.id == USER_ID);
							return `
								<tr class="${isUser ? 'won' : ''}">
									<th scope="row">${index + 1}</th>
									<td>${user.username}</td>
									<td>${user.score}</td>
								</tr>
							`
						}).join("")}
					</tbody>
				</table>
			</div>
		`;
	}

	static getCircle({ title, ratio }) {
		ratio = Math.round(ratio * 100);

		let color = '#008000';
		if (ratio < 30) {
			color = '#FF0000';
		} else if (ratio < 65) {
			color = '#FFCC00';
		}

		return `
			<div class="pie-chart-wrapper d-flex flex-column justify-content-between">
				<h5 class="mb-3">
					${title}
				</h5>

				<div class="pie-chart" style="--ratio: ${ratio};--color: ${color}">
					${ratio}%
				</div>
			</div>
		`;
	}
}
