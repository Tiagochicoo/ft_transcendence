import MatchesSection from "/static/js/components/Sidebar/MatchesSection.js";


const matchRefuseSocketListener = () => {
  // Remove 'match_refuse_id' listener
  SOCKET.off(`match_refuse_${USER_ID}`);

  // Listen to the 'match_refuse_id' event
  SOCKET.on(`match_refuse_${USER_ID}`, (data) => {
    MatchesSection.matchRefuseNotification(data);
  });
}

const matchAcceptSocketListener = () => {
  // Remove 'match_accept_id' listener
  SOCKET.off(`match_accept_${USER_ID}`);

  // Listen to the 'match_accept_id' event
  SOCKET.on(`match_accept_${USER_ID}`, (data) => {
    MatchesSection.matchAcceptNotification(data);
  });
}

const matchCancelSocketListener = () => {
  // Remove 'match_cancel_id' listener
  SOCKET.off(`match_cancel_${USER_ID}`);

  // Listen to the 'match_cancel_id' event
  SOCKET.on(`match_cancel_${USER_ID}`, (data) => {
    MatchesSection.matchCancelNotification(data);
  });
}

const matchRequests = () => {
  matchRefuseSocketListener();
  matchAcceptSocketListener();
  matchCancelSocketListener();
}

export default matchRequests;
