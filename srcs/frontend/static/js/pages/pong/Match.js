import { Abstract } from "/static/js/components/index.js";
import { Game } from "/static/js/pages/pong/index.js";

export default class extends Abstract {
  constructor(props) {
    super(props);

    this.params = props;
  }

  async addFunctionality() {
    //it is hardcoded but should be properties being received by app management
    let game = new Game("ansilva-", "tpereira");
    game.draw();
  }

  async getHtml() {
    return `
		<h1 class="mb-4">
				${i18next.t("pong.title")}
		</h1>
			<div class="d-flex flex-row justify-content-around">
				<div class="game-area">
					<div id="pong" tabindex="1" class="d-flex flex-column align-items-center m-4">
						<div class="d-flex flex-column align-items-center">
							<canvas id="canvas" width="600" height="400" class="bg-dark"></canvas>
						</div>
						<div class="d-flex justify-content-around mt-2" style="width: 600px;">
							<button class="pong-buttons" id="start-btn" type="button"> ${i18next.t("pong.buttons.start")}</button>
							<button class="pong-buttons" id="pause-btn" type="button"> ${i18next.t("pong.buttons.pause")}</button>
							<button class="pong-buttons" id="restart-btn" type="button"> ${i18next.t("pong.buttons.restart")}</button>
						</div>
					</div>
				</div>
				<div class="chat-area">
					<p>Chat appears here!</p>
					<img src="https://cdn5.vectorstock.com/i/1000x1000/58/09/concept-online-chat-man-and-woman-vector-26235809.jpg" style="width: 50%;">
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
