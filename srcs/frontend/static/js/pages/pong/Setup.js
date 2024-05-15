import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
  constructor(props) {
    super(props);
    this.params = props;
	this.friends = ['Will', 'Joe', 'Jeff', 'John'];
	this.opponent;
	
  }

  async addFunctionality() {
	const setupArea = document.getElementById('setup-area');
	
	setupArea.innerHTML = this.showListOfFriends();
	const singleMatchInvitationBtn = document.querySelector('#single-match-invitation-btn');
	const availableOpponents = document.querySelectorAll('input[name="friends"]');
	singleMatchInvitationBtn.addEventListener("click", () => {
		for (const opponent of availableOpponents) {
			if (opponent.checked) {
				this.opponent = opponent.value;
				setupArea.innerHTML = this.enableStartGame();
				break;
			}
		}
		if (!this.opponent) console.log("include some validation here");
	});
  }

  showListOfFriends() {
	let list = `<div>
					<p>Select your opponent:</p>`;

	this.friends.forEach((friend, index) => {
		list += `<div class="form-check">
					<input class="form-check-input" type="radio" name="friends" value="${friend}" id="${index}">
					<label class="form-check-label" for="friends">
					${friend}
					</label>
				</div>`;
	});

	list += `<button id="single-match-invitation-btn">Invite</button>
			 </div>`;

	return list;
  }

  enableStartGame() {
	let startBtn = `<a id="start-match-button" href="/pong/single/match" data-link>
						Start Game
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