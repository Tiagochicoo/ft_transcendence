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

const chatBlockSocketListener = () => {
  // Remove 'chat_block_id' listener
  SOCKET.off(`chat_block_${USER_ID}`);

  // Listen to the 'chat_block_id' event
  SOCKET.on(`chat_block_${USER_ID}`, (data) => {
    ChatBox.update(data);
  });
}

const chatUnblockSocketListener = () => {
  // Remove 'chat_unblock_' listener
  SOCKET.off(`chat_unblock_${USER_ID}`);

  // Listen to the 'chat_unblock_' event
  SOCKET.on(`chat_unblock_${USER_ID}`, (data) => {
    ChatBox.update(data);
  });
}

const chatRoomSocketListener = () => {
  chatMessageSocketListener();
  chatBlockSocketListener();
  chatUnblockSocketListener();
}

export default chatRoomSocketListener;
