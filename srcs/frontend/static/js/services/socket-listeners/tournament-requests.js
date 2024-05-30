import TournamentsSection from "/static/js/components/Sidebar/TournamentsSection.js";

const tournamentInviteSocketListener = () => {
  SOCKET.off(`tournament_invite_${USER_ID}`);

  SOCKET.on(`tournament_invite_${USER_ID}`, (data) => {
    TournamentsSection.tournamentInviteNotification(data);
  });
}

/*
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

const matchFinishSocketListener = () => {
  // Remove 'match_finish_id' listener
  SOCKET.off(`match_finish_${USER_ID}`);

  // Listen to the 'match_finish_id' event
  SOCKET.on(`match_finish_${USER_ID}`, (data) => {
    MatchesSection.matchFinishlNotification(data);
  });
}
*/

const tournamentRequests = () => {
  tournamentInviteSocketListener();
  /*
  matchRefuseSocketListener();
  matchAcceptSocketListener();
  matchCancelSocketListener();
  matchFinishSocketListener();
  */
}

export default tournamentRequests;
