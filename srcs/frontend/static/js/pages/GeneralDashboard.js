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
		this.dataUsers = await Users.getAll()
		if (!this.dataUsers.success)
			return errorMessage;
		//console.log(this.dataUser);

		var userScores = [];
		const MatchInfo = [];
		var MatchId = 0;

		for (var i = 0; i < this.dataUsers.data.length; i++) 
		{
			this.Matches = await Matches.getAllById(this.dataUsers.data[i].id);
			if (!this.Matches.success)
				return errorMessage;
			else 
			{
				var TotalRankingScore = 0;
				if (this.Matches.data.length > 0)
				{
					var opponent;
					for (var x = 0; x < this.Matches.data.length; x++)
					{
						if (this.Matches.data[x].has_finished === true) 
						{
							if (this.Matches.data[x].winner.username == this.dataUsers.data[i].username)
							{
								TotalRankingScore += 5;
								console.log(this.Matches.data[x]);
								if (this.Matches.data[x].winner.username == this.Matches.data[x].user2.username)
									opponent = this.Matches.data[x].user1.username
								else
									opponent = this.Matches.data[x].user2.username
								MatchInfo.push({
									match_id: MatchId++,
									winner: this.Matches.data[x].winner.username,
									opponent: opponent,
									score_opponent: 5 - this.Matches.data[x].score,
									score: this.Matches.data[x].score
								});
							}
							else
								TotalRankingScore += (5 - this.Matches.data[x].score)
						}
					}
				}
				userScores.push(TotalRankingScore);
			}
		}
		
		const usersWithScores = this.dataUsers.data.filter(user => user.username !== null)
		.map((user, index) => ({
			user: user,
			score: userScores[index]
		}));

		usersWithScores.sort((a, b) => b.score - a.score);

		for (const match of MatchInfo) {
			console.log(":", match.match_id);
			console.log("winner:", match.winner);
			console.log("opponent:", match.opponent);
			console.log("opponent_score:", match.score_opponent);
			console.log("Score:", match.score);
			console.log("---------------------------");
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
								<th scope="col">${i18next.t("Rank")}</th>
								<th scope="col">${i18next.t("Name")}</th>
								<th scope="col">${i18next.t("Score")}</th>
								</tr>
							</thead>
							<tbody class="table-group-divider" style="border-top-color: #6c757d">
							${usersWithScores.map((userWithScore, index) => {
								return `
									<tr>
										<th scope="row">${index + 1}</th>
										<td>${userWithScore.user.username}</td>
										<td>${userWithScore.score}</td>
									</tr>
								`;
							}).join('')}
							</tbody>
						</table>
					</div>

					<!--HISTORY TABLE-->
		
					<div class="tab-pane fade show" id="pills-history" role="tabpanel" aria-labelledby="pills-history-tab">
						<h2>${i18next.t("History")}</h2>
						<table class="table table-hover text-center">
							<thead class="table-secondary">
								<tr>
									<th scope="col">${i18next.t("Match")}</th>
									<th scope="col">${i18next.t("Winner")}</th>
									<th scope="col">${i18next.t("Opponent")}</th>
									<th scope="col">${i18next.t("Diff Score")}</th>
								</tr>
							</thead>
							<tbody class="table-group-divider" style="border-top-color: #6c757d">
								${MatchInfo.map((match, index) => {
									return `
										<tr>
											<th scope="row">${match.match_id}</th>
											<td>${match.winner} (5) </td>
											<td>${match.opponent} (${match.score_opponent})</td>
											<td>${match.score}</td>
										</tr>
									`;
								}).join('')}
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
