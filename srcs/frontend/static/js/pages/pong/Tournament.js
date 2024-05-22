import { Abstract } from "/static/js/components/index.js";
import { PongData } from "/static/js/api/index.js";

export default class extends Abstract{
	constructor(props) {
		super(props);
		this.params = props;
		this.id = this.params.id;
		this.rounds = {"rd1": [], "rd2": [{"id": -1, "user1": "?", "user2": "?"}, {"id": -1, "user1": "?", "user2": "?"}], "rd3": [{"id": -1, "user1": "?", "user2": "?"}]};
		this.winner = "?";
		this.participants = [];
	}

	async addFunctionality() {

		await this.getUsers();

		let counter = 0;
		for (let i = 0; i < 4; i++) {
			const response = await PongData.createMatch({
				"user1": this.participants[counter],
				"user2": this.participants[counter + 1],
				"tournament": this.id
			});

			if (response === -1) {
				console.log("Error creating match.");
					return false;
			}
			
			let match = {
				"id": response,
				"user1": this.participants[counter].username,
				"user2": this.participants[counter + 1].username,
				"winner": ''
			}
			this.rounds.rd1.push(match);
			counter = counter + 2;
		}

		console.log("Round 1: ", this.rounds);

		const tournamentBracket = document.getElementById('tournament-bracket');

		tournamentBracket.innerHTML = this.showBracket();
	}

	async getUsers() {
		const allTournamentUsers = await PongData.getTournamentUserById(this.id);
		allTournamentUsers.data.forEach((obj) => {
			this.participants.push(obj.user);
		});
	}

	showBracket() {
		let content = '';
		
		let bracket = `<div class='bracket'>
							<div class='round'>
								<div class="match">
									<div class="team">${this.rounds.rd1[0].user1}</div>
									<div class="team">${this.rounds.rd1[0].user2}</div>
								</div>
								<div class="match">
									<div class="team">${this.rounds.rd1[1].user1}</div>
									<div class="team">${this.rounds.rd1[1].user2}</div>
								</div>
								<div class="match">
									<div class="team">${this.rounds.rd1[2].user1}</div>
									<div class="team">${this.rounds.rd1[2].user2}</div>
								</div>
								<div class="match">
									<div class="team">${this.rounds.rd1[3].user1}</div>
									<div class="team">${this.rounds.rd1[3].user2}</div>
								</div>
							</div>
							<div class='round'>
								<div class="match">
									<div class="team">${this.rounds.rd2[0].user1}</div>
									<div class="team">${this.rounds.rd2[0].user2}</div>
								</div>
								<div class="match">
									<div class="team">${this.rounds.rd2[1].user1}</div>
									<div class="team">${this.rounds.rd2[1].user2}</div>
								</div>
							</div>
							<div class='round'>
								<div class="match">
									<div class="team">${this.rounds.rd3[0].user1}</div>
									<div class="team">${this.rounds.rd3[0].user2}</div>
								</div>
							</div>
							<div class='round'>
								<div class="team-winner">${this.winner}</div>
							</div>
						</div>`;
		content += bracket;

		let startBtn = `<a id="start-match-button" href="${this.mode === 'single' ? '/pong/single/match/' + this.matchId : '/pong/tournament/match/' + this.rounds.rd1[0].id}" data-link>
							${i18next.t("pong.startGame")}
						</a>`;
		
		content += startBtn;

		return content;
	}

	async getHtml() {
		return `
		<h1 class="mb-4">
				${i18next.t("pong.title")}
		</h1>
		<div id="tournament-bracket" class="d-flex flex-column mt-2" >
		  </div>
	  </div>
		`;
	}
}