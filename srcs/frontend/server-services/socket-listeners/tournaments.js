const fetch = require("node-fetch");

const matches = require("./matches.js");

const { initGame } = matches;

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

const createTournamentMatches = async (tournamentId) => {
  return fetch(`http://backend:8000/api/tournaments/${tournamentId}/matches/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
  }).then(response => {
    return response.json();
  });
}

// Initialize the tournament
// First a countdown of 5s
// Then initialize the matches
const initTournament = async (io, tournamentId) => {
  await getAllTournamentUsers(tournamentId)
    .then(responseJson => {
      if (!responseJson.success) {
        throw new Error();
      }
      responseJson.data.forEach(tournamentUser => {
        io.emit(`tournament_start_${tournamentUser.user.id}`, tournamentUser);
      });
      return createTournamentMatches(tournamentId);
    }).then(matches => {
      setTimeout(() => {
        matches.data.forEach(match => {
          io.emit(`tournament_open_match_${match.user1.id}`, match.id);
          io.emit(`tournament_open_match_${match.user2.id}`, match.id);
          initGame(io, match);
        });
      }, 5000);
    }).catch(error => {
      console.log(`Error sending the start notifications for the tournament ${tournamentId}:`, error);
    });
}

module.exports = initTournament;
