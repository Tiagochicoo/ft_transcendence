import { fetchWithToken } from "/static/js/services/index.js";

export default class Users {
  constructor() {}

  static async get(user_id) {
    return await fetchWithToken(`${API_URL}/users/${user_id}`);
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
      const response = await fetchWithToken(`${API_URL}/users/update`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
    } catch(error) {
			console.error("Error: ", error);
		}

  }
}
