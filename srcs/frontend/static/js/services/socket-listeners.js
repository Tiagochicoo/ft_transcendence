import ChatBox from "/static/js/components/ChatBox/index.js";
import FriendsSection from "/static/js/components/Sidebar/FriendsSection.js";
import { sendNotification } from "./index.js";

const chatMessageSocketListener = () => {
  // Remove 'chat_message_id' listener
  SOCKET.off(`chat_message_${USER_ID}`);

  // Listen to the 'chat_message_id' event
  SOCKET.on(`chat_message_${USER_ID}`, (data) => {
    // Try to append a message to the ChatBox
    // but if the ChatBox is not open then send a notification
    if (!ChatBox.appendMessage(data)) {
      sendNotification({
        author: data.sender.username,
        body: data.content
      });
    }
  });
}

const friendAddSocketListener = () => {
  // Remove 'friend_add_id' listener
  SOCKET.off(`friend_add_${USER_ID}`);

  // Listen to the 'friend_add_id' event
  SOCKET.on(`friend_add_${USER_ID}`, (data) => {
    FriendsSection.friendAdd(data);
  });
}

const friendRefuseSocketListener = () => {
  // Remove 'friend_refuse_id' listener
  SOCKET.off(`friend_refuse_${USER_ID}`);

  // Listen to the 'friend_refuse_id' event
  SOCKET.on(`friend_refuse_${USER_ID}`, (data) => {
    FriendsSection.friendRefuse(data);
  });
}

const friendAcceptSocketListener = () => {
  // Remove 'friend_accept_id' listener
  SOCKET.off(`friend_accept_${USER_ID}`);

  // Listen to the 'friend_accept_id' event
  SOCKET.on(`friend_accept_${USER_ID}`, (data) => {
    FriendsSection.friendAccept(data);
  });
}

const friendCancelSocketListener = () => {
  // Remove 'friend_cancel_id' listener
  SOCKET.off(`friend_cancel_${USER_ID}`);

  // Listen to the 'friend_cancel_id' event
  SOCKET.on(`friend_cancel_${USER_ID}`, (data) => {
    FriendsSection.friendCancel(data);
  });
}

const socketListeners = () => {
  chatMessageSocketListener();
  friendAddSocketListener();
  friendRefuseSocketListener();
  friendAcceptSocketListener();
  friendCancelSocketListener();
}

export default socketListeners;
