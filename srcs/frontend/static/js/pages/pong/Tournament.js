import { Abstract } from "/static/js/components/index.js";
import { Tournaments } from "/static/js/api/index.js";

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

	generateRounds() {
		this.rounds = new Array(7).fill(null).map(() => ({
			user1: {},
			user2: {},
			winner: {},
		}));

		// Quarterfinals
		for (let i = 0, j = 0; i < 4; i++) {
			this.rounds[i].user1 = this.tournamentUsers[j++].user;
			this.rounds[i].user2 = this.tournamentUsers[j++].user;
			const match = this.matches.find(({ user1, user2 }) => (
				(user1.id == this.rounds[i].user1.id) && (user2.id == this.rounds[i].user2.id) ||
				(user1.id == this.rounds[i].user2.id) && (user2.id == this.rounds[i].user1.id)
			));
			if (match) {
				this.rounds[i].winner = match.winner;
			}
		}

		// Semifinals
		for (let i = 4, j = 0; i < 6; i++, j += 2) {
			if (this.rounds[j].winner) {
				this.rounds[i].user1 = this.rounds[j].winner;
			}
			if (this.rounds[j + 1].winner) {
				this.rounds[i].user2 = this.rounds[j + 1].winner;
			}
			const match = this.matches.find(({ user1, user2 }) => (
				(user1.id == this.rounds[i].user1.id) && (user2.id == this.rounds[i].user2.id) ||
				(user1.id == this.rounds[i].user2.id) && (user2.id == this.rounds[i].user1.id)
			));
			if (match) {
				this.rounds[i].winner = match.winner;
			}
		}

		// Finals
		if (this.rounds[4].winner) {
			this.rounds[6].user1 = this.rounds[4].winner;
		}
		if (this.rounds[5].winner) {
			this.rounds[6].user2 = this.rounds[4].winner;
		}
		const match = this.matches.find(({ user1, user2 }) => (
			(user1.id == this.rounds[6].user1.id) && (user2.id == this.rounds[6].user2.id) ||
			(user1.id == this.rounds[6].user2.id) && (user2.id == this.rounds[6].user1.id)
		));
		if (match) {
			this.rounds[6].winner = match.winner;
			this.winner = match.winner;
		}
	}

	getRound(round) {
		return `
			<div class="match">
				<div class="player ${(round.winner.id && (round.user1.id == round.winner.id)) ? "round-winner" : ""}">
					${round.user1.username || ""}
				</div>
				<div class="player ${(round.winner.id && (round.user2.id == round.winner.id)) ? "round-winner" : ""}">
					${round.user2.username || ""}
				</div>
			</div>
		`;
	}

	getBrackets() {
		return `
			<div class='bracket'>
				<div class='round'>
					${this.rounds.slice(0, 4).map(round => this.getRound(round)).join("")}
				</div>
				<div class='round'>
					${this.rounds.slice(4, 6).map(round => this.getRound(round)).join("")}
				</div>
				<div class='round'>
					${this.rounds.slice(6, 7).map(round => this.getRound(round)).join("")}
				</div>
				<div class='round'>
					<div class="winner"><p>${i18next.t("pong.winner")}</p>${this.winner}</div>
				</div>
			</div>
		`;
	}

	async addFunctionality() {
	}

	async getHtml() {
		let response = await Tournaments.getAllTournamentUsers(this.tournamentId);
		this.tournamentUsers = response.data;
		console.log('this.tournamentUsers', this.tournamentUsers);

		response = await Tournaments.getAllMatches(this.tournamentId);
		this.matches = response.data;
		console.log('this.matches', this.matches);

		this.generateRounds();
		console.log('this.rounds', this.rounds);

		return `
			<h1 class="mb-4">
				${i18next.t("pong.title")}
			</h1>

			<div id="tournament-bracket" class="d-flex flex-column mt-2">
				${this.getBrackets()}
			</div>
		`;
	}
}