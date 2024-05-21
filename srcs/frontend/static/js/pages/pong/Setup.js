import { Abstract } from "/static/js/components/index.js";
import { Friends, PongData, Users } from "/static/js/api/index.js";
import { navigateTo } from "/static/js/services/index.js";


export default class extends Abstract {
  constructor(props) {
    super(props);
    this.params = props;
	this.friends = [];
	this.participants = [];
	this.matchId = -1;
	this.tournamentId = -1;
	// this.rounds = {"rd1": [], "rd2": [{"id": -1, "user1": "?", "user2": "?"}, {"id": -1, "user1": "?", "user2": "?"}], "rd3": [{"id": -1, "user1": "?", "user2": "?"}]};
	// this.tournamentWinner = "?";
	// it could be better manipulated if included in a global state!
	let url = window.location.toString();
	if (url.indexOf('single') > 0) this.mode = 'single';
	else if (url.indexOf('tournament') > 0) this.mode = 'tournament';
  }

  async addFunctionality() {

	Users.get(USER_ID).then((response) => this.participants.push(response.data));
	
	this.friends = await Friends.getAllFriends();

	const setupArea = document.getElementById('setup-area');
	setupArea.innerHTML = this.showListOfFriends();


	if (this.checkAvailability) {
		const invitationBtn = document.querySelector('#invitation-btn');
		invitationBtn.style.display = 'none';
		
		for (let opponent of document.querySelectorAll('input[name="friends"]')) {
			opponent.addEventListener("input", (event) => {
				if (this.mode === 'single') {
					this.participants[1] = this.friends.filter((friend => friend.username === event.target.value))[0];
					invitationBtn.style.display = 'block';
				} else if (this.mode === 'tournament') {
					if (this.participants.length === 8) document.getElementById('invitation-error').innerHTML = "Only the first 7 selected participants will be invited."
					if (this.participants.length < 8) {
						this.participants.push(this.friends.filter((friend => friend.username === event.target.value))[0]);
					}
					if (this.participants.length === 8) invitationBtn.style.display = 'block';
				}
			});
		}
	
		invitationBtn.addEventListener("click", () => {
			if (this.mode === 'single') this.startSingleMatch(setupArea);
			else if (this.mode === 'tournament') this.startTournament(setupArea);
		});
	}
  }

  checkAvailability() {
	if ((this.mode === 'single' && this.friends.length === 0) ||
		(this.mode === 'tournament' && this.friends.length < 7)) {
			return false;
		}
	return true;
  }

  showListOfFriends() {
	
	if (!this.checkAvailability()) {
		return this.mode === 'single' ? `<p style="color: red;">${i18next.t("pong.singleMatchNotEnoughFriends")}</p>` : `<p style="color: red;">${i18next.t("pong.tournamentNotEnoughFriends")}</p>`;
	}
	
	let list = `<div>
					<p>${this.mode === "single" ? i18next.t("pong.singleMatchInvitationMessage") : i18next.t("pong.tournamentInvitationMessage")}</p>`;

	this.friends.forEach((friend) => {
		list += `<div class="form-check">
					<input class="form-check-input" type="${this.mode === 'single' ? 'radio' : 'checkbox'}" name="friends" value="${friend.username}" id="${friend.id}">
					<label class="form-check-label" for="friends">
					${friend.username}
					</label>
				</div>`;
	});

	list += `<p id="invitation-error" style="color: red;"></p>
			 <button id="invitation-btn">${i18next.t("pong.invitationBtn")}</button>
			 </div>`;

	return list;
  }

  startSingleMatch(setupArea) {
	if (this.participants.length == 2) {
		// include a loader to wait for the response. A friend can accept or decline the invitation. 
		// If it was accepted, we show the start button, if it was not, we must show a notification and allow the user to choose another friend.
		// Depending on socket connection
		this.storeMatch().then((response) => {
			if (response) setupArea.innerHTML = this.enableStartGame();
		}).catch((error) => {
			console.log(error.message);
			setupArea.innerHTML = `<p style="color: red;">${i18next.t("pong.createError")}</p>`;
		});
	}
  }

  startTournament(setupArea) {
	// include a loader to wait for the response. A friend can accept or decline the invitation. 
	// If it was accepted, we show the start button, if it was not, we must show a notification and allow the user to choose another friend.
	// Depending on socket connection
	this.storeTournament().then((response) => {
		// if (response) setupArea.innerHTML = this.enableStartGame(); //navigateTo()
			if (response) navigateTo(`/pong/tournament/${this.tournamentId}/rounds`);
	}).catch((error) => {
		console.log(error.message);
			setupArea.innerHTML = `<p style="color: red;">${i18next.t("pong.createError")}</p>`;
	})
	
  }

  async storeMatch() {
	const data = {
		"user1": this.participants[0],
		"user2": this.participants[1]
	};
	
	this.matchId = await PongData.createMatch(data);
	return this.matchId === -1 ? false : true;
  }

  async storeTournament() {
	const data = {
		"creator": this.participants[0].id
	};

	this.tournamentId = await PongData.createTournament(data);

	// Creating tournament_user to each user
	if (this.tournamentId !== -1) {
		for (const user of this.participants) {
			const response = await PongData.createTournamentUser(
				{
					"tournamentId": this.tournamentId,
					"userId": user.id
				}
			);

			if (!response) {
				console.log("Error creating tournament_user.");
				return false;
			}
		}
	}

	// Creating matches
	// let counter = 0;
	// for (let i = 0; i < 4; i++) {
	// 	const response = await PongData.createMatch({
	// 		"user1": this.participants[counter],
	// 		"user2": this.participants[counter + 1],
	// 		"tournament": this.tournamentId
	// 	});

	// 	if (response === -1) {
	// 		console.log("Error creating match.");
	// 			return false;
	// 	}
		
	// 	let match = {
	// 		"id": response,
	// 		"user1": this.participants[counter].username,
	// 		"user2": this.participants[counter + 1].username,
	// 		"winner": ''
	// 	}
	// 	this.rounds.rd1.push(match);
	// 	counter = counter + 2;
	// }

	// console.log("Round 1: ", this.rounds);

	return this.tournamentId === -1 ? false : true;
  }

  enableStartGame() {
	let content = '';
	if (this.mode === 'tournament') {
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
								<div class="team-winner">${this.tournamentWinner}</div>
							</div>
						</div>`;
		content += bracket;
	}


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
		<div id="setup-area" class="d-flex flex-column mt-2" >
		  </div>
	  </div>
		`;
  }
}
