
import { fetchWithToken } from "/static/js/services/index.js";

export default class Tournaments {
  constructor() {}

  static async create(invited_user_ids) {
    return await fetchWithToken('/tournaments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ invited_user_ids })
    });
  }

  /*
  static async cancel(match_id) {
    return await fetchWithToken(`/matches/${match_id}/cancel/`, {
      method: 'PATCH'
    });
  }

  static async accept(match_id) {
    return await fetchWithToken(`/matches/${match_id}/accept/`, {
      method: 'PATCH'
    });
  }

  static async refuse(match_id) {
    return await fetchWithToken(`/matches/${match_id}/refuse/`, {
      method: 'PATCH'
    });
  }

  static async getAll() {
    return await fetchWithToken(`/users/${USER_ID}/tournaments/`);
  }
  */
}
