import { fetchWithToken } from "/static/js/services/index.js";

export default class Users {
  constructor() {}

  static async get(user_id) {
    return await fetchWithToken(`/users/${user_id}`);
  }

  static async getDashboard(user_id) {
    return await fetchWithToken(`/users/${user_id}/dashboard`);
  }

  static async getByUsername(username) {
    if (username?.length <= 0) {
      return {
        success: false
      }
    }

    return await fetchWithToken(`/users?` + new URLSearchParams({ username }));
  }

  static async update(formData) {
    // Delete empty fields
    const fieldsToDelete = [];
    for (const key of formData.keys()) {
      if (!formData.get(key) || ((key == 'avatar') && !formData.get(key).size)) {
        fieldsToDelete.push(key);
      }
    }
    for (const key of fieldsToDelete) {
      formData.delete(key);
    }

    if ([...formData].length == 0) {
      return {
        success: false,
        errors: {
          general: ['no_fields']
        }
      }
    }

    return await fetchWithToken(`/users/${USER_ID}`, {
      method: 'PATCH',
      body: formData
    }, true);
  }

  static async getAll() {
    return await fetchWithToken(`/users`);
  }
}
