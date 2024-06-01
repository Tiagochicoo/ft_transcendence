import chatRoomSocketListener from "./chat-room.js";
import friendRequests from "./friend-requests.js";
import matchRequests from "./match-requests.js";
import onlineUsersSocketListener from "./online-users.js";
import tournamentRequests from "./tournament-requests.js";

const socketListeners = () => {
  chatRoomSocketListener();
  friendRequests();
  matchRequests();
  onlineUsersSocketListener();
  tournamentRequests();
}

export default socketListeners;
