
import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
	constructor(props) {
	  super(props);
  
	  this.params = props;
	}
  
	async addFunctionality() {}
  
	async getHtml() {

		return `
			<h1 class="mb-4">
				${i18next.t("pong.title")}
			</h1>
			<div class="d-flex flex-column flex-lg-row justify-content-around gap-4 gap-sm-5 gap-lg-3">
				<div class="d-flex flex-column">
					<img src="/static/images/single-match.jpg" alt="Wallpaper inciting competition" class="h-75 w-100 object-fit-cover">
					<a id="single-match-button" href="/pong/single/setup" data-link>
						${i18next.t("pong.singleMatch")}
					</a>
				</div>
				<div class="d-flex flex-column">
					<img src="/static/images/tournament.jpg" alt="Tournament brackets mockup" class="h-75 w-100 object-fit-cover">
					<a id="tournament-button" href="/pong/tournament/setup" data-link>
					${i18next.t("pong.tournament")}
					</a>
				</div>
			</div>
		`;
	}
}
