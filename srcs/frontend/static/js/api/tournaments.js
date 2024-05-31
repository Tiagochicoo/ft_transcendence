
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

  static async accept(tournament_user_id) {
    return await fetchWithToken(`/tournament_users/${tournament_user_id}/accept/`, {
      method: 'PATCH'
    });
  }

  static async refuse(tournament_user_id) {
    return await fetchWithToken(`/tournament_users/${tournament_user_id}/refuse/`, {
      method: 'PATCH'
    });
  }

  static async getAll() {
    return await fetchWithToken(`/users/${USER_ID}/tournaments/`);
  }

  static async getAllTournamentUsers(tournament_id) {
    return await fetchWithToken(`/tournaments/${tournament_id}/tournament_users/`);
  }

  static async getAllMatches(tournament_id) {
    return await fetchWithToken(`/tournaments/${tournament_id}/matches/`);
  }
}
