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
		this.user = await Users.get(2);
		if (!this.user.success)
			return errorMessage;

		var totalScore = 0;
	
		this.Matches = await Matches.getAllById(2);
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
				${i18next.t("Personal Dashboard")} - ${this.user.data.username}
			</h1>
			
			<div class="dashboard">
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
						<tr>
							<td colspan="6" class="text-center">${i18next.t("Total Matches: ")}${this.Matches.data.length} with ${this.Matches.data.filter(game => game.has_finished !== true).length} Matches Canceled</td>
						</tr>
						${this.Matches.data
							.filter(game => game.has_finished !== false)
							.map(game => {
								this.Matches.data.forEach(game => {
								});
								return `
									<tr>
										<th scope="row">${game.id}</th>
										<td>${game.user1.username}</td>
										<td>${game.winner.username}</td>
										<td>${game.score}</td>
									</tr>
								`;
							})
						}
					</tbody>
					<tbody class="table-group-divider" style="border-top-color: #6c757d">
						<tr>
							<td colspan="6" class="text-center">${i18next.t("Total Wins: ")}${totalScore}</td>
						</tr>
					</tbody>
				</table>
			</div>
		`;
	}
}
