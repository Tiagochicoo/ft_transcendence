import chatMessageSocketListener from "./chat-message.js";
import FriendRequests from "./friend-requests.js";
import onlineUsersSocketListener from "./online-users.js";

const socketListeners = () => {
  chatMessageSocketListener();
  FriendRequests();
  onlineUsersSocketListener();
}

export default socketListeners;
