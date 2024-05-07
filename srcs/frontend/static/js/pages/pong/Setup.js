import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
  constructor(props) {
    super(props);

    this.params = props;
  }

  async addFunctionality() {
	let startButton = document.getElementById('start-match-button');
	console.log(startButton);
  }

  async getHtml() {
	return `
		<h1 class="mb-4">
				${i18next.t("pong.title")}
		</h1>
		<div class="d-flex flex-column mt-2" >
			<p>[Some invitation logic here. We will need know the user logged and have access to a list of user's friends.]</p>
			<div class="d-flex flex-column">
			  <a id="start-match-button" href="/pong/single/match" data-link>
				  Start Game
			  </a>
		  </div>
	  </div>
		`;
  }
}
