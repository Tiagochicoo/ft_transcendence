import FriendsSection from "/static/js/components/Sidebar/FriendsSection.js";
import { variables } from "/static/js/services/index.js";

const onlineUsersSocketListener = () => {
  // Remove 'online_users' listener
  variables.socket.off('online_users');

  // Listen to the 'online_users' event
  variables.socket.on('online_users', (data) => {
    ONLINE_USERS = data;
    FriendsSection.updateOnlineStatus();
  });
}

export default onlineUsersSocketListener;
