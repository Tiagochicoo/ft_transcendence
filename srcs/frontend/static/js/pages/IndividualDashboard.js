import { Abstract } from "/static/js/components/index.js";
import { Users } from "/static/js/api/index.js";
import { User } from "/static/js/generators/index.js";
import { invalidPage } from "/static/js/services/index.js";

export default class extends Abstract {
	constructor(props) {
		super(props);
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

		return `
			<h1>
				${i18next.t("dashboard.individual.title")}
			</h1>

			${User.getProfile(this.user)}

			<ul class="nav nav-pills mt-4 mb-2" id="dashboard-individual-pills-tab" role="tablist">
				<li class="nav-item" role="presentation">
					<button class="nav-link active" id="pills-matches-tab" data-bs-toggle="pill" data-bs-target="#pills-matches" type="button" role="tab" aria-controls="pills-matches" aria-selected="true">
						${i18next.t("dashboard.matches")}
					</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="pills-tournaments-tab" data-bs-toggle="pill" data-bs-target="#pills-tournaments" type="button" role="tab" aria-controls="pills-tournaments" aria-selected="false">
						${i18next.t("dashboard.tournaments")}
					</button>
				</li>
			</ul>

			<div class="tab-content" id="dashboard-individual-pills-tabContent">
				<div class="tab-pane fade active show" id="pills-matches" role="tabpanel" aria-labelledby="pills-matches-tab">
					${User.getMatchesTable(this.user, this.matches)}
				</div>

				<div class="tab-pane fade" id="pills-tournaments" role="tabpanel" aria-labelledby="pills-tournaments-tab">
					${User.getTournamentsTable(this.user, this.tournament_users)}
				</div>
			</div>
		`;
	}
}
