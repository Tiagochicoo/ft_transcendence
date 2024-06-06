import { User } from "/static/js/pages/pong/index.js";

const height = 400;
const width = 600;
const paddleHeight = 100;
const paddleWidth = 10;
const ballRadius = 8;
const paddleSpeed = 10;
const ballSpeed = 5;
const maxScore = 5;

const DEFAULT_STATE = {
  user1: {
    id: 1,
    score: 0,
    isDownPressed: false,
    isUpPressed: false,
    usedAttack: false,
  },
  user2: {
    id: 2,
    score: 0,
    isDownPressed: false,
    isUpPressed: false,
    usedAttack: false,
  },
  meta: {
    intervalId: null,
    winner_id: null,
  },
  height: height,
  width: width,
  paddleHeight: paddleHeight,
  paddleWidth: paddleWidth,
  ballRadius: ballRadius,
  paddleSpeed: paddleSpeed,
  ballSpeedX: ballSpeed,
  ballSpeedY: ballSpeed,
  ballX: width / 2,
  ballY: height / 2,
  leftPaddleY: height / 2 - paddleHeight / 2,
  rightPaddleY: height / 2 - paddleHeight / 2,
  startAttack: false,
  endAttack: false,
};

export default class Game {
  constructor() {
  }

  // INITIAL COLOR VALUES
  setColors() {
    this.textColor = localStorage.getItem('textColor') ? localStorage.getItem('textColor') : '#14dd50';
    this.backgroundColor = localStorage.getItem('backgroundColor') ? localStorage.getItem('backgroundColor') : '#212529';
    this.figuresColor = localStorage.getItem('figuresColor') ? localStorage.getItem('figuresColor') : '#14dd50';
  }

  // UPDATE THE GAME STATE WITH USER ACTIONS
  handleGameMove = ({ key, isDown, userId }) => {
    if (!this.gameState) return;

    if (userId == this.gameState.user1.id) {
      if (key == "ArrowUp") {
        this.gameState.user1.isUpPressed = isDown;
      } else if (key == "ArrowDown") {
        this.gameState.user1.isDownPressed = isDown;
      } else if ((key == " ") && isDown && !this.gameState.startAttack && !this.gameState.user1.usedAttack) {
        this.gameState.startAttack = true;
        this.gameState.user1.usedAttack = true;
      }
    } else if (userId == this.gameState.user2.id) {
      if (key == "ArrowUp") {
        this.gameState.user2.isUpPressed = isDown;
      } else if (key == "ArrowDown") {
        this.gameState.user2.isDownPressed = isDown;
      } else if ((key == " ") && isDown && !this.gameState.startAttack && !this.gameState.user2.usedAttack) {
        this.gameState.startAttack = true;
        this.gameState.user2.usedAttack = true;
      }
    }
  }

  // EVENT LISTENERS FOR THE USER ACTIONS
  eventListeners() {
    const handleDown = (isDown, userId) => {
      this.handleGameMove({
        key: "ArrowDown",
        isDown,
        userId
      });
    }

    const handleUp = (isDown, userId) => {
      this.handleGameMove({
        key: "ArrowUp",
        isDown,
        userId
      });
    }

    const handleAttack = (isDown, userId) => {
      this.handleGameMove({
        key: " ",
        isDown,
        userId
      });
    }

    // Handle user move: key down
    this.canvasArea.addEventListener("keydown", (e) => {
      if (["ArrowDown", "s"].includes(e.key)) {
        e.preventDefault();
        handleDown(true, e.key == "ArrowDown" ? 2 : 1);
      } else if (["ArrowUp", "w"].includes(e.key)) {
        e.preventDefault();
        handleUp(true, e.key == "ArrowUp" ? 2 : 1);
      } else if ([" ", "Enter"].includes(e.key)) {
        e.preventDefault();
        handleAttack(true, e.key == " " ? 2 : 1);
      }
    });

    // Handle user move: key up
    this.canvasArea.addEventListener("keyup", (e) => {
      if (["ArrowDown", "s"].includes(e.key)) {
        handleDown(false, e.key == "ArrowDown" ? 2 : 1);
      } else if (["ArrowUp", "w"].includes(e.key)) {
        handleUp(false, e.key == "ArrowUp" ? 2 : 1);
      } else if (e.key == " ") {
        handleAttack(false, 1);
      }
    });
  }

  // COUNTDOWN
  handleCountdown() {
    let countDown = 100;
    const intervalId = setInterval(() => {
      countDown--;

      if (countDown == 0) {
        clearInterval(intervalId);
        this.startGame();
        return;
      }

      this.drawCountdown(Math.ceil(countDown / 10));
    }, 100);
  }

  // START GAME
  startGame() {
    this.gameState.meta.intervalId = setInterval(() => {
      this.doUpdate();
    }, 16);
  }

  // UPDATE GAME
  doUpdate = () => {
    if (!this.gameState) return;
  
    // change ball direction 
    if (this.gameState.startAttack && !this.gameState.endAttack) {
      this.gameState.ballSpeedY = this.gameState.ballSpeedY * 3;
      this.gameState.startAttack = false;
      this.gameState.endAttack = true;
    } 
  
    // Move left paddle
    if (this.gameState.user1.isUpPressed && this.gameState.leftPaddleY > 0) {
      this.gameState.leftPaddleY -= paddleSpeed;
    } else if (
      this.gameState.user1.isDownPressed &&
      this.gameState.leftPaddleY + paddleHeight < height
    ) {
      this.gameState.leftPaddleY += paddleSpeed;
    }
  
    // Move right paddle
    if (this.gameState.user2.isUpPressed && this.gameState.rightPaddleY > 0) {
      this.gameState.rightPaddleY -= paddleSpeed;
    } else if (
      this.gameState.user2.isDownPressed &&
      this.gameState.rightPaddleY + paddleHeight < height
    ) {
      this.gameState.rightPaddleY += paddleSpeed;
    }
  
    // Move the ball
    this.gameState.ballX += this.gameState.ballSpeedX;
    this.gameState.ballY += this.gameState.ballSpeedY;
  
    // Collision with top and bottom
    if (
      this.gameState.ballY - ballRadius < 0 ||
      this.gameState.ballY + ballRadius > height
    ) {
      this.gameState.ballSpeedY = -this.gameState.ballSpeedY;
    }
  
    // Collision with left paddle
    if (
      this.gameState.ballX - ballRadius / 2 < paddleWidth &&
      this.gameState.ballY > this.gameState.leftPaddleY &&
      this.gameState.ballY < this.gameState.leftPaddleY + paddleHeight
    ) {
      this.gameState.ballSpeedX = -this.gameState.ballSpeedX;
    }
  
    // Collision with right paddle
    if (
      this.gameState.ballX + ballRadius / 2 > width - paddleWidth &&
      this.gameState.ballY > this.gameState.rightPaddleY &&
      this.gameState.ballY < this.gameState.rightPaddleY + paddleHeight
    ) {
      this.gameState.ballSpeedX = -this.gameState.ballSpeedX;
    }
  
    // Check the pontuation
    if (
      this.gameState.ballX < 0 && (
        this.gameState.ballY < this.gameState.leftPaddleY ||
        this.gameState.ballY > this.gameState.leftPaddleY + this.gameState.paddleHeight
      )
    ) {
      this.gameState.user2.score++;
      this.doReset();
    } else if (
      this.gameState.ballX > this.gameState.width && (
        this.gameState.ballY < this.gameState.rightPaddleY ||
        this.gameState.ballY > this.gameState.rightPaddleY + this.gameState.paddleHeight
      )
    ) {
      this.gameState.user1.score++;
      this.doReset();
    }
  
    // Check for the end of the Game
    if (this.gameState.user1.score == maxScore || this.gameState.user2.score == maxScore) {
      if (this.gameState.user1.score == maxScore) {
        this.gameState.meta.winner_id = this.gameState.user1.id;
      } else if (this.gameState.user2.score == maxScore) {
        this.gameState.meta.winner_id = this.gameState.user2.id;
      }
      clearInterval(this.gameState.meta.intervalId);
      return this.drawEnd();
    }

    this.drawGame();
  }

  // RESET
  doReset() {
    if (!this.gameState) return;
  
    this.gameState.ballX = this.gameState.width / 2;
    this.gameState.ballY = this.gameState.height / 2;
    this.gameState.ballSpeedX = -1 * Math.sign(this.gameState.ballSpeedX) * ballSpeed;
    this.gameState.ballSpeedY = Math.random() * 10 - 5;
    this.gameState.startAttack = false;
    this.gameState.endAttack = false;
  }

  // ADD FUNCTIONALITY
  addFunctionality() {
    // Canvas context
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvasArea = document.querySelector("#pong");
    this.leftPlayer = new User("Player 1", 1);
    this.rightPlayer = new User("Player 2", 2);
    // Colors
    this.textColor;
    this.backgroundColor;
    this.figuresColor;
    // Game state
    this.gameState = DEFAULT_STATE;

    this.setColors();

    // Set the color
    this.fieldsData.forEach(({ key }) => {
      const inputField = document.querySelector(`#pong #${key}`);
      if (inputField) {
        localStorage.setItem(key, inputField.value);
        this[key] = inputField.value;
        inputField.addEventListener("input", (e) => {
          localStorage.setItem(key, inputField.value);
          this[key] = inputField.value;
        });
      }
    });

    // Set the reset button
    const resetColorsButton = document.querySelector(`#pong #resetColors`);
    if (resetColorsButton) {
      resetColorsButton.addEventListener("click", (e) => {
        this.fieldsData.forEach(({ key, defaultValue }) => {
          localStorage.setItem(key, defaultValue);
          this[key] = defaultValue;
          const inputField = document.querySelector(`#pong #${key}`);
          if (inputField) {
            inputField.value = defaultValue;
          }
        });
      });
    }

    this.eventListeners();
    this.handleCountdown();
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

    const winnerUsername = this.gameState.meta.winner_id == this.leftPlayer.id ? this.leftPlayer.username : this.rightPlayer.username;
    const text = `${i18next.t("dashboard.winner")}: ${winnerUsername}`;

    this.ctx.fillText(text, this.gameState.width / 2, this.gameState.height / 2);

    // Add 'Go Back' button
    const pongWrapper = document.getElementById("pong-end-btn");
    if (pongWrapper) {
      pongWrapper.innerHTML = `
        <a class="btn btn-secondary mt-4" href="/local-match" data-link tabindex="1">
          ${i18next.t('pong.another')}
        </a>
      `;
    }
  }

  async getHtml() {
		this.fieldsData = [
			{ key: 'textColor', defaultValue: '#14dd50' },
			{ key: 'backgroundColor', defaultValue: '#212529' },
			{ key: 'figuresColor', defaultValue: '#14dd50' },
		];

		return `
			<h1 class="mb-3">
				${i18next.t("pong.title")}
			</h1>

			<div class="pong-content mb-4">
				${i18next.t("pong.content")}
			</div>

			<div id="pong" class="d-flex flex-column">
				<div class="canvas-wrapper" class="d-flex flex-column">
					<canvas id="canvas" width="600" height="400" class="bg-dark w-100" tabindex="1"></canvas>
				</div>

				<div id="pong-end-btn">
				</div>

				<div class="d-flex flex-column align-items-start">
					<h2 class="mt-4 mb-3">
						${i18next.t("pong.dashboard.title")}
					</h2>

					<form class="d-flex flex-column">
						${this.fieldsData.map(({ key, defaultValue }) => `
							<label for="${key}" class="form-label d-flex align-items-center gap-1">
								<input type="color" class="form-control form-control-color" id="${key}" value="${localStorage.getItem(key) ? localStorage.getItem(key) : defaultValue}" tabindex="1">
								<span>
									${i18next.t(`pong.dashboard.${key}`)}
								</span>
							</label>
						`).join("")}
					</form>

					<button id="resetColors" class="btn btn-secondary mt-2" tabindex="1">
						${i18next.t("pong.buttons.resetColors")}
					</button>
				</div>
			</div>
		`;
	}
}
