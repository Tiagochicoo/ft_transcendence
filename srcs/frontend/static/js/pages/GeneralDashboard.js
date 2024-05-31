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

		var userScores = [];
		var userMatchCount = []; 
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
				var MatchCount = 0;
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
							{
								
								TotalRankingScore += (5 - this.Matches.data[x].score)
							}
							MatchCount++;
						}
					}
				}
				userScores.push(TotalRankingScore);
				userMatchCount.push(MatchCount);
			}
		}
		
		const usersWithScores = this.dataUsers.data.filter(user => user.username !== null)
		.map((user, index) => ({
			user: user,
			score: userScores[index],
			matchcount: userMatchCount[index],
			avgScore: userMatchCount[index] ? userScores[index] / userMatchCount[index] : 0,
		}));

		const usersHighestScores = [...usersWithScores].sort((a, b) => b.score - a.score);

		const usersAverageScores = [...usersWithScores].sort((a, b) => b.avgScore - a.avgScore);

		const usersGamesPlayed = [...usersWithScores].sort((a, b) => b.matchcount - a.matchcount);

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
					<button class="nav-link active" id="pills-ranking-tab" data-bs-toggle="pill" data-bs-target="#pills-ranking" type="button" role="tab" aria-controls="pills-ranking" aria-selected="true">${i18next.t("Ranking")}</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="pills-history-tab" data-bs-toggle="pill" data-bs-target="#pills-history" type="button" role="tab" aria-controls="pills-history" aria-selected="false">${i18next.t("History")}</button>
				</li>
				<li class="nav-item" role="presentation">
					<button class="nav-link" id="pills-metric-tab" data-bs-toggle="pill" data-bs-target="#pills-metric" type="button" role="tab" aria-controls="pills-metric" aria-selected="false">${i18next.t("Metric")}</button>
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
								<th scope="col">${i18next.t("Player")}</th>
								<th scope="col">${i18next.t("Score")}</th>
								</tr>
							</thead>
							<tbody class="table-group-divider" style="border-top-color: #6c757d">
							${usersHighestScores.map((userWithScore, index) => {
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
					
					
					<div class="tab-pane fade" id="pills-metric" role="tabpanel" aria-labelledby="pills-metric-tab">
						<h2>${i18next.t("Metric")}</h2>
						<ul class="nav nav-pills mb-3" id="pills-tab-metric" role="tablist">
							<li class="nav-item" role="presentation">
								<button class="nav-link active" id="pills-metric1-tab" data-bs-toggle="pill" data-bs-target="#pills-metric1" type="button" role="tab" aria-controls="pills-metric1" aria-selected="true">${i18next.t("Order By Average Score")}</button>
							</li>
							<li class="nav-item" role="presentation">
								<button class="nav-link" id="pills-metric2-tab" data-bs-toggle="pill" data-bs-target="#pills-metric2" type="button" role="tab" aria-controls="pills-metric2" aria-selected="false">${i18next.t("Order by Matches Played")}</button>
							</li>
							<li class="nav-item" role="presentation">
								<button class="nav-link" id="pills-metric3-tab" data-bs-toggle="pill" data-bs-target="#pills-metric3" type="button" role="tab" aria-controls="pills-metric3" aria-selected="false">${i18next.t("Order by Highest Score")}</button>
							</li>
						</ul>
						<div class="tab-content">
							<div class="tab-pane fade show active" id="pills-metric1" role="tabpanel" aria-labelledby="pills-metric1-tab">
								<h2>${i18next.t("Order By Total Matches")}</h2>
								<table class="table table-hover text-center">
									<thead class="table-secondary">
										<tr>
											<th scope="col">${i18next.t("Player")}</th>
											<th scope="col">${i18next.t("Total Matches")}</th>
											<th scope="col">${i18next.t("Average Score")}</th>
											<th scope="col">${i18next.t("Highest Score")}</th>
										</tr>
									</thead>
									<tbody class="table-group-divider" style="border-top-color: #6c757d">
										${usersGamesPlayed.map((userWithScore, index) => {
											return `
												<tr>
													<th scope="row">${userWithScore.user.username}</th>
													<td>${userWithScore.matchcount}</td>
													<td>${userWithScore.avgScore}</td>
													<td>${userWithScore.score}</td>
												</tr>
											`;
										}).join('')}
									</tbody>
								</table>
							</div>

							<div class="tab-pane fade" id="pills-metric2" role="tabpanel" aria-labelledby="pills-metric2-tab">
								<h2>${i18next.t("Order by Average Score")}</h2>
								<table class="table table-hover text-center">
									<thead class="table-secondary">
										<tr>
											<th scope="col">${i18next.t("Player")}</th>
											<th scope="col">${i18next.t("Total Matches")}</th>
											<th scope="col">${i18next.t("Average Score")}</th>
											<th scope="col">${i18next.t("Highest Score")}</th>
										</tr>
									</thead>
									<tbody class="table-group-divider" style="border-top-color: #6c757d">
										${usersAverageScores.map((userWithScore, index) => {
											return `
												<tr>
													<th scope="row">${userWithScore.user.username}</th>
													<td>${userWithScore.matchcount}</td>
													<td>${userWithScore.avgScore}</td>
													<td>${userWithScore.score}</td>
												</tr>
											`;
										}).join('')}
									</tbody>
								</table>
							</div>

							<div class="tab-pane fade" id="pills-metric3" role="tabpanel" aria-labelledby="pills-metric3-tab">
								<h2>${i18next.t("Order by Highest Score")}</h2>
								<table class="table table-hover text-center">
									<thead class="table-secondary">
										<tr>
											<th scope="col">${i18next.t("Player")}</th>
											<th scope="col">${i18next.t("Total Matches")}</th>
											<th scope="col">${i18next.t("Average Score")}</th>
											<th scope="col">${i18next.t("Highest Score")}</th>
										</tr>
									</thead>
									<tbody class="table-group-divider" style="border-top-color: #6c757d">
										${usersHighestScores.map((userWithScore, index) => {
											return `
												<tr>
													<th scope="row">${userWithScore.user.username}</th>
													<td>${userWithScore.matchcount}</td>
													<td>${userWithScore.avgScore}</td>
													<td>${userWithScore.score}</td>
												</tr>
											`;
										}).join('')}
									</tbody>
								</table>
							</div>
						</div>
					<!--GRAPHS TABLE-->
					<div class="Container" id="pills-graphs" role="tabpanel" aria-labelledby="pills-graphs-tab">
					</div>
				</div>
			</div>
		`;
	}
}
