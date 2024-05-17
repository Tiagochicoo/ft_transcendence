import { Abstract } from "/static/js/components/index.js";
import { isLoggedIn, getUserIDFromToken, redirectToLogin } from "/static/js/services/authService.js";
import { Friends, PongData, User } from "/static/js/api/index.js";


export default class extends Abstract {
  constructor(props) {
    super(props);
    this.params = props;
	// this data will be fetched from database using logged user_id
	// this.friends = ['Will', 'Joe', 'Jeff', 'John', 'Eva', 'Hannah', 'Diana', 'Alex', 'Tyna', 'Bob', 'Wendy', 'Martha'];
	this.friends = [];
	this.participants = [];

	// it could be better manipulated if included in a global state!
	let url = window.location.toString();
	if (url.indexOf('single') > 0) this.mode = 'single';
	else if (url.indexOf('tournament') > 0) this.mode = 'tournament';
  }

  async addFunctionality() {

	// here we will retrieve user information using the id retrieved from localStorage with getUserIDFromToken();
	// const user = await User.getUser(getUserIDFromToken());
	const user = await User.getUser(1);
	this.participants.push(user);

	console.log(await User.getUserList());

	this.friends = await Friends.getAllFriends();

	const setupArea = document.getElementById('setup-area');
	setupArea.innerHTML = this.showListOfFriends();

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

  showListOfFriends() {
	
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
		setupArea.innerHTML = this.enableStartGame();
		this.storeMatch();
	}
  }

  startTournament(setupArea) {
	// include a loader to wait for the response. A friend can accept or decline the invitation. 
	// If it was accepted, we show the start button, if it was not, we must show a notification and allow the user to choose another friend.
	// Depending on socket connection
	setupArea.innerHTML = this.enableStartGame();
  }

  enableStartGame() {
	let startBtn = `<a id="start-match-button" href="${this.mode === 'single' ? '/pong/single/match' : '/pong/tournament/match'}" data-link>
						${i18next.t("pong.startGame")}
					</a>`;

	return startBtn;
  }

  storeMatch() {
	const startGameBtn = document.getElementById('start-match-button');
	startGameBtn.addEventListener("click", () => {
		console.log("Clicked start button");
		const data = {
			"user1": this.participants[0],
			"user2": this.participants[1]
		};
		PongData.createMatch(data);
	})
  }

  async getHtml() {
	// if (!isLoggedIn()) {
	// 	redirectToLogin();
	// 	return '';
	// }

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
