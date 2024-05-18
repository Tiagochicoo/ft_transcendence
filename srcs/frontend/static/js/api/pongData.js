import { fetchWithToken } from '/static/js/services/authService.js';

export default class PongData {
	constructor() {}
  
	// used only with mocked data
	static getMockedData() {
	  return fetchWithToken("/static/js/db.json")
		//.then((response) => response.json())
		.catch((error) => console.log(error.message));
	}
  
	// request data from Django API
	static getUserList() {
	  return fetchWithToken("/api/users")
		//.then((response) => response.json())
		.catch((error) => console.log(error.message));
	}
  
	static getUser(id) {
	  return fetchWithToken(`/api/users/${id}`)
		//.then((response) => response.json())
		.catch((error) => console.log(error.message));
	}
  }