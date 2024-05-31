const fetch = require("node-fetch");

const getAllTournamentUsers = async (tournamentId) => {
  return fetch(`http://backend:8000/api/tournaments/${tournamentId}/tournament_users/`, {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY,
    }
  }).then(response => {
    return response.json();
  });
}

// Initialize the tournament
// First a countdown of 10s
// Then initialize the matches
const initTournament = async (io, tournamentId) => {
  await getAllTournamentUsers(tournamentId)
    .then(resposeJson => {
      if (!resposeJson.success) {
        throw new Error();
      }
      resposeJson.data.forEach(tournamentUser => {
        io.emit(`tournament_start_${tournamentUser.user.id}`, tournamentUser);
      });
    }).catch(error => {
      console.log(`Error sending the start notifications for the tournament ${tournamentId}:`, error);
    });
}

module.exports = initTournament;
