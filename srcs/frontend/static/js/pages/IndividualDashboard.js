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

		return `
			<h1>
				${i18next.t("dashboard.individual.title")}
			</h1>

			${User.getProfile(this.user)}

			<div class="mt-4">
				${User.getMatchesTable(this.user, this.matches)}
			</div>

			<div class="mt-4">
				${User.getTournamentsTable(this.user, this.tournament_users)}
			</div>
		`;
	}
}
