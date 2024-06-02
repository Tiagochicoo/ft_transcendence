import { Abstract } from "/static/js/components/index.js";
import { Users } from "/static/js/api/index.js";
import { User } from "/static/js/generators/index.js";
import { invalidPage } from "/static/js/services/index.js";

export default class extends Abstract {
	constructor(props) {
		super(props);

		this.userId
	}

	async addFunctionality() {
	}

	async getHtml() {
		const response = await Users.getDashboard(this.params.userId);
		if (!response.success) {
			return invalidPage();
		}
		this.user = response.data.user;
		this.matches = response.data.matches
			.filter(({ has_finished }) => has_finished)
			.sort(({ id }) => id);
		this.tournament_users = response.data.tournament_users.sort(({ id }) => id);;

		let numWins = 0;
		for (const match of this.matches) {
			if (match.has_finished) {
				if (match.winner.id == this.user.id) {
					numWins += 1;
				}
			}
		}

		const parseDate = (rawDate) => {
			const date = new Date(rawDate);
			return date.toLocaleDateString();
		}

		return `
			<h1>
				${i18next.t("dashboard.individual.title")}
			</h1>

			${User.getProfile(this.user)}

			<div class="matches-table mt-4">
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
						${this.matches.map(match => {
							const isWinner = (match.winner.id == this.user.id);
							return `
								<tr class="${isWinner ? 'won' : 'lost'}">
									<th scope="row">${match.id}</th>
									<td>${parseDate(match.created_on)}</td>
									<td>${match.user1.id == this.user.id ? match.user2.username : match.user1.username}</td>
									<td>${match.winner.username}</td>
									<td>${isWinner ? match.score : -match.score}</td>
								</tr>
							`
						}).join("")}
					</tbody>

					<tfoot class="table-group-divider">
						<tr>
							<td colspan="2" class="text-center">
								${i18next.t("dashboard.totalMatches")}${this.matches.length}
							</td>

							<td colspan="1">
							</td>

							<td colspan="2" class="text-center">
								${i18next.t("dashboard.totalWins")}${numWins}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		`;
	}
}
