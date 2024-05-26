import FriendsSection from "/static/js/components/Sidebar/FriendsSection.js";

const friendAddSocketListener = () => {
  // Remove 'friend_add_id' listener
  SOCKET.off(`friend_add_${USER_ID}`);

  // Listen to the 'friend_add_id' event
  SOCKET.on(`friend_add_${USER_ID}`, (data) => {
    FriendsSection.friendAddNotification(data);
  });
}

const friendRefuseSocketListener = () => {
  // Remove 'friend_refuse_id' listener
  SOCKET.off(`friend_refuse_${USER_ID}`);

  // Listen to the 'friend_refuse_id' event
  SOCKET.on(`friend_refuse_${USER_ID}`, (data) => {
    FriendsSection.friendRefuseNotification(data);
  });
}

const friendAcceptSocketListener = () => {
  // Remove 'friend_accept_id' listener
  SOCKET.off(`friend_accept_${USER_ID}`);

  // Listen to the 'friend_accept_id' event
  SOCKET.on(`friend_accept_${USER_ID}`, (data) => {
    FriendsSection.friendAcceptNotification(data);
  });
}

const friendCancelSocketListener = () => {
  // Remove 'friend_cancel_id' listener
  SOCKET.off(`friend_cancel_${USER_ID}`);

  // Listen to the 'friend_cancel_id' event
  SOCKET.on(`friend_cancel_${USER_ID}`, (data) => {
    FriendsSection.friendCancelNotification(data);
  });
}

const FriendRequests = () => {
  friendAddSocketListener();
  friendRefuseSocketListener();
  friendAcceptSocketListener();
  friendCancelSocketListener();
}

export default FriendRequests;
