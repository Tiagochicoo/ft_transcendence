import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
	constructor(props) {
	  super(props);
  
	  this.params = props;
	}
  
	async addFunctionality() {
	  
	}
  
	async getHtml() {
	  return `
		  <h1 class="mb-4">
				  ${i18next.t("pong.title")}
		  </h1>
		  <div class="buttons d-flex justify-content-around mt-2" >
		  	<div class="d-flex flex-column">
				<img src="/static/images/single-match.jpg" class="mode-images" >
				<a id="single-match-button" href="/pong/match" data-link>
					Single match
				</a>
			</div>
			<div class="d-flex flex-column">
				<img src="/static/images/tournament.jpg" class="mode-images">
				<a id="tournament-button" href="/pong" data-link>
					Tournament
				</a>
			</div>
		</div>
		  `;
	}
  }
  
