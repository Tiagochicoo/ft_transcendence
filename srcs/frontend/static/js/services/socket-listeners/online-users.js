import FriendsSection from "/static/js/components/Sidebar/FriendsSection.js";

const onlineUsersSocketListener = () => {
  // Remove 'online_users' listener
  SOCKET.off('online_users');

  // Listen to the 'online_users' event
  SOCKET.on('online_users', (data) => {
    ONLINE_USERS = data;
    FriendsSection.updateOnlineStatus();
  });
}

export default onlineUsersSocketListener;
