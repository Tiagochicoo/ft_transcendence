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

	await PongData.updateMatch({"matchId": this.matchId, "wasAccepted": true });

    let game = new Game(match.data, this.mode);
    game.draw();
  }

  async getHtml() {
	
    return `
		<h1 class="mb-4">
				${i18next.t("pong.title")}
		</h1>
			<div class="d-flex flex-row justify-content-around" id="pong-container">
				<div class="game-area">
					<div id="pong" tabindex="1" class="d-flex flex-column align-items-center m-4">
						<div class="d-flex flex-column align-items-center">
							<canvas id="canvas" class="bg-dark"></canvas>
						</div>
						<div class="d-flex justify-content-around mt-2" style="width: 100%;">
							<button class="pong-buttons" id="start-btn" type="button"> ${i18next.t("pong.buttons.start")}</button>
							<button class="pong-buttons" id="pause-btn" type="button"> ${i18next.t("pong.buttons.pause")}</button>
							<button class="pong-buttons" id="restart-btn" type="button"> ${i18next.t("pong.buttons.restart")}</button>
						</div>
					</div>
				</div>
			</div>

		<div class="modal fade" tabindex="-1" role="dialog" id="message-modal">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-body">
						<h5 id="message"></h5>
					</div>
					<div class="modal-footer">
						<button type="button" id="message-modal-close" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
		`;
  }
}

