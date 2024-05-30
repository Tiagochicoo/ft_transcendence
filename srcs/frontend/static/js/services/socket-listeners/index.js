import chatMessageSocketListener from "./chat-message.js";
import friendRequests from "./friend-requests.js";
import matchRequests from "./match-requests.js";
import onlineUsersSocketListener from "./online-users.js";
import tournamentRequests from "./tournament-requests.js";

const socketListeners = () => {
  chatMessageSocketListener();
  friendRequests();
  matchRequests();
  onlineUsersSocketListener();
  tournamentRequests();
}

export default socketListeners;
