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
		
		// to assure it will call API just once
		if (this.matches.length === 1) {
			await PongData.updateTournament({
				"id": this.id,
				"hasStarted": true
			});
		} else if (this.matches.length === 7) {
			await PongData.updateTournament({
				"id": this.id,
				"winner": this.participants.filter((user) => user.username === this.winner)[0],
				"hasFinished": true
			});
		}
		
		console.log("Rounds: ", this.rounds);
		
		const tournamentBracket = document.getElementById('tournament-bracket');
		
		tournamentBracket.innerHTML = this.showBracket();
		console.log("Participants: ", this.participants);
		
		
		const startBtn = document.getElementById('start-match-button');
		startBtn.addEventListener("click", async () => {
			let nextMatch = this.rounds.filter((match) => match.user1 !== '?' && match.winner === '?')[0];
			console.log("This match: ", nextMatch);
			let id = await this.getMatchId(nextMatch);
			navigateTo(`/pong/tournament/match/${id}`)
		});
		
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

	async getUsers() {
		const allTournamentUsers = await PongData.getTournamentUserById(this.id);
		allTournamentUsers.data.forEach((obj) => {
			this.participants.push(obj.user);
		});
		this.participants.sort((a, b) => a.id - b.id);
		console.log("sorted participants: ", this.participants);
	}

	async getMatches() {
		console.log("Getting matches: ");
		const allMatches = await PongData.getAllMatchesFromTournament(this.id);
		console.log(allMatches.data);
		console.log(allMatches.data.length);
		if (allMatches.data.length > 0) {
			this.matches = [...allMatches.data];
			this.matches.sort((a, b) => a.id - b.id);
			console.log("SORTED MTCHES: ", this.matches);
		}
	}
	
	async createRounds() {
		await this.getMatches();	
		console.log("Matchs: ", this.matches);
		if (this.matches.length > 0) {
			for (const [index, match] of Object.entries(this.matches)) {
				this.rounds.push({
					"user1": match.user1.username,
					"user2": match.user2.username,
					"winner": match.has_finished ? match.winner.username : '?'
				});
			}
		}
		console.log(this.rounds);
		console.log(this.rounds.length);
		
		if (this.rounds.length < 4) {
			for (let i = this.rounds.length; i < 4; i++) {
				console.log("i: ", i);
				let index = i * 2;
				this.rounds.push({
					"user1": this.participants[index].username,
					"user2": this.participants[index + 1].username,
					"winner": '?'
				});
			}
		}
		console.log(this.rounds);
		console.log(this.rounds.length < 6);

		if (this.rounds.length < 6) {
			console.log("Creating match 4 and 5: ");
			console.log("from rounds: ", this.rounds[0], this.rounds[1]);
			let index = 0;
			for (let i = this.rounds.length; i < 6; i++) {
				this.rounds.push({
					"user1": this.rounds[index].winner,
					"user2": this.rounds[index + 1].winner,
					"winner": '?'
				});
				index = index + 2;
			}
		}
		console.log(this.rounds);
		console.log(this.matches.length);

		if (this.rounds.length === 6) {
			this.rounds.push({
				"user1": this.rounds[4].winner,
				"user2": this.rounds[5].winner,
				"winner": '?'
			});
		} else if (this.rounds.length === 7) {
			this.winner = this.rounds[6].winner;
		} else {
			for (let i = this.rounds.length; i < 7; i++) {
				this.rounds.push({
					"user1": '?',
					"user2": '?',
					"winner": '?'
				});
			}
		}
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
								<div class="winner"><p>WINNER</p>${this.winner}</div>
							</div>
						</div>`;
		
		content += bracket;

		let startBtn = `<button id="start-match-button" type="button">
							${i18next.t("pong.startGame")}
						</button>`;
		
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