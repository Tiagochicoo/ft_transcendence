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

    const game = new Game(match.data, this.mode);
    game.drawGame();
  }

  async getHtml() {
	
    return `
		<h1 class="mb-4">
			${i18next.t("pong.title")}
		</h1>

		<div class="d-flex flex-row justify-content-around">
			<div id="pong" tabindex="1" class="d-flex flex-column align-items-center">
				<canvas id="canvas" width="600" height="400" class="bg-dark"></canvas>
			</div>

			<div id="pong-end-btn"></div>
		</div>
	`;
  }
}

