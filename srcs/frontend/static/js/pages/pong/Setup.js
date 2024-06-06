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
		this.limit = 7;
		this.user;

		// it could be better manipulated if included in a global state!
		let url = window.location.toString();
		if (url.indexOf('single') > 0) this.mode = 'single';
		else if (url.indexOf('tournament') > 0) this.mode = 'tournament';

		this.isSingleMode = (this.mode == 'single');
	}

	async addFunctionality() {
		if (!this.checkAvailability) {
			return;
		}

		const form = document.querySelector('form#pong-setup');
		if (!form) {
			return;
		}

		const checkGroup = document.querySelectorAll('#pong-setup input');
		for (const opponent of checkGroup) {
			opponent.addEventListener("input", (event) => {
				if (this.isSingleMode) {
					for (const element of checkGroup) {
						if (element.id != event.target.id) {
							element.checked = false;
						} else {
							element.checked = true;
						}
					}
				} else {
					let count = 0;
					for (const element of checkGroup) {
						if (element.checked) {
							count++;
						}
					}
					if (count > this.limit) {
						event.target.checked = false;
						const invitationBtn = document.querySelector('#invitation-error');
						if (invitationBtn) {
							invitationBtn.innerHTML = `${i18next.t("pong.invitationError")}`;
						}
					}
				}
			});
		}

		form.addEventListener("submit", (event) => {
			event.preventDefault();

			this.participants = [];
			for (const opponent of checkGroup) {
				if (opponent.checked) {
					this.participants.push(parseInt(opponent.id));
				}
			}

			if (this.isSingleMode) {
				this.startSingleMatch();
			} else {
				this.startTournament();
			}
		});
	}

	checkAvailability() {
		if ((this.isSingleMode && this.friends.length === 0) ||
			(!this.isSingleMode && this.friends.length < 7)) {
				return false;
			}
		return true;
	}

	async startSingleMatch() {
		if (this.participants.length === 1) {
			await MatchesSection.matchCreate(this.participants[0]);
		}
	}

	async startTournament() {
		if (this.participants.length === 7) {
			await TournamentsSection.tournamentCreate(this.participants);
		} else {
			const invitationBtn = document.querySelector('#invitation-error');
			if (invitationBtn) {
				invitationBtn.innerHTML = `${i18next.t("pong.invitationError")}`;
			}
		}
	}

	async getHtml() {
		this.user = await Users.get(USER_ID).then((response) => response.data);
		this.friends = await Friends.getAllFriends();

		return `
			<h1 class="mb-4">
				${i18next.t("pong.title")}
			</h1>

			<a class="btn btn-secondary mb-4" href="/local-match" data-link>
				${i18next.t('pong.localMatch')}
			</a>

			<div id="setup-area" class="d-flex flex-column">
				${this.checkAvailability() ? `
					<div>
						<p>
							${i18next.t(`pong.${this.isSingleMode ? 'singleMatchInvitationMessage' : 'tournamentInvitationMessage'}`)}
						</p>

						<form id="pong-setup" novalidate>
							${this.friends.map(friend => `
								<div class="form-check">
									<input class="form-check-input" type="${this.isSingleMode ? 'radio' : 'checkbox'}" name="${friend.id}" value="${friend.id}" id="${friend.id}">
									<label class="form-check-label" for="${friend.id}">
										${friend.username}
									</label>
								</div>
							`).join("")}

							<p id="invitation-error" style="color: red;"></p>

							<button type="submit" id="invitation-btn">
								${i18next.t("pong.invitationBtn")}
							</button>
						</form>
					</div>
				` : `
					<p style="color: red;">
						${i18next.t(`pong.${this.isSingleMode ? 'singleMatchNotEnoughFriends' : 'tournamentNotEnoughFriends'}`)}
					</p>
				`}
			</div>
		`;
	}
}
