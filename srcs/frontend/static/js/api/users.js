export default class Users {
  constructor() {}

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
}
