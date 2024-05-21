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
			const response = await fetch(`${API_URL}/match/`, {
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
		return fetch(`${API_URL}/match/${id}`)
			.then((response) => response.json())
			.catch((error) => console.log(error.message));
	}

	static async updateMatch(data) {
		try {
			const response = await fetch(`${API_URL}/match/update`, {
				method: "PATCH",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();
			console.log("Success: ", responseData);
		} catch(error) {
			console.error("Error: ", error);
		}
	}

	static async createTournament(data) {
		try {
			const response = await fetch(`${API_URL}/tournament/`, {
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
		return fetch(`${API_URL}/tournament/${id}`)
			.then((response) => response.json())
			.catch((error) => console.log(error.message));
	}
	
	static async createTournamentUser(data) {
		try {
			const response = await fetch(`${API_URL}/tournament_user/`, {
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

	static getTournamentUserById(tournamentId) {
		return fetch(`${API_URL}/tournament_user/${tournamentId}/`)
		.then((response) => response.json())
		.catch((error) => console.log(error.message));
	}


  }