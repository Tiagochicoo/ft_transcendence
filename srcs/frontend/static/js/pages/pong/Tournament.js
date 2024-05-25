import { Abstract } from "/static/js/components/index.js";
import { PongData } from "/static/js/api/index.js";
import { navigateTo } from "/static/js/services/index.js";

export default class extends Abstract{
	constructor(props) {
		super(props);
		this.params = props;
		this.id = this.params.id;
		this.rounds = [];
		this.matches = [];
		this.winner = "?";
		this.participants = [];
	}

	async addFunctionality() {

		await this.getUsers();
		await this.createRounds();
		
		// to assure it will call API just once at the beginning and at the end of the tournament
		if (this.matches.length === 1) {
			await PongData.updateTournament({
				"id": this.id,
				"hasStarted": true
			});
		} else if (this.matches.length === 7) {
			await PongData.updateTournament({
				"id": this.id,
				"winner": this.participants.filter((user) => user.username === this.winner)[0].id,
				"hasFinished": true
			});
		}
		
		
		const tournamentBracket = document.getElementById('tournament-bracket');
		
		tournamentBracket.innerHTML = this.showBracket();
		
		if (this.winner === '?') {
			const startBtn = document.getElementById('start-match-button');
			startBtn.addEventListener("click", async () => {
				let nextMatch = this.rounds.filter((match) => match.user1 !== '?' && match.winner === '?')[0];
				let id = await this.getMatchId(nextMatch);
				if (id !== -1) navigateTo(`/pong/tournament/match/${id}`);
			});
		}
		
	}

	async getMatchId(match) {
		const id = await PongData.createMatch({
			"user1": this.participants.filter((user) => user.username === match.user1)[0],
			"user2": this.participants.filter((user) => user.username === match.user2)[0],
			"tournament": this.id
		});

		if (id === -1) console.log("Error creating match");
		return id;
	}

	// Users and matches are always being sorted to assure that we are checking for them in the same order everytime we pass through this point

	async getUsers() {
		const allTournamentUsers = await PongData.getTournamentUserById(this.id);
		allTournamentUsers.data.forEach((obj) => {
			this.participants.push(obj.user);
		});
		this.participants.sort((a, b) => a.id - b.id);
	}

	async getMatches() {
		const allMatches = await PongData.getAllMatchesFromTournament(this.id);
		if (allMatches.data.length > 0) {
			this.matches = [...allMatches.data];
			this.matches.sort((a, b) => a.id - b.id);
		}
	}
	
	async createRounds() {
		await this.getMatches();

		let k = 0; // to check for players that has passed to round 2
		for (let i = 0; i < 7; i++) {
			if (i < 4) {
				let j = i * 2; // to get players from list of users when they were not included yet on any match on database
				this.rounds.push({
					"user1": this.matches.length > i ? this.matches[i].user1.username : this.participants[j].username,
					"user2": this.matches.length > i ? this.matches[i].user2.username : this.participants[j + 1].username,
					"winner": this.matches.length > i ? this.matches[i].winner.username : '?'
				});
			} else {
				this.rounds.push({
					"user1": this.rounds[k].winner,
					"user2": this.rounds[k + 1].winner,
					"winner": this.matches.length > i ? this.matches[i].winner.username : '?'
				});
				k = k + 2;
			}
		}

		this.winner = this.rounds[6].winner;
	}


	showBracket() {
		let content = '';
		
		let bracket = `<div class='bracket'>
							<div class='round'>
								<div class="match">
									<div class="player">${this.rounds[0].user1}</div>
									<div class="player">${this.rounds[0].user2}</div>
								</div>
								<div class="match">
									<div class="player">${this.rounds[1].user1}</div>
									<div class="player">${this.rounds[1].user2}</div>
								</div>
								<div class="match">
									<div class="player">${this.rounds[2].user1}</div>
									<div class="player">${this.rounds[2].user2}</div>
								</div>
								<div class="match">
									<div class="player">${this.rounds[3].user1}</div>
									<div class="player">${this.rounds[3].user2}</div>
								</div>
							</div>
							<div class='round'>
								<div class="match">
									<div class="player">${this.rounds[4].user1}</div>
									<div class="player">${this.rounds[4].user2}</div>
								</div>
								<div class="match">
									<div class="player">${this.rounds[5].user1}</div>
									<div class="player">${this.rounds[5].user2}</div>
								</div>
							</div>
							<div class='round'>
								<div class="match">
									<div class="player">${this.rounds[6].user1}</div>
									<div class="player">${this.rounds[6].user2}</div>
								</div>
							</div>
							<div class='round'>
								<div class="winner"><p>${i18next.t("pong.winner")}</p>${this.winner}</div>
							</div>
						</div>`;
		
		content += bracket;

		let startBtn = `<button id="start-match-button" type="button">
							${i18next.t("pong.startGame")}
						</button>`;
		
		// if tournament is over, that is no reason to show this button
		if (this.winner === '?') content += startBtn;

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