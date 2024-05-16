export default class PongData {
	constructor() {}
  
	// used only with mocked data
	static getMockedData() {
	  return fetch("/static/js/db.json")
		.then((response) => response.json())
		.catch((error) => console.log(error.message));
	}

	static async createMatch(data) {
		console.log(data);		
		try {
			const response = await fetch("/api/single/match", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();
			console.log("Success: ", responseData);
		} catch(error) {
			console.error("Error: ", error);
		}
	}
  }