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
			const response = await fetch("/api/single/match", {
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
	
  }