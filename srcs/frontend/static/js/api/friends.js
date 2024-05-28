
import { fetchWithToken } from "/static/js/services/index.js";
import { Users } from "./index.js";

export default class Friends {
  constructor() {}

  static async create(invited_user_id) {
    return await fetchWithToken('/friend_requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ invited_user_id })
    });
  }

  static async createByUsername(username) {
    const response = await Users.getByUsername(username);
    if (response.success && response.data.length && response.data[0]?.id) {
      const invited_user_id = response.data[0].id;
      return await this.create(invited_user_id);
    }

    return {
      success: false
    }
  }

  static async cancel(friend_request_id) {
    return await fetchWithToken(`/friend_requests/${friend_request_id}/cancel`, {
      method: 'PATCH'
    });
  }

  static async accept(friend_request_id) {
    return await fetchWithToken(`/friend_requests/${friend_request_id}/accept`, {
      method: 'PATCH'
    });
  }

  static async refuse(friend_request_id) {
    return await fetchWithToken(`/friend_requests/${friend_request_id}/refuse`, {
      method: 'PATCH'
    });
  }

  static async getAll() {
    return await fetchWithToken(`/users/${USER_ID}/friend_requests`);
  }

  static async getAllFriends() {
    const response = await fetchWithToken(`/users/${USER_ID}/friend_requests`);

    let allFriends = [];

    response.data.forEach((obj) => {
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'user1' && value.id === USER_ID && obj.was_accepted === true) {
          allFriends.push(obj.user2);
        }
      }
    });

    return allFriends;
  }
}
