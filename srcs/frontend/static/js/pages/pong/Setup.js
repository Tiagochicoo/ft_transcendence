import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
  constructor(props) {
    super(props);
    this.params = props;
	// this data will be fetched from database using logged user_id
	this.friends = ['Will', 'Joe', 'Jeff', 'John', 'Eva', 'Hannah', 'Diana', 'Alex', 'Tyna', 'Bob', 'Wendy', 'Martha'];
	this.opponent;
	let url = window.location.toString();
	if (url.indexOf('single') > 0) this.mode = 'single';
	else if (url.indexOf('tournament') > 0) this.mode = 'tournament';
  }

  async addFunctionality() {
	const setupArea = document.getElementById('setup-area');
	setupArea.innerHTML = this.showListOfFriends();

	const singleMatchInvitationBtn = document.querySelector('#single-match-invitation-btn');

	singleMatchInvitationBtn.style.display = 'none';
	
	for (let opponent of document.querySelectorAll('input[name="friends"]')) {
		opponent.addEventListener("input", (event) => {
			this.opponent = event.target.value;
			singleMatchInvitationBtn.style.display = 'block';
		});
	}

	singleMatchInvitationBtn.addEventListener("click", () => {
		if (this.opponent) {
			// include a loader to wait for the response. A friend can accept or decline the invitation. 
			// If it was accepted, we show the start button, if it was not, we must show a notification and allow the user to choose another friend.
			// Depending on socket connection
			setupArea.innerHTML = this.enableStartGame();
		}
	});
  }

  showListOfFriends() {
	let list = `<div>
					<p>${i18next.t("pong.invitationMessage")}</p>`;

	this.friends.forEach((friend, index) => {
		list += `<div class="form-check">
					<input class="form-check-input" type="${this.mode === 'single' ? 'radio' : 'checkbox'}" name="friends" value="${friend}" id="${index}">
					<label class="form-check-label" for="friends">
					${friend}
					</label>
				</div>`;
	});

	list += `<button id="single-match-invitation-btn">${i18next.t("pong.invitationBtn")}</button>
			 </div>`;

	return list;
  }

  enableStartGame() {
	let startBtn = `<a id="start-match-button" href="/pong/single/match" data-link>
						${i18next.t("pong.startGame")}
					</a>`;

	return startBtn;
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
