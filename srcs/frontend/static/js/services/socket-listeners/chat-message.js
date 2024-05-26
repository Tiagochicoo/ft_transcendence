import { ChatBox } from "/static/js/components/index.js";
import { sendNotification } from "/static/js/services/index.js";

const chatMessageSocketListener = () => {
  // Remove 'chat_message_id' listener
  SOCKET.off(`chat_message_${USER_ID}`);

  // Listen to the 'chat_message_id' event
  SOCKET.on(`chat_message_${USER_ID}`, (data) => {
    // Try to append a message to the ChatBox
    // but if the ChatBox is not open then send a notification
    if (!ChatBox.appendMessage(data)) {
      sendNotification({
        user: data.sender,
        body: data.content
      });
    }
  });
}

export default chatMessageSocketListener;
