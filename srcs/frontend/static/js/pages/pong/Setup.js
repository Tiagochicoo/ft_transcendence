import { Friends, Users } from "/static/js/api/index.js";
import { Abstract } from "/static/js/components/index.js";
import MatchesSection from "/static/js/components/Sidebar/MatchesSection.js";
import TournamentsSection from "/static/js/components/Sidebar/TournamentsSection.js";

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
		if (!this.checkAvailability) {
			return;
		}

		const invitationBtn = document.querySelector('#invitation-btn');

		let checkGroup = document.querySelectorAll('input[name="friends"]');

		for (let opponent of checkGroup) {
			opponent.addEventListener("input", (event) => {
				if (this.mode === 'single') {
					this.participants[0] = this.user;
					this.participants[1] = this.friends.filter((friend => friend.username === event.target.value))[0];
					if (invitationBtn) {
						invitationBtn.style.display = 'block';
					}
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

		if (invitationBtn) {
			invitationBtn.addEventListener("click", () => {
				if (this.mode === 'single') this.startSingleMatch();
				else if (this.mode === 'tournament') {
					this.participants = [];
					for (let opponent of checkGroup) {
						if (opponent.checked) {
							this.participants.push(this.friends.filter((friend) => friend.id == opponent.id)[0]);
						}
					}
					if (this.participants.length === 7) this.startTournament();
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

	async startSingleMatch() {
		if (this.participants.length == 2) {
			await MatchesSection.matchCreate(this.participants[1]?.id);
		}
	}

	async startTournament() {
		const invitedUserIds = this.participants.map(({ id }) => id);
		await TournamentsSection.tournamentCreate(invitedUserIds);
	}

	async getHtml() {
		await Users.get(USER_ID).then((response) => this.user = response.data);
		this.friends = await Friends.getAllFriends();

		return `
			<h1 class="mb-4">
				${i18next.t("pong.title")}
			</h1>
			<div id="setup-area" class="d-flex flex-column mt-2">
				${this.showListOfFriends()}
			</div>
		`;
	}
}
