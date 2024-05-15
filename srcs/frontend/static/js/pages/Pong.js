import { isLoggedIn, getUserIDFromToken, redirectToLogin } from "../services/authService.js";
import { Abstract } from "/static/js/components/index.js";

export default class extends Abstract {
	constructor(props) {
	  super(props);
  
	  this.params = props;
	}
  
	async addFunctionality() {
		console.log(isLoggedIn());
	  const token = localStorage.getItem('accessToken');
	  if (!token) {
		console.log("No token found.");
		redirectToLogin();
	  }
	  else {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			console.log("Payload: " + payload);
			console.log("Id: " + payload.user_id);
		} catch(e) {
			console.error('Invalid token');
		}
	  }
	}
  
	async getHtml() {
	  return `
		  <h1 class="mb-4">
				  ${i18next.t("pong.title")}
		  </h1>
		  <div class="d-flex justify-content-around mt-2" >
		  	<div class="d-flex flex-column">
				<img src="/static/images/single-match.jpg" class="mode-images" >
				<a id="single-match-button" href="/pong/single/setup" data-link>
					${i18next.t("pong.singleMatch")}
				</a>
			</div>
			<div class="d-flex flex-column">
				<img src="/static/images/tournament.jpg" class="mode-images">
				<a id="tournament-button" href="/pong/tournament/setup" data-link>
				${i18next.t("pong.tournament")}
				</a>
			</div>
		</div>
		  `;
	}
  }
  
