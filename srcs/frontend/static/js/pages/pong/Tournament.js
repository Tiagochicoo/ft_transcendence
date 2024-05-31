import { Abstract } from "/static/js/components/index.js";
import TournamentsSection from "/static/js/components/Sidebar/TournamentsSection.js";

export default class extends Abstract{
	constructor(props) {
		super(props);
		this.params = props;
		this.tournamentId = this.params.id;
		this.rounds = [];
		this.matches = [];
		this.winner = "?";
		this.participants = [];
	}

	async addFunctionality() {
	}

	async getHtml() {
		return `
			<h1 class="mb-4">
				${i18next.t("pong.title")}
			</h1>

			<div id="tournament-bracket" class="d-flex flex-column mt-2">
				${await TournamentsSection.getTournamentsPageContent(this.tournamentId)}
			</div>
		`;
	}
}