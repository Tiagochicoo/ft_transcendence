import { getUserIDFromToken } from "/static/js/services/authService.js";

// TODELETE
const API_URL = 'http://localhost:8000/api';

export default class Friends {
  constructor() {}

  static USER_ID = getUserIDFromToken();

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
    const response = await fetch(`${API_URL}/users/${this.USER_ID}/friend_requests`);
    const responseJson = await response.json();

    return responseJson;
  }
}
