const fetch = require("node-fetch");

const tournamentInviteSocketListener = (socket, io) => {
  // Get all the TournamentUsers from the tournament and send them an invite notification
  // Don't send the invitation to the creator of the tournament
  socket.on('tournament_invite', async (tournamentId) => {
    fetch(`http://backend:8000/api/tournaments/${tournamentId}/tournament_users/`, {
      headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY,
      }
    }).then(response => {
      return response.json();
    }).then(resposeJson => {
      if (!resposeJson.success) {
        throw new Error();
      }
      resposeJson.data
        .filter(({ user, tournament }) => user.id != tournament.creator.id)
        .forEach(tournamentUser => {
          io.emit(`tournament_invite_${tournamentUser.user.id}`, tournamentUser);
        });
    }).catch(error => {
      console.log(`Error sending the invites for tournament ${tournamentId}:`, error);
    });
  });
}

const tournamentRefuseSocketListener = (socket, io) => {
  socket.on('tournament_refuse', (data) => {
    io.emit(`tournament_refuse_${data.tournament.creator.id}`, data);
  });
}

/*
const matchAcceptSocketListener = (socket, io) => {
  // Listen to the 'match_accept' event
  socket.on('match_accept', (data) => {
    initGame(io, data);

    // console.log(`match_accept_${data.user1.id}`);
    io.emit(`match_accept_${data.user1.id}`, data);
  });
}

const matchCancelSocketListener = (socket, io) => {
  // Listen to the 'match_cancel' event
  socket.on('match_cancel', (data) => {
    // console.log(`match_cancel_${data.user2.id}`);
    io.emit(`match_cancel_${data.user2.id}`, data);
  });
}
*/

const tournamentRequests = (socket, io) => {
  tournamentInviteSocketListener(socket, io);
  tournamentRefuseSocketListener(socket, io);
  /*
  matchAcceptSocketListener(socket, io);
  matchCancelSocketListener(socket, io);
  */
}

module.exports = tournamentRequests;
