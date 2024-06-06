import { Abstract } from "/static/js/components/index.js";
import { Game } from "/static/js/pages/pong/index.js";
import { PongData } from "/static/js/api/index.js";
import { invalidPage } from "/static/js/services/index.js";

export default class extends Abstract {
	constructor(props) {
		super(props);

		this.params = props;
		this.matchId = this.params.matchId;

		this.fieldsData = [
			{ key: 'textColor', defaultValue: '#14dd50' },
			{ key: 'backgroundColor', defaultValue: '#212529' },
			{ key: 'figuresColor', defaultValue: '#14dd50' },
		];

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

				// Set the color
				this.fieldsData.forEach(({ key }) => {
					const inputField = document.querySelector(`#pong #${key}`);
					if (inputField) {
						localStorage.setItem(key, inputField.value);
						inputField.addEventListener("input", (e) => {
							localStorage.setItem(key, inputField.value);
						});
					}
				});

				// Set the reset button
				const resetColorsButton = document.querySelector(`#pong #resetColors`);
				if (resetColorsButton) {
					resetColorsButton.addEventListener("click", (e) => {
						this.fieldsData.forEach(({ key, defaultValue }) => {
							localStorage.setItem(key, defaultValue);
							const inputField = document.querySelector(`#pong #${key}`);
							if (inputField) {
								inputField.value = defaultValue;
							}
						});
					});
				}

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
			<h1 class="mb-3">
				${i18next.t("pong.title")}
			</h1>

			<div class="pong-content mb-4">
				${i18next.t("pong.content")}
			</div>

			<div id="pong" class="d-flex flex-column">
				<div class="canvas-wrapper" class="d-flex flex-column">
					<canvas id="canvas" width="600" height="400" class="bg-dark w-100" tabindex="1"></canvas>

					<div class="canvas-actions-wrapper d-flex justify-content-between flex-wrap gap-2 mt-2 mt-md-3">
						<button class="btn btn-secondary py-3 py-md-4" data-game-action="up" tabindex="1">
							${i18next.t("pong.buttons.up")}
						</button>

						<button class="btn btn-secondary py-3 py-md-4" data-game-action="attack" tabindex="1">
							${i18next.t("pong.buttons.attack")}
						</button>

						<button class="btn btn-secondary py-3 py-md-4" data-game-action="down" tabindex="1">
							${i18next.t("pong.buttons.down")}
						</button>
					</div>
				</div>

				<div id="pong-end-btn">
				</div>

				<div class="d-flex flex-column align-items-start">
					<h2 class="mt-4 mb-3">
						${i18next.t("pong.dashboard.title")}
					</h2>

					<form class="d-flex flex-column">
						${this.fieldsData.map(({ key, defaultValue }) => `
							<label for="${key}" class="form-label d-flex align-items-center gap-1">
								<input type="color" class="form-control form-control-color" id="${key}" value="${localStorage.getItem(key) ? localStorage.getItem(key) : defaultValue}" tabindex="1">
								<span>
									${i18next.t(`pong.dashboard.${key}`)}
								</span>
							</label>
						`).join("")}
					</form>

					<button id="resetColors" class="btn btn-secondary mt-2" tabindex="1">
						${i18next.t("pong.buttons.resetColors")}
					</button>
				</div>
			</div>
		`;
	}
}

