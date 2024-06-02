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
		this.matches = response.data.matches.filter(({ has_finished }) => has_finished);
		this.tournaments = response.data.tournaments;

		let numWins = 0;
		for (const match of this.matches) {
			if (match.has_finished) {
				if (match.winner.id == this.user.id) {
					numWins += 1;
				}
			}
		}

		return `
			<h1>
				${i18next.t("Personal Dashboard")}
			</h1>

			${User.getProfile(this.user)}

			<div class="dashboard">
				<table class="table table-hover text-center">
					<thead class="table-secondary">
						<tr>
							<th scope="col">${i18next.t("Match_ID")}</th>
							<th scope="col">${i18next.t("Opponent")}</th>
							<th scope="col">${i18next.t("Winner")}</th>
							<th scope="col">${i18next.t("Score")}</th>
						</tr>
					</thead>
					<tbody class="table-group-divider" style="border-top-color: #6c757d">
						<tr>
							<td colspan="6" class="text-center">
								${i18next.t("Total Matches: ")}${this.matches.length}
							</td>
						</tr>

						${this.matches.map(match => `
							<tr>
								<th scope="row">${match.id}</th>
								<td>${match.user1.id == this.user.id ? match.user2.username : match.user1.username}</td>
								<td>${match.winner.username}</td>
								<td>${match.score}</td>
							</tr>
						`).join("")}
					</tbody>

					<tbody class="table-group-divider" style="border-top-color: #6c757d">
						<tr>
							<td colspan="6" class="text-center">
								${i18next.t("Total Wins: ")}${numWins}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		`;
	}
}
