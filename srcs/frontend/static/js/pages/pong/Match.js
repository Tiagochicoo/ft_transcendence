import { Abstract } from "/static/js/components/index.js";
import { Game } from "/static/js/pages/pong/index.js";
import { PongData } from "/static/js/api/index.js";

export default class extends Abstract {
  constructor(props) {
    super(props);

    this.params = props;
	this.matchId = this.params.matchId;

	// it could be better manipulated if included in a global state!
	let url = window.location.toString();
	if (url.indexOf('single') > 0) this.mode = 'single';
	else if (url.indexOf('tournament') > 0) this.mode = 'tournament';
  }

  async addFunctionality() {

	const match = await PongData.getMatchById(this.matchId);
	const gameDiv = document.getElementById('pong');
	
	if (match.success) {
		if (match.data.has_finished) {
			gameDiv.innerHTML = this.showGame(false, `${i18next.t("pong.matchAlreadyFinished")}`);
			
		} else if (match.data.user1.id !== USER_ID && match.data.user2.id !== USER_ID) {
			gameDiv.innerHTML = this.showGame(false, `${i18next.t("pong.userNotInvited")}`);
		} else {
			gameDiv.innerHTML = this.showGame(true, '');
			const game = new Game(match.data, this.mode, match.success);
			game.drawGame();
		}
	} else {
		gameDiv.innerHTML = this.showGame(false, `${i18next.t("pong.noMatchFound")}`);
	}
  }

  showGame(status, message) {
	return status ? '<canvas id="canvas" width="600" height="400" class="bg-dark"></canvas>' : `<p id="match-error">${message}</p>`;
  }

  async getHtml() {
	
    return `
		<h1 class="mb-4">
			${i18next.t("pong.title")}
		</h1>

		<div id="pong" tabindex="1" class="d-flex flex-column align-items-center">
		</div>

		<div id="pong-end-btn"></div>
		</div>
	`;
  }
}

