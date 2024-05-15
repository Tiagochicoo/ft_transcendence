import { getUserIDFromToken } from "/static/js/services/authService.js";

// TODELETE
const API_URL = 'http://localhost:8000/api';

export default class ChatRooms {
  constructor() {}

  static USER_ID = getUserIDFromToken();

  static async get(chat_room_id) {
    const response = await fetch(`${API_URL}/chat_rooms/${chat_room_id}`);
    const responseJson = await response.json();

    return responseJson;
  }

  static async getMessages(chat_room_id) {
    const response = await fetch(`${API_URL}/chat_rooms/${chat_room_id}/messages`);
    const responseJson = await response.json();

    return responseJson;
  }

  static async sendMessage(chat_room_id, content) {
    const response = await fetch(`${API_URL}/chat_rooms/${chat_room_id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('accessToken'),
      },
      body: JSON.stringify({ content })
    });
    const responseJson = await response.json();

    return responseJson;
  }
}
