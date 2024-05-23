export default class Users {
  constructor() {}

  static getAuthToken() {
    // Retrieve the JWT token from localStorage
    return localStorage.getItem('token');
  }

  static async get(user_id) {
    const response = await fetch(`${API_URL}/users/${user_id}`);
    const responseJson = await response.json();
    console.log(responseJson);

    return responseJson;
  }

  static async getByUsername(username) {
    if (username?.length <= 0) {
      return {
        success: false
      }
    }

    const response = await fetch(`${API_URL}/users?` + new URLSearchParams({ username }));
    const responseJson = await response.json();

    return responseJson;
  }

  static async updateUser(data) {
    try {
      const response = await fetch(`${API_URL}/users/update`, {
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
}
