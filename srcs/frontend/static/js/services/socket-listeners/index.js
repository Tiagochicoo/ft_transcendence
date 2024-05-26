import chatMessageSocketListener from "./chat-message.js";
import friendRequests from "./friend-requests.js";
import matchRequests from "./match-requests.js";
import onlineUsersSocketListener from "./online-users.js";

const socketListeners = () => {
  chatMessageSocketListener();
  friendRequests();
  matchRequests();
  onlineUsersSocketListener();
}

export default socketListeners;
