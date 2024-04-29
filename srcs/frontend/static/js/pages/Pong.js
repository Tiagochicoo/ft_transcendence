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
		  <div class="buttons d-flex justify-content-around mt-2">
		  	<button id="single-match" type="button" class="btn pong-buttons w-50 m-1 shadow"><a href="/pong/match" data-link>Single match</a></button>
			<button id="tournament" type="button" class="btn pong-buttons w-50 m-1 shadow">Tournament</button>  
		</div>
		  `;
	}
  }
  