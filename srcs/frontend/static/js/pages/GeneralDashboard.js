import { Abstract } from "/static/js/components/index.js";
import { Users } from "/static/js/api/index.js";
import { User } from "/static/js/generators/index.js";
import { invalidPage } from "/static/js/services/index.js";

export default class extends Abstract {
	constructor(props) {
		super(props);
	}

	async addFunctionality() {
		// Enable tooltips
		const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
		tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl)
		});
	}

	async getHtml() {
		let response = await Users.getDashboard(USER_ID);
		if (!response.success) {
			return invalidPage();
		}

		this.user = response.data.user;
		this.matches = response.data.matches
			.filter(({ has_finished }) => has_finished)
			.sort((a, b) => a.id > b.id ? -1 : 1);
		this.tournament_users = response.data.tournament_users
			.filter(({ tournament }) => tournament.has_finished)
			.sort((a, b) => a.id > b.id ? -1 : 1);

		response = await Users.getAll();
		if (!response.success) {
			return invalidPage();
		}

		this.users = response.data;

		return `
			<h1>
				${i18next.t("dashboard.general.title")}
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
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="pills-rankings-tab" data-bs-toggle="pill" data-bs-target="#pills-rankings" type="button" role="tab" aria-controls="pills-rankings" aria-selected="false">
						${i18next.t("dashboard.rankings")}
					</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="pills-history-tab" data-bs-toggle="pill" data-bs-target="#pills-history" type="button" role="tab" aria-controls="pills-history" aria-selected="false">
						${i18next.t("dashboard.history")}
					</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="pills-ratios-tab" data-bs-toggle="pill" data-bs-target="#pills-ratios" type="button" role="tab" aria-controls="pills-ratios" aria-selected="false">
						${i18next.t("dashboard.ratios")}
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

				<div class="tab-pane fade" id="pills-rankings" role="tabpanel" aria-labelledby="pills-rankings-tab">
					${User.getRankingsTable(this.users)}
				</div>

				<div class="tab-pane fade" id="pills-history" role="tabpanel" aria-labelledby="pills-history-tab">
					<div class="mt-4">
						${User.getHistoryTable(this.matches)}
					</div>
				</div>

				<div class="tab-pane fade" id="pills-ratios" role="tabpanel" aria-labelledby="pills-ratios-tab">
					<div class="d-flex flex-column flex-lg-row justify-content-around align-items-lg-between gap-4 mt-4">
						${User.getCircle({ title: i18next.t("dashboard.matchesWinRatio"), ratio: this.user.num_games_won / this.user.num_games })}
						${User.getCircle({ title: i18next.t("dashboard.tournamentsWinRatio"), ratio: this.user.num_tournaments_won / this.user.num_tournaments })}
					</div>
				</div>
			</div>
		`;
	}
}
