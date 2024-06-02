import { fetchWithToken } from "/static/js/services/index.js";

export default class ChatRooms {
  constructor() {}

  static async get(chat_room_id) {
    return await fetchWithToken(`/chat_rooms/${chat_room_id}`);
  }

  static async getMessages(chat_room_id) {
    return await fetchWithToken(`/chat_rooms/${chat_room_id}/messages`);
  }

  static async sendMessage(chat_room_id, content) {
    if (content?.length <= 0) {
      return {
        success: false
      }
    }

    return await fetchWithToken(`/chat_rooms/${chat_room_id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('accessToken'),
      },
      body: JSON.stringify({ content })
    });
  }

  static async block(chat_room_id) {
    return await fetchWithToken(`/chat_rooms/${chat_room_id}/block`, {
      method: 'PATCH'
    });
  }

  static async unblock(chat_room_id) {
    return await fetchWithToken(`/chat_rooms/${chat_room_id}/unblock`, {
      method: 'PATCH'
    });
  }
}
