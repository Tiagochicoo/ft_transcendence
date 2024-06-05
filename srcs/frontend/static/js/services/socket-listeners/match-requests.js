import MatchesSection from "/static/js/components/Sidebar/MatchesSection.js";
import { variables } from "/static/js/services/index.js";

const matchInviteSocketListener = () => {
  // Remove 'match_invite_id' listener
  variables.socket.off(`match_invite_${USER_ID}`);

  // Listen to the 'match_invite_id' event
  variables.socket.on(`match_invite_${USER_ID}`, (data) => {
    MatchesSection.matchInviteNotification(data);
  });
}

const matchRefuseSocketListener = () => {
  // Remove 'match_refuse_id' listener
  variables.socket.off(`match_refuse_${USER_ID}`);

  // Listen to the 'match_refuse_id' event
  variables.socket.on(`match_refuse_${USER_ID}`, (data) => {
    MatchesSection.matchRefuseNotification(data);
  });
}

const matchAcceptSocketListener = () => {
  // Remove 'match_accept_id' listener
  variables.socket.off(`match_accept_${USER_ID}`);

  // Listen to the 'match_accept_id' event
  variables.socket.on(`match_accept_${USER_ID}`, (data) => {
    MatchesSection.matchAcceptNotification(data);
  });
}

const matchCancelSocketListener = () => {
  // Remove 'match_cancel_id' listener
  variables.socket.off(`match_cancel_${USER_ID}`);

  // Listen to the 'match_cancel_id' event
  variables.socket.on(`match_cancel_${USER_ID}`, (data) => {
    MatchesSection.matchCancelNotification(data);
  });
}

const matchFinishSocketListener = () => {
  // Remove 'match_finish_id' listener
  variables.socket.off(`match_finish_${USER_ID}`);

  // Listen to the 'match_finish_id' event
  variables.socket.on(`match_finish_${USER_ID}`, (data) => {
    MatchesSection.matchFinishlNotification(data);
  });
}

const matchRequests = () => {
  matchInviteSocketListener();
  matchRefuseSocketListener();
  matchAcceptSocketListener();
  matchCancelSocketListener();
  matchFinishSocketListener();
}

export default matchRequests;
