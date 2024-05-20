export default class PongData {
	constructor() {}
  
	// used only with mocked data
	static getMockedData() {
	  return fetch("/static/js/db.json")
		.then((response) => response.json())
		.catch((error) => console.log(error.message));
	}

	static async createMatch(data) {
		
		try {
			const response = await fetch("/api/match/", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();
			console.log("Success: ", responseData);
			return responseData.data.id;
		} catch(error) {
			console.error("Error: ", error);
			return -1;
		}
	}

	static getMatchById(id) {
		return fetch(`/api/match/${id}`)
			.then((response) => response.json())
			.catch((error) => console.log(error.message));
	}

	static async createTournament(data) {
		try {
			const response = await fetch("/api/tournament/", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();
			console.log("Success: ", responseData);
			return responseData.data.id;
		} catch(error) {
			console.error("Error: ", error);
			return -1;
		}
	}

	static getTournamentById(id) {
		return fetch(`/api/tournament/${id}`)
			.then((response) => response.json())
			.catch((error) => console.log(error.message));
	}
	
	static async createTournamentUser(data) {
		try {
			const response = await fetch("/api/tournament_user/", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();
			console.log("Success: ", responseData);
			return true;
		} catch(error) {
			console.log("Error: ", error);
			return false;
		}
	}

	static getTournamentUserByIds(userId, tournamentId) {
		return fetch(`/api/tournament_user/${userId}/${tournamentId}/`)
		.then((response) => response.json())
		.catch((error) => console.log(error.message));
	}
  }