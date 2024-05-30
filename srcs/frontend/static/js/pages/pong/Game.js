import { User } from "/static/js/pages/pong/index.js";

export default class Game {
  constructor(match, mode) {
    this.match = match;
    // Canvas context
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvasArea = document.querySelector("#pong");
    this.leftPlayer = new User(this.match.user1.username, this.match.user1.id);
    this.rightPlayer = new User(this.match.user2.username, this.match.user2.id);
    this.mode = mode;
    this.tournamentId = this.mode === 'tournament' ? this.match.tournament : null;
    this.gameColor = localStorage.getItem('gameColor') ? localStorage.getItem('gameColor') : '#14dd50';

    // Game state
    this.gameState = {};

    this.socketFunctionality();
  }

  socketFunctionality() {
    // Listen for game state updates
    SOCKET.off(`match_data_${this.match.id}`);

    SOCKET.on(`match_data_${this.match.id}`, (data) => {
      this.gameState = data;

      if (this.gameState.meta.status == 'stand-by') {
        this.drawCountdown(this.gameState.meta.countDown);
      } else if (this.gameState.meta.status == 'running') {
        this.drawGame();
      } else if (this.gameState.meta.status == 'ended') {
        this.drawEnd();
      }
    });

    // Handle user move: key down
    this.canvasArea.addEventListener("keydown", (e) => {
      e.preventDefault();
      SOCKET.emit(`game_move`, {
        matchId: this.match.id,
        key: e.key,
        isDown: true,
        userId: USER_ID,
      });
    });

    // Handle user move: key up
    this.canvasArea.addEventListener("keyup", (e) => {
      e.preventDefault();
      SOCKET.emit(`game_move`, {
        matchId: this.match.id,
        key: e.key,
        isDown: false,
        userId: USER_ID,
      });
    });
  }

  // Update the canvas with the countdown
  drawCountdown(countdownTime) {
    this.ctx.clearRect(0, 0, this.gameState.width, this.gameState.height);

    this.ctx.fillStyle = this.gameColor;

    this.ctx.font = '48px helvetica';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    this.ctx.fillText(countdownTime, this.gameState.width / 2, this.gameState.height / 2);
  }

  // Update the canvas with the game
  drawGame() {
    this.ctx.clearRect(0, 0, this.gameState.width, this.gameState.height);

    this.ctx.fillStyle = this.gameColor;

    //paddles
    this.ctx.fillRect(0, this.gameState.leftPaddleY, this.gameState.paddleWidth, this.gameState.paddleHeight);
    this.ctx.fillRect(
      this.gameState.width - this.gameState.paddleWidth,
      this.gameState.rightPaddleY,
      this.gameState.paddleWidth,
      this.gameState.paddleHeight,
    );

    // central line
    for (let i = 0; i < 40; i++) {
      this.ctx.fillRect(this.gameState.width / 2, 0 + i * 10, 2, 5);
    }

    // ball
    this.ctx.beginPath();
    this.ctx.arc(this.gameState.ballX, this.gameState.ballY, this.gameState.ballRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // scoreboard
    this.ctx.font = "20px helvetica";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      this.leftPlayer.username + " - " + (this.gameState?.user1?.score || 0),
      this.gameState.width / 4,
      20,
    );
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      (this.gameState?.user2?.score || 0) + " - " + this.rightPlayer.username,
      (3 * this.gameState.width) / 4,
      20,
    );
  }

  // Update the canvas with the end of the game
  drawEnd() {
    this.ctx.clearRect(0, 0, this.gameState.width, this.gameState.height);

    this.ctx.fillStyle = this.gameColor;
    this.ctx.font = '48px helvetica';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const text = (USER_ID == this.gameState.meta.winner_id) ? "Congratulations, you won!" : "Ooops, you lost...";

    this.ctx.fillText(text, this.gameState.width / 2, this.gameState.height / 2);

    // Add 'Go Back' button
    const pongWrapper = document.getElementById("pong-end-btn");
    if (pongWrapper) {
      const linkHref = (this.mode === 'single') ? '/pong' : `/pong/tournament/${this.tournamentId}/rounds`;
      pongWrapper.innerHTML = `
        <a class="btn btn-secondary mt-4" href="${linkHref}" data-link>
          Go Back
        </a>
      `;
    }
  }
}
