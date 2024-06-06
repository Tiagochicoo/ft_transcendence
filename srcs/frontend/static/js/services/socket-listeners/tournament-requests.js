import TournamentsSection from "/static/js/components/Sidebar/TournamentsSection.js";
import { variables } from "/static/js/services/index.js";

const tournamentInviteSocketListener = () => {
  variables.socket.off(`tournament_invite_${USER_ID}`);

  variables.socket.on(`tournament_invite_${USER_ID}`, (data) => {
    TournamentsSection.tournamentInviteNotification(data);
  });
}

const tournamentRefuseSocketListener = () => {
  variables.socket.off(`tournament_refuse_${USER_ID}`);

  variables.socket.on(`tournament_refuse_${USER_ID}`, (data) => {
    TournamentsSection.tournamentRefuseNotification(data);
  });
}

const tournamentAcceptSocketListener = () => {
  variables.socket.off(`tournament_accept_${USER_ID}`);

  variables.socket.on(`tournament_accept_${USER_ID}`, (data) => {
    TournamentsSection.tournamentAcceptNotification(data);
  });
}

const tournamentStartSocketListener = () => {
  variables.socket.off(`tournament_start_${USER_ID}`);

  variables.socket.on(`tournament_start_${USER_ID}`, (data) => {
    TournamentsSection.tournamentStartNotification(data);
  });
}

const tournamentOpenMatchSocketListener = () => {
  variables.socket.off(`tournament_open_match_${USER_ID}`);

  variables.socket.on(`tournament_open_match_${USER_ID}`, (matchId) => {
    TournamentsSection.tournamentOpenMatch(matchId);
  });
}

const tournamentMatchFinishSocketListener = () => {
  variables.socket.off(`tournament_match_finish_${USER_ID}`);

  variables.socket.on(`tournament_match_finish_${USER_ID}`, (data) => {
    TournamentsSection.tournamentMatchFinish(data);
  });
}

const tournamentRoundStartSocketListener = () => {
  variables.socket.off(`tournament_round_start_${USER_ID}`);

  variables.socket.on(`tournament_round_start_${USER_ID}`, (data) => {
    TournamentsSection.tournamentRoundStart(data);
  });
}

const tournamentFinishSocketListener = () => {
  variables.socket.off(`tournament_finish_${USER_ID}`);

  variables.socket.on(`tournament_finish_${USER_ID}`, (data) => {
    TournamentsSection.tournamentFinish(data);
  });
}

const tournamentRequests = () => {
  tournamentInviteSocketListener();
  tournamentRefuseSocketListener();
  tournamentAcceptSocketListener();
  tournamentStartSocketListener();
  tournamentOpenMatchSocketListener();
  tournamentMatchFinishSocketListener();
  tournamentRoundStartSocketListener();
  tournamentFinishSocketListener();
}

export default tournamentRequests;
