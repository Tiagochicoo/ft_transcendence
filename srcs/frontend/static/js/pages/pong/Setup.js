import { Abstract } from "/static/js/components/index.js";
import MatchesSection from "/static/js/components/Sidebar/MatchesSection.js";
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
	this.user;

	// it could be better manipulated if included in a global state!
	let url = window.location.toString();
	if (url.indexOf('single') > 0) this.mode = 'single';
	else if (url.indexOf('tournament') > 0) this.mode = 'tournament';
  }

  async addFunctionality() {

	Users.get(USER_ID).then((response) => this.user = response.data);
	
	this.friends = await Friends.getAllFriends();

	const setupArea = document.getElementById('setup-area');
	setupArea.innerHTML = this.showListOfFriends();

	let gameColor = document.querySelector('#gameColor');
	console.log("game color before: ", gameColor.value);
	localStorage.setItem('gameColor', gameColor.value);
	gameColor.addEventListener("input", (event) => {
		console.log("game color: ", gameColor.value);
		localStorage.setItem('gameColor', gameColor.value);
	});

	if (this.checkAvailability) {
		const invitationBtn = document.querySelector('#invitation-btn');

		let checkGroup = document.querySelectorAll('input[name="friends"]');
		
		for (let opponent of checkGroup) {
			opponent.addEventListener("input", (event) => {
				if (this.mode === 'single') {
					this.participants[0] = this.user;
					this.participants[1] = this.friends.filter((friend => friend.username === event.target.value))[0];
					invitationBtn.style.display = 'block';
				} else if (this.mode === 'tournament') {

					let limit = 7;

					for (let i = 0; i < checkGroup.length; i++) {
						checkGroup[i].onclick = function() {
							let checkedCount = 0;
							for (let j = 0; j < checkGroup.length; j++) {
								checkedCount += (checkGroup[j].checked) ? 1 : 0;
							}
							if (checkedCount > limit) {
								document.getElementById('invitation-error').innerHTML = `${i18next.t("pong.invitationError")}`;
								checkGroup[i].checked = false;
							} else {
								document.getElementById('invitation-error').innerHTML = "";
							}
						}
					}
				}
			});
		}
	
		invitationBtn.addEventListener("click", () => {
			if (this.mode === 'single') this.startSingleMatch(setupArea);
			else if (this.mode === 'tournament') {
				this.participants = [];
				this.participants.push(this.user);
				for (let opponent of checkGroup) {
					if (opponent.checked) {
						this.participants.push(this.friends.filter((friend) => friend.id == opponent.id)[0]);
					}
 				}
				if (this.participants.length === 8) this.startTournament(setupArea);
				else document.getElementById('invitation-error').innerHTML = `${i18next.t("pong.invitationError")}`;
			}
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
					<label class="form-check-label" for="${friend.id}">
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
			if (response) navigateTo(`/pong/tournament/${this.tournamentId}/rounds`);
	}).catch((error) => {
		console.log(error.message);
			setupArea.innerHTML = `<p style="color: red;">${i18next.t("pong.createError")}</p>`;
	})
	
  }

  async storeMatch() {
	const response = await MatchesSection.createMatch(this.participants[1]?.id);
	this.matchId = response.success ? response.data.id : -1;
	return response.success;
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

	return this.tournamentId === -1 ? false : true;
  }

  enableStartGame() {

	let startBtn = `<a id="start-match-button" href="/pong/single/match/${this.matchId}" data-link>
						${i18next.t("pong.startGame")}
					</a>`;
	

	return startBtn;
  }

  async getHtml() {

	return `
		<h1 class="mb-4">
				${i18next.t("pong.title")}
		</h1>

		<div class="d-flex justify-content-around">
			<div id="setup-area" class="d-flex flex-column mt-2" >
			</div>
			<div class="mt-2">
				<form>
					<label for="gameColor" class="form-label mb-3">Select a game color style:</label>
					<input type="color" class="form-control form-control-color" id="gameColor" value="#14dd50" title="Choose a color">
				</form>
			</div>
		</div>
		
	  </div>
		`;
  }
}
