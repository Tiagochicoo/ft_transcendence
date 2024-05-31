import { Abstract } from "/static/js/components/index.js";
import { Game } from "/static/js/pages/pong/index.js";
import { PongData } from "/static/js/api/index.js";
import { invalidPage } from "/static/js/services/index.js";

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
		try {
			const match = await PongData.getMatchById(this.matchId);
			if (match.success) {
				const game = new Game(match.data, this.mode, match.success);

				if (match.data.user1.id !== USER_ID && match.data.user2.id !== USER_ID) {
					throw new Error('Not invited');
				} else if (match.data.has_finished) {
					game.drawEnd({
						width: 600,
						height: 400,
						meta: {
							winner_id: match.data.winner.id
						}
					});
				} else {
					game.drawGame();
				}
			} else {
				throw new Error('Not found');
			}
		} catch(e) {
			invalidPage();
		}
	}

	async getHtml() {
		return `
			<h1 class="mb-4">
				${i18next.t("pong.title")}
			</h1>

			<div id="pong" tabindex="1" class="d-flex flex-column align-items-center">
				<canvas id="canvas" width="600" height="400" class="bg-dark"></canvas>
			</div>

			<div id="pong-end-btn"></div>
			</div>
		`;
	}
}

