const generateSocket = async () => {
  if (!USER_ID) return;

  if (SOCKET) {
    SOCKET.disconnect();
  }

  try {
    // Create a socket (the server will receive this data)
    SOCKET = io({
      extraHeaders: {
        "x-user-id": USER_ID
      }
    });

    // If we receive a 'chat_message' event for a chat_room open on the ChatBox, then we add it to the messages thread
    // Otherwise ignore it
    SOCKET.on(`chat_message_${USER_ID}`, (data) => {
      const wrapper = document.querySelector('#chat-box .chat-box-wrapper');
      if (wrapper?.getAttribute('data-chat-room-id') == data.chat_room.id) {
        const messagesWrapper = wrapper.querySelector('.chat-box-messages');
        messagesWrapper.insertAdjacentHTML('beforeend', `
          <div class="chat-box-message ${USER_ID == data.sender.id ? "left" : "right"}">
            ${data.content}
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
