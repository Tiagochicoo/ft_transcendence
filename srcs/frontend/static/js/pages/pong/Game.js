import { User } from "/static/js/pages/pong/index.js";
import { variables } from "/static/js/services/index.js";

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
    this.tournamentId = this.mode === 'tournament' ? this.match.tournament.id : null;
    // Colors
    this.textColor;
    this.backgroundColor;
    this.figuresColor;
    // Game state
    this.gameState = {};

    this.setColors();
    this.socketFunctionality();
  }

  setColors() {
    this.textColor = localStorage.getItem('textColor') ? localStorage.getItem('textColor') : '#14dd50';
    this.backgroundColor = localStorage.getItem('backgroundColor') ? localStorage.getItem('backgroundColor') : '#212529';
    this.figuresColor = localStorage.getItem('figuresColor') ? localStorage.getItem('figuresColor') : '#14dd50';
  }

  socketFunctionality() {
    const handleDown = (isDown) => {
      if (this.gameState?.meta?.status != "running") return;

      variables.socket.emit(`game_move`, {
        matchId: this.match.id,
        key: "ArrowDown",
        isDown,
        userId: USER_ID,
      });
    }

    const handleUp = (isDown) => {
      if (this.gameState?.meta?.status != "running") return;

      variables.socket.emit(`game_move`, {
        matchId: this.match.id,
        key: "ArrowUp",
        isDown,
        userId: USER_ID,
      });
    }

    const handleAttack = (isDown) => {
      if (this.gameState?.meta?.status != "running") return;

      variables.socket.emit(`game_move`, {
        matchId: this.match.id,
        key: " ",
        isDown,
        userId: USER_ID,
      });

      const attackBtn = document.querySelector('#pong [data-game-action="attack"]');
      if (attackBtn) {
        attackBtn.disabled = true;
      }
    }

    // Set the game actions
    const gameActions = document.querySelectorAll(`#pong [data-game-action]`);
    if (gameActions) {
      const createEventListeners = (element, callback) => {
        element.addEventListener('mousedown', (e) => {
          callback(true);
        });
        element.addEventListener('mouseup', (e) => {
          callback(false);
        });
        element.addEventListener('touchstart', (e) => {
          callback(true);
        });
        element.addEventListener('touchend', (e) => {
          callback(false);
        });
      }

      gameActions.forEach(element => {
        switch (element.getAttribute("data-game-action")) {
          case 'up':
            createEventListeners(element, handleUp);
            break;
          case 'attack':
            createEventListeners(element, handleAttack);
            break;
          case 'down':
            createEventListeners(element, handleDown);
            break;
        }
      });
    }

    // Listen for game state updates
    variables.socket.off(`match_data_${this.match.id}`);

    variables.socket.on(`match_data_${this.match.id}`, (data) => {
      this.gameState = data;

      this.setColors();
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
      if (["ArrowDown", "s"].includes(e.key)) {
        e.preventDefault();
        handleDown(true);
      } else if (["ArrowUp", "w"].includes(e.key)) {
        e.preventDefault();
        handleUp(true);
      } else if (e.key == " ") {
        e.preventDefault();
        handleAttack(true);
      }
    });

    // Handle user move: key up
    this.canvasArea.addEventListener("keyup", (e) => {
      if (["ArrowDown", "s"].includes(e.key)) {
        handleDown(false);
      } else if (["ArrowUp", "w"].includes(e.key)) {
        handleUp(false);
      } else if (e.key == " ") {
        handleAttack(false);
      }
    });
  }

  // Update the canvas with the countdown
  drawCountdown(countdownTime) {
    // Clear
    this.ctx.clearRect(0, 0, this.gameState.width, this.gameState.height);

    // Fill background
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.gameState.width, this.gameState.height);

    // Fill text
    this.ctx.fillStyle = this.textColor;

    this.ctx.font = '48px helvetica';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    this.ctx.fillText(countdownTime, this.gameState.width / 2, this.gameState.height / 2);
  }

  // Update the canvas with the game
  drawGame() {
    // Clear
    this.ctx.clearRect(0, 0, this.gameState.width, this.gameState.height);

    // Fill background
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.gameState.width, this.gameState.height);

    // Fill figures
    this.ctx.fillStyle = this.figuresColor;

    // Paddles
    this.ctx.fillRect(0, this.gameState.leftPaddleY, this.gameState.paddleWidth, this.gameState.paddleHeight);
    this.ctx.fillRect(
      this.gameState.width - this.gameState.paddleWidth,
      this.gameState.rightPaddleY,
      this.gameState.paddleWidth,
      this.gameState.paddleHeight,
    );

    // Central line
    for (let i = 0; i < 40; i++) {
      this.ctx.fillRect(this.gameState.width / 2, 0 + i * 10, 2, 5);
    }

    // Ball
    this.ctx.beginPath();
    this.ctx.arc(this.gameState.ballX, this.gameState.ballY, this.gameState.ballRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Fill text
    this.ctx.fillStyle = this.textColor;

    // Scoreboard
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
  drawEnd(defaultGameState = {}) {
    if (Object.keys(this.gameState).length === 0) {
      this.gameState = defaultGameState;
    }

    // Clear
    this.ctx.clearRect(0, 0, this.gameState.width, this.gameState.height);

    // Fill background
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.gameState.width, this.gameState.height);

    // Fill text
    this.ctx.fillStyle = this.textColor;
    this.ctx.font = '48px helvetica';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const text = (USER_ID == this.gameState.meta.winner_id) ? i18next.t("pong.won") : i18next.t("pong.lost");

    this.ctx.fillText(text, this.gameState.width / 2, this.gameState.height / 2);

    // Add 'Go Back' button
    const pongWrapper = document.getElementById("pong-end-btn");
    if (pongWrapper) {
      const linkHref = (this.mode === 'single') ? '/pong' : `/pong/tournament/${this.tournamentId}/rounds`;
      pongWrapper.innerHTML = `
        <a class="btn btn-secondary mt-4" href="${linkHref}" data-link>
          ${i18next.t('pong.buttons.goBack')}
        </a>
      `;
    }
  }
}
