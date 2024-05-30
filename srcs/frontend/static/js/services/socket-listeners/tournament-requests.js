import TournamentsSection from "/static/js/components/Sidebar/TournamentsSection.js";

const tournamentInviteSocketListener = () => {
  SOCKET.off(`tournament_invite_${USER_ID}`);

  SOCKET.on(`tournament_invite_${USER_ID}`, (data) => {
    TournamentsSection.tournamentInviteNotification(data);
  });
}

const tournamentRefuseSocketListener = () => {
  SOCKET.off(`tournament_refuse_${USER_ID}`);

  SOCKET.on(`tournament_refuse_${USER_ID}`, (data) => {
    TournamentsSection.tournamentRefuseNotification(data);
  });
}

/*
const matchAcceptSocketListener = () => {
  // Remove 'match_accept_id' listener
  SOCKET.off(`match_accept_${USER_ID}`);

  // Listen to the 'match_accept_id' event
  SOCKET.on(`match_accept_${USER_ID}`, (data) => {
    MatchesSection.matchAcceptNotification(data);
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
  tournamentRefuseSocketListener();
  /*
  matchRefuseSocketListener();
  matchAcceptSocketListener();
  matchCancelSocketListener();
  matchFinishSocketListener();
  */
}

export default tournamentRequests;
