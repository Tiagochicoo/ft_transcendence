import { Abstract } from "/static/js/components/index.js";
import { Users } from "/static/js/api/index.js";
import { Matches } from "/static/js/api/index.js";

export default class extends Abstract {
	constructor(props) {
		super(props);
	}

	async addFunctionality() {}


	errorMessage() {
		return `
			<h1>Something went wrong</h1>
		`;
	}

	async getHtml() {
		// fetching data mocked on db.json
		this.user = await Users.get(2);
		if (!this.user.success)
			return errorMessage;

		var totalScore = 0;
	
		this.Matches = await Matches.getAll(2);
		if (!this.Matches.success)
			return errorMessage;
		else
		{
			console.log(this.Matches);
			console.log(this.user);
			for (var i = 0; i < this.Matches.data.length; i++)
			{
				if (this.Matches.data[i].has_finished == true)
				{
					if (this.Matches.data[i].winner.username == this.user.data.username)
					{
						totalScore += 1;
					}
				}
			}
		}

		return `
			<h1>
				${i18next.t("General Dashboard")}
			</h1>
			<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
				<li class="nav-item" role="presentation">
					<button class="nav-link active" id="pills-ranking-tab" data-bs-toggle="pill" data-bs-target="#pills-ranking" type="button" role="tab" aria-controls="pills-ranking" aria-selected="false">${i18next.t("Ranking")}</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="pills-history-tab" data-bs-toggle="pill" data-bs-target="#pills-history" type="button" role="tab" aria-controls="pills-history" aria-selected="true">${i18next.t("History")}</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="pills-graphs-tab" data-bs-toggle="pill" data-bs-target="#pills-graphs" type="button" role="tab" aria-controls="pills-graphs" aria-selected="false">${i18next.t("Graphs")}</button>
				</li>
			</ul>
			<div class="dashboard">
				<div class="tab-content" id="pills-tabContent">

					<!--RANKING TABLE-->

					<div class="tab-pane fade show active" id="pills-ranking" role="tabpanel" aria-labelledby="pills-ranking-tab">
						<h2>${i18next.t("Ranking")}</h2>
						<table class="table table-hover text-center">
							<thead class="table-secondary">
								<tr>
									<!-- Ranking table headers -->
								</tr>
							</thead>
							<tbody class="table-group-divider" style="border-top-color: #6c757d">
								<!-- Render ranking table rows here -->
							</tbody>
						</table>
					</div>


					<!--HISTORY TABLE-->
		
					<div class="tab-pane fade show" id="pills-history" role="tabpanel" aria-labelledby="pills-history-tab">
						<h2>${i18next.t("History")}</h2>
						<table class="table table-hover text-center">
							<thead class="table-secondary">
								<tr>
									<th scope="col">${i18next.t("Match_ID")}</th>
									<th scope="col">${i18next.t("Opponent")}</th>
									<th scope="col">${i18next.t("Winner")}</th>
									<th scope="col">${i18next.t("Score")}</th>
								</tr>
							</thead>
							<tbody class="table-group-divider" style="border-top-color: #6c757d">
								<!-- Render history table rows here -->
							</tbody>
						</table>
					</div>

					
					<!--GRAPHS TABLE-->

					<div class="tab-pane fade" id="pills-graphs" role="tabpanel" aria-labelledby="pills-graphs-tab">
						<h2>${i18next.t("Graphs")}</h2>
					</div>
				</div>
			</div>
		`;
	}
}
