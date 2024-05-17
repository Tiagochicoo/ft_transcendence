const generateSocket = async () => {
  if (!USER_ID) return;

  try {
    // Fetch the user chat_rooms (to listen for chat_messages)
    const response = await fetch(`${API_URL}/users/${USER_ID}/chat_rooms`);
    const responseJson = await response.json();
    const chatRooms = responseJson.data;

    // Create a socket (the server will receive this data)
    SOCKET = io({
      extraHeaders: {
        "x-user-id": USER_ID,
        "x-chat-rooms": JSON.stringify(chatRooms.map(({ id }) => id))
      }
    });

    // If we receive a 'chat_message' event for a chat_room open on the ChatBox, then we add it to the messages thread
    // Otherwise ignore it
    SOCKET.on('chat_message', (chat_room_id, sender_id, message) => {
      const wrapper = document.querySelector('#chat-box .chat-box-wrapper');
      if (wrapper?.getAttribute('data-chat-room-id') == chat_room_id) {
        const messagesWrapper = wrapper.querySelector('.chat-box-messages');
        messagesWrapper.insertAdjacentHTML('beforeend', `
          <div class="chat-box-message ${USER_ID == sender_id ? "left" : "right"}">
            ${message}
          </div>
        `);
        messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
      }
    });
  } catch(e) {
    console.error(e);
  }
}

export default generateSocket;
