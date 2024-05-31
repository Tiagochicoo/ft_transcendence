const fetch = require("node-fetch");

const TOURNAMENT_DATA = {};
const MATCHES_STATE = {};
const height = 400;
const width = 600;
const paddleHeight = 100;
const paddleWidth = 10;
const ballRadius = 8;
const paddleSpeed = 10;
const maxScore = 5;

// Listen for user moves
const matchesSocketListener = (socket, io) => {
  socket.on('game_move', ({ matchId, key, isDown, userId }) => {
    const gameState = MATCHES_STATE[matchId];
    if (!gameState) return;

    if (userId == gameState.user1.id) {
      if (["ArrowUp", "w"].includes(key)) {
        gameState.user1.isUpPressed = isDown;
      } else if (["ArrowDown", "s"].includes(key)) {
        gameState.user1.isDownPressed = isDown;
      }
    } else if (userId == gameState.user2.id) {
      if (["ArrowUp", "w"].includes(key)) {
        gameState.user2.isUpPressed = isDown;
      } else if (["ArrowDown", "s"].includes(key)) {
        gameState.user2.isDownPressed = isDown;
      }
    }
  });
}

// Start the game
const startGame = (io, data) => {
  MATCHES_STATE[data.id] = {
    user1: {
      id: data.user1.id,
      score: 0,
      isDownPressed: false,
      isUpPressed: false,
    },
    user2: {
      id: data.user2.id,
      score: 0,
      isDownPressed: false,
      isUpPressed: false,
    },
    meta: {
      status: "running",
      countDown: 0,
      intervalId: null,
      winner_id: null,
    },
    height: height,
    width: width,
    paddleHeight: paddleHeight,
    paddleWidth: paddleWidth,
    ballRadius: ballRadius,
    paddleSpeed: paddleSpeed,
    ballSpeedX: 5,
    ballSpeedY: 5,
    ballX: width / 2,
    ballY: height / 2,
    leftPaddleY: height / 2 - paddleHeight / 2,
    rightPaddleY: height / 2 - paddleHeight / 2,
  };

  // Run game
  MATCHES_STATE[data.id].meta.intervalId = setInterval(() => {
    doUpdate(io, data.id);
  }, 16);
}

// Update the game state
const doUpdate = (io, matchId) => {
  const gameState = MATCHES_STATE[matchId];
  if (!gameState) return;

  // Move left paddle
  if (gameState.user1.isUpPressed && gameState.leftPaddleY > 0) {
    gameState.leftPaddleY -= paddleSpeed;
  } else if (
    gameState.user1.isDownPressed &&
    gameState.leftPaddleY + paddleHeight < height
  ) {
    gameState.leftPaddleY += paddleSpeed;
  }

  // Move right paddle
  if (gameState.user2.isUpPressed && gameState.rightPaddleY > 0) {
    gameState.rightPaddleY -= paddleSpeed;
  } else if (
    gameState.user2.isDownPressed &&
    gameState.rightPaddleY + paddleHeight < height
  ) {
    gameState.rightPaddleY += paddleSpeed;
  }

  // Move the ball
  gameState.ballX += gameState.ballSpeedX;
  gameState.ballY += gameState.ballSpeedY;

  // Collision with top and bottom
  if (
    gameState.ballY - ballRadius < 0 ||
    gameState.ballY + ballRadius > height
  ) {
    gameState.ballSpeedY = -gameState.ballSpeedY;
  }

  // Collision with left paddle
  if (
    gameState.ballX - ballRadius / 2 < paddleWidth &&
    gameState.ballY > gameState.leftPaddleY &&
    gameState.ballY < gameState.leftPaddleY + paddleHeight
  ) {
    gameState.ballSpeedX = -gameState.ballSpeedX;
  }

  // Collision with right paddle
  if (
    gameState.ballX + ballRadius / 2 > width - paddleWidth &&
    gameState.ballY > gameState.rightPaddleY &&
    gameState.ballY < gameState.rightPaddleY + paddleHeight
  ) {
    gameState.ballSpeedX = -gameState.ballSpeedX;
  }

  // Check the pontuation
  if (
    gameState.ballX < 0 && (
      gameState.ballY < gameState.leftPaddleY ||
      gameState.ballY > gameState.leftPaddleY + gameState.paddleHeight
    )
  ) {
    gameState.user2.score++;
    doReset(matchId);
  } else if (
    gameState.ballX > gameState.width && (
      gameState.ballY < gameState.rightPaddleY ||
      gameState.ballY > gameState.rightPaddleY + gameState.paddleHeight
    )
  ) {
    gameState.user1.score++;
    doReset(matchId);
  }

  // Check for the end of the Game
  if (gameState.user1.score == maxScore || gameState.user2.score == maxScore) {
    clearInterval(gameState.meta.intervalId);
    gameState.meta.status = "ended";
    gameState.meta.winner_id = (gameState.user1.score == maxScore) ? gameState.user1.id : gameState.user2.id;

    fetch(`http://backend:8000/api/matches/${matchId}/finish/`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY,
      },
      body: JSON.stringify({
        user1_score: gameState.user1.score,
        user2_score: gameState.user2.score,
      })
    }).then(response => {
      return response.json();
    }).then(resposeJson => {
      if (resposeJson.success) {
        if (resposeJson.data.tournament?.id) {
          TOURNAMENT_DATA[resposeJson.data.tournament.id].tournament_users.forEach(tournamentUser => {
            io.emit(`tournament_match_finish_${tournamentUser.user.id}`, tournamentUser);
          })
          handleTournamentMatchFinish(io, resposeJson.data);
        } else {
          io.emit(`match_finish_${gameState.user1.id}`, resposeJson.data);
          io.emit(`match_finish_${gameState.user2.id}`, resposeJson.data);
        }
      } else {
        throw new Error();
      }
    }).catch(error => {
      console.log(`Error finishing the match ${matchId}:`, error);
    }).finally(() => {
      delete MATCHES_STATE[matchId];
    });
  }

  // Send updated game data to the clients
  io.emit(`match_data_${matchId}`, gameState);
}

// Reset the game state
const doReset = (matchId) => {
  const gameState = MATCHES_STATE[matchId];
  if (!gameState) return;

  gameState.ballX = gameState.width / 2;
  gameState.ballY = gameState.height / 2;
  gameState.ballSpeedX = -gameState.ballSpeedX;
  gameState.ballSpeedY = Math.random() * 10 - 5;
}

// Initialize the game
// First a countdown of 10s
// Then run the game
const initGame = (io, data, tournament_users = []) => {
  if (data.tournament?.id && tournament_users.length) {
    TOURNAMENT_DATA[data.tournament.id] = {
      matches_finished: 0,
      tournament_users,
    };
  }

  let countDown = 100;
  const intervalId = setInterval(() => {
    countDown--;

    if (countDown == 0) {
      clearInterval(intervalId);
      startGame(io, data);
      return (io, data);
    }

    io.emit(`match_data_${data.id}`, {
      meta: {
        status: "stand-by",
        countDown: Math.ceil(countDown / 10),
      },
      height: height,
      width: width,
    });
  }, 100);
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

const tournamentFinish = async (tournamentId) => {
  return fetch(`http://backend:8000/api/tournaments/${tournamentId}/finish/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
    },
  }).then(response => {
    return response.json();
  });
}

const handleTournamentMatchFinish = async (io, data) => {
  const tournamentId = data.tournament.id;
  const tournamentData = TOURNAMENT_DATA[tournamentId];
  tournamentData.matches_finished++;

  if ([4, 6].includes(tournamentData.matches_finished)) {
    return createTournamentMatches(tournamentId)
      .then(matches => {
        setTimeout(() => {
          matches.data.forEach(match => {
            io.emit(`tournament_round_start_${match.user1.id}`, match);
            io.emit(`tournament_round_start_${match.user2.id}`, match);
          });
          setTimeout(() => {
            matches.data.forEach(match => {
              io.emit(`tournament_open_match_${match.user1.id}`, match.id);
              io.emit(`tournament_open_match_${match.user2.id}`, match.id);
              initGame(io, match);
            });
          }, 5000);
        }, 2000);
      });
  } else if (tournamentData.matches_finished == 7) {
    tournamentFinish(tournamentId)
    .then(tournament => {
      setTimeout(() => {
        TOURNAMENT_DATA[tournamentId].tournament_users.forEach(tournamentUser => {
          io.emit(`tournament_finish_${tournamentUser.user.id}`, tournament.data);
        });
      }, 2000);
    });
  }
}

module.exports = {
  matchesSocketListener,
  initGame
};
