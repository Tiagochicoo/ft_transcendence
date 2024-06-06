import { fetchWithToken } from "/static/js/services/index.js";

export default class PongData {
	constructor() {}
  
	// used only with mocked data
	static getMockedData() {
	  return fetch("/static/js/db.json")
		.then((response) => response.json())
		.catch((error) => {} /* console.log(error.message) */);
	}

	static async createMatch(data) {
		
		try {
			const response = await fetchWithToken('/matches/', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});
			return response.data.id;
		} catch(error) {
			// console.error("Error: ", error);
			return -1;
		}
	}

	static async getMatchById(id) {
		
		return await fetchWithToken(`/matches/${id}`);
	}

	static async updateMatch(data) {
		
		try {
			const response = await fetchWithToken('/matches/update', {
				method: "PATCH",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});
		} catch(error) {
			// console.error("Error: ", error);
		}
	}

	static async getAllMatchesFromTournament(tournamentId) {
		
		return await fetchWithToken(`/matches/on-tournament/${tournamentId}/`);
	}

	static async createTournament(data) {
		
		try {
			const response = await fetchWithToken('/tournament/', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});

			return response.data.id;
		} catch(error) {
			// console.error("Error: ", error);
			return -1;
		}
	}

	static async updateTournament(data) {
		
		try {
			const response = await fetchWithToken('/tournament/update', {
				method: "PATCH",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});
		} catch(error) {
			// console.error("Error: ", error);
		}
	}

	static async getTournamentById(id) {
		
		return await fetchWithToken(`/tournament/${id}`);
	}
	
	static async createTournamentUser(data) {
		
		try {
			const response = await fetchWithToken('/tournament_user/', {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data),
			});
			return true;
		} catch(error) {
			// console.log("Error: ", error);
			return false;
		}
	}

	static async getTournamentUserById(tournamentId) {
		
		return await fetchWithToken(`/tournament_user/${tournamentId}/`);
	}

  }