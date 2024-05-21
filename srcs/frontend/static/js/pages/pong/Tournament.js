import { Abstract } from "/static/js/components/index.js";
import { PongData } from "/static/js/api/index.js";

export default class extends Abstract{
	constructor(props) {
		super(props);
		this.params = props;
		this.id = this.params.id;
		this.rounds = {"rd1": [], "rd2": [{"id": -1, "user1": "?", "user2": "?"}, {"id": -1, "user1": "?", "user2": "?"}], "rd3": [{"id": -1, "user1": "?", "user2": "?"}]};
		this.winner = "?";
		this.participants = [];
	}

	async addFunctionality() {

		this.getUsers();

		// let counter = 0;
		// for (let i = 0; i < 4; i++) {
		// 	const response = await PongData.createMatch({
		// 		"user1": this.participants[counter],
		// 		"user2": this.participants[counter + 1],
		// 		"tournament": this.tournamentId
		// 	});

		// 	if (response === -1) {
		// 		console.log("Error creating match.");
		// 			return false;
		// 	}
			
		// 	let match = {
		// 		"id": response,
		// 		"user1": this.participants[counter].username,
		// 		"user2": this.participants[counter + 1].username,
		// 		"winner": ''
		// 	}
		// 	this.rounds.rd1.push(match);
		// 	counter = counter + 2;
		// }

		// console.log("Round 1: ", this.rounds);
	}

	async getUsers() {
		const allTournamentUsers = await PongData.getTournamentUserById(this.id);
		console.log(allTournamentUsers);
	}

	async getHtml() {}
}