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

const tournamentAcceptSocketListener = () => {
  SOCKET.off(`tournament_accept_${USER_ID}`);

  SOCKET.on(`tournament_accept_${USER_ID}`, (data) => {
    TournamentsSection.tournamentAcceptNotification(data);
  });
}

const tournamentStartSocketListener = () => {
  SOCKET.off(`tournament_start_${USER_ID}`);

  SOCKET.on(`tournament_start_${USER_ID}`, (data) => {
    TournamentsSection.tournamentStartNotification(data);
  });
}

const tournamentOpenMatchSocketListener = () => {
  SOCKET.off(`tournament_open_match_${USER_ID}`);

  SOCKET.on(`tournament_open_match_${USER_ID}`, (matchId) => {
    TournamentsSection.tournamentOpenMatch(matchId);
  });
}

const tournamentMatchFinishSocketListener = () => {
  SOCKET.off(`tournament_match_finish_${USER_ID}`);

  SOCKET.on(`tournament_match_finish_${USER_ID}`, (data) => {
    TournamentsSection.tournamentMatchFinish(data);
  });
}

const tournamentRequests = () => {
  tournamentInviteSocketListener();
  tournamentRefuseSocketListener();
  tournamentAcceptSocketListener();
  tournamentStartSocketListener();
  tournamentOpenMatchSocketListener();
  tournamentMatchFinishSocketListener();
}

export default tournamentRequests;
