import { fetchWithToken } from "/static/js/services/index.js";

export default class Users {
  constructor() {}

  static async get(user_id) {
    return await fetchWithToken(`/users/${user_id}`);
  }

  static async getByUsername(username) {
    if (username?.length <= 0) {
      return {
        success: false
      }
    }

    return await fetchWithToken(`/users?` + new URLSearchParams({ username }));
  }

  static async updateUser(data) {

    try {
      const response = await fetchWithToken('/users/update', {
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
