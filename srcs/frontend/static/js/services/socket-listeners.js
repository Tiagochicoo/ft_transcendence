import { sendNotification } from "./index.js";

const chatMessageSocketListener = () => {
  // Remove 'chat_message_id' listener
  SOCKET.off(`chat_message_${USER_ID}`);

  // Listen to the 'chat_message_id' event
  SOCKET.on(`chat_message_${USER_ID}`, (data) => {
    const wrapper = document.querySelector('#chat-box .chat-box-wrapper');

    // If the ChatBox is open on this specific 'chat_room', then add a message to it
    if (wrapper?.getAttribute('data-chat-room-id') == data.chat_room.id) {
      const messagesWrapper = wrapper.querySelector('.chat-box-messages');
      messagesWrapper.insertAdjacentHTML('beforeend', `
        <div class="chat-box-message ${USER_ID == data.sender.id ? "left" : "right"}">
          ${data.content}
        </div>
      `);
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight;

    // Otherwise send a notification
    } else {
      sendNotification({
        author: data.sender.username,
        body: data.content
      });
    }
  });
}

export default chatMessageSocketListener;
