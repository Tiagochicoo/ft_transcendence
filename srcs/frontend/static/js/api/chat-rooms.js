// TODELETE
const API_URL = 'http://localhost:8000/api';

export default class ChatRooms {
  constructor() {}

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
}
