// TODELETE
const USER_ID = 100;
const API_URL = 'http://localhost:8000/api';

export default class Friends {
  constructor() {}

  static USER_ID = USER_ID;

  static async create(invited_user_id) {
    alert(`create: ${invited_user_id}`);
  }

  static async cancel(friend_request_id) {
    const response = await fetch(`${API_URL}/friend_requests/${friend_request_id}/cancel`, {
      method: 'PATCH'
    });
    const responseJson = await response.json();

    return responseJson;
  }

  static async accept(friend_request_id) {
    const response = await fetch(`${API_URL}/friend_requests/${friend_request_id}/accept`, {
      method: 'PATCH'
    });
    const responseJson = await response.json();

    return responseJson;
  }

  static async refuse(friend_request_id) {
    const response = await fetch(`${API_URL}/friend_requests/${friend_request_id}/refuse`, {
      method: 'PATCH'
    });
    const responseJson = await response.json();

    return responseJson;
  }

  static async getAll() {
    const response = await fetch(`${API_URL}/users/${USER_ID}/friend_requests`);
    const responseJson = await response.json();

    return responseJson;
  }
}
