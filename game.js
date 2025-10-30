const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector("#score");
const highScoreElement = document.querySelector("#highScore");

// Configurar tamaño del canvas (fijo para mantener la lógica del juego)
canvas.width = 320;
canvas.height = 500;

// High Score
const HIGH_SCORE_KEY = "stackGameHighScore";
let highScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
highScoreElement.textContent = highScore;

// Constantes del juego
const MODES = {
  FALL: "fall",
  BOUNCE: "bounce",
  GAMEOVER: "gameover",
  PAUSED: "paused",
};
const INITIAL_BOX_WIDTH = 200;
const INITIAL_BOX_Y = 600;

const BOX_HEIGHT = 50;
const INITIAL_Y_SPEED = 5;
const INITIAL_X_SPEED = 2;

// Constantes de UI y visualización
const COLORS = {
  BACKGROUND: "black",
  DEBRIS: "red",
  TEXT_PRIMARY: "white",
  TEXT_SECONDARY: "rgba(255, 255, 255, 0.8)",
  OVERLAY_GAMEOVER: "rgba(255, 0, 0, 0.5)",
  OVERLAY_INSTRUCTIONS: "rgba(0, 0, 0, 0.7)",
  OVERLAY_PAUSED: "rgba(0, 0, 0, 0.8)",
  HIGHLIGHT_RECORD: "#ffd700",
};

const FONTS = {
  TITLE: "bold 20px Arial",
  SUBTITLE: "16px Arial",
  INSTRUCTIONS: "bold 14px Arial",
  SMALL: "14px Arial",
};

const UI_POSITIONS = {
  INSTRUCTIONS_Y_START: 20,
  INSTRUCTIONS_HEIGHT: 60,
  INSTRUCTIONS_TEXT_Y1: 45,
  INSTRUCTIONS_TEXT_Y2: 65,
  GAMEOVER_TITLE_Y: -40,
  GAMEOVER_SCORE_Y: -10,
  GAMEOVER_RECORD_Y: 20,
  GAMEOVER_RESTART_Y: 60,
};

// State
let boxes = [];
let debris = { x: 0, y: 0, width: 0 };
let scrollCounter, cameraY, current, mode, xSpeed, ySpeed;
let previousMode = null; // Para guardar el modo antes de pausar

function createStepColor(step) {
  if (step === 0) return "white";

  const red = Math.floor(Math.random() * 255);
  const green = Math.floor(Math.random() * 255);
  const blue = Math.floor(Math.random() * 255);

  return `rgb(${red}, ${green}, ${blue})`;
}

function updateCamera() {
  if (scrollCounter > 0) {
    cameraY++;
    scrollCounter--;
  }
}

function initializeGameState() {
  boxes = [
    {
      x: canvas.width / 2 - INITIAL_BOX_WIDTH / 2,
      y: 200,
      width: INITIAL_BOX_WIDTH,
      color: "white",
    },
  ];

  debris = { x: 0, y: 0, width: 0 };

  current = 1;
  mode = MODES.BOUNCE;
  xSpeed = INITIAL_X_SPEED;
  ySpeed = INITIAL_Y_SPEED;
  scrollCounter = 0;
  cameraY = 0;

  createNewBox();
}

function restart() {
  initializeGameState();
  draw();
}

function togglePause() {
  // No pausar si el juego terminó
  if (mode === MODES.GAMEOVER) return;

  if (mode === MODES.PAUSED) {
    // Reanudar: restaurar el modo anterior
    mode = previousMode;
    previousMode = null;
  } else {
    // Pausar: guardar el modo actual
    previousMode = mode;
    mode = MODES.PAUSED;
  }
}

function draw() {
  if (mode === MODES.GAMEOVER) return;

  drawBackground();
  drawBoxes();
  drawDebris();
  drawInstructions();

  // Solo actualizar lógica del juego si no está pausado
  if (mode !== MODES.PAUSED) {
    if (mode === MODES.BOUNCE) {
      moveAndDetectCollision();
    } else if (mode === MODES.FALL) {
      updateFallMode();
    }

    debris.y -= ySpeed;
    updateCamera();
  }

  // Dibujar overlay de pausa si está pausado
  if (mode === MODES.PAUSED) {
    drawPauseOverlay();
  }

  window.requestAnimationFrame(draw);
}

function drawBackground() {
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDebris() {
  const { x, y, width } = debris;

  // Solo dibujar si hay debris visible
  if (width === 0) return;

  const nwY = INITIAL_BOX_Y - y + cameraY;

  ctx.fillStyle = COLORS.DEBRIS;
  ctx.fillRect(x, nwY, width, BOX_HEIGHT);
}

function drawBoxes() {
  boxes.forEach((box) => {
    const { x, y, width, color } = box;
    const nwY = INITIAL_BOX_Y - y + cameraY;

    ctx.fillStyle = color;
    ctx.fillRect(x, nwY, width, BOX_HEIGHT);
  });
}

function drawInstructions() {
  // Mostrar instrucciones solo al principio del juego
  if (current === 1 && mode === MODES.BOUNCE) {
    // Fondo semi-transparente para mejor legibilidad
    ctx.fillStyle = COLORS.OVERLAY_INSTRUCTIONS;
    ctx.fillRect(
      0,
      UI_POSITIONS.INSTRUCTIONS_Y_START,
      canvas.width,
      UI_POSITIONS.INSTRUCTIONS_HEIGHT
    );

    ctx.fillStyle = COLORS.TEXT_PRIMARY;
    ctx.font = FONTS.INSTRUCTIONS;
    ctx.textAlign = "center";
    ctx.fillText(
      "Presiona ESPACIO o CLICK",
      canvas.width / 2,
      UI_POSITIONS.INSTRUCTIONS_TEXT_Y1
    );
    ctx.fillText(
      "para soltar la caja",
      canvas.width / 2,
      UI_POSITIONS.INSTRUCTIONS_TEXT_Y2
    );
  }
}

function drawPauseOverlay() {
  // Overlay oscuro
  ctx.fillStyle = COLORS.OVERLAY_PAUSED;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Texto "PAUSA"
  ctx.fillStyle = COLORS.TEXT_PRIMARY;
  ctx.font = FONTS.TITLE;
  ctx.textAlign = "center";
  ctx.fillText("PAUSA", canvas.width / 2, canvas.height / 2 - 20);

  // Instrucciones para continuar
  ctx.fillStyle = COLORS.TEXT_SECONDARY;
  ctx.font = FONTS.SMALL;
  ctx.fillText(
    "Presiona P o ESC para continuar",
    canvas.width / 2,
    canvas.height / 2 + 20
  );
}

// Crear nueva caja
function createNewBox() {
  boxes[current] = {
    x: 0,
    y: (current + 10) * BOX_HEIGHT,
    width: boxes[current - 1].width,
    color: createStepColor(current),
  };
}

// Visualizar la parte que sobra
function createNewDebris(difference) {
  const currentBox = boxes[current];
  const previousBox = boxes[current - 1];

  const debrisX =
    currentBox.x > previousBox.x
      ? currentBox.x + currentBox.width
      : currentBox.x;

  debris = {
    x: debrisX,
    y: currentBox.y,
    width: difference,
  };
}

// Actualizar modo de caída
function updateFallMode() {
  const currentBox = boxes[current];
  currentBox.y -= ySpeed;

  const positionPreviousBox = boxes[current - 1].y + BOX_HEIGHT;

  if (currentBox.y === positionPreviousBox) {
    handleBoxLanding();
  }
}

// Ajustar caja actual
function adjustCurrentBox(difference) {
  const currentBox = boxes[current];
  const previousBox = boxes[current - 1];

  if (currentBox.x > previousBox.x) {
    currentBox.width -= difference;
  } else {
    currentBox.width += difference;
    currentBox.x = previousBox.x;
  }
}

// GameOver
function handleGameOver() {
  mode = MODES.GAMEOVER;

  const finalScore = current - 1;
  const isNewRecord = finalScore === highScore && finalScore > 0;

  ctx.fillStyle = COLORS.OVERLAY_GAMEOVER;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = COLORS.TEXT_PRIMARY;
  ctx.font = FONTS.TITLE;
  ctx.textAlign = "center";
  ctx.fillText(
    "Game Over",
    canvas.width / 2,
    canvas.height / 2 + UI_POSITIONS.GAMEOVER_TITLE_Y
  );

  // Mostrar puntuación final
  ctx.font = FONTS.SUBTITLE;
  ctx.fillText(
    `Puntuación: ${finalScore}`,
    canvas.width / 2,
    canvas.height / 2 + UI_POSITIONS.GAMEOVER_SCORE_Y
  );

  // Mostrar mensaje de nuevo récord
  if (isNewRecord) {
    ctx.fillStyle = COLORS.HIGHLIGHT_RECORD;
    ctx.font = FONTS.SUBTITLE;
    ctx.fillText(
      "¡Nuevo Récord!",
      canvas.width / 2,
      canvas.height / 2 + UI_POSITIONS.GAMEOVER_RECORD_Y
    );
  }

  // Mostrar mensaje de reinicio
  ctx.fillStyle = COLORS.TEXT_SECONDARY;
  ctx.font = FONTS.SMALL;
  ctx.fillText(
    "Click para reiniciar",
    canvas.width / 2,
    canvas.height / 2 + UI_POSITIONS.GAMEOVER_RESTART_Y
  );
}

// Manejar el aterrizaje de la caja
function handleBoxLanding() {
  const currentBox = boxes[current];
  const previousBox = boxes[current - 1];

  // Hallar la diferencia entre el elemento superior e inferior
  const difference = currentBox.x - previousBox.x;

  if (Math.abs(difference) >= currentBox.width) {
    handleGameOver();
    return;
  }

  // Revisar la diferencia del elemento y recortará
  adjustCurrentBox(difference);
  createNewDebris(difference);

  xSpeed += xSpeed > 0 ? 1 : -1;
  current++;
  scrollCounter = BOX_HEIGHT;
  mode = MODES.BOUNCE;

  const currentScore = current - 1;
  score.textContent = currentScore;

  // Actualizar high score si es necesario
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreElement.textContent = highScore;
    localStorage.setItem(HIGH_SCORE_KEY, highScore);
  }

  createNewBox();
}

// Mover caja
function moveAndDetectCollision() {
  const currentBox = boxes[current];
  currentBox.x += xSpeed;

  const isMovingRight = xSpeed > 0;
  const isMovingLeft = xSpeed < 0;

  const hasHitRightWall = currentBox.x + currentBox.width > canvas.width;

  const hasHitLeftWall = currentBox.x < 0;

  if (
    (isMovingRight && hasHitRightWall) ||
    (isMovingLeft && hasHitLeftWall)
  ) {
    xSpeed = -xSpeed;
  }
}

document.addEventListener("keydown", (event) => {
  // Pausar/Reanudar con P o ESC
  if (event.key === "p" || event.key === "P" || event.key === "Escape") {
    event.preventDefault();
    togglePause();
    return;
  }

  // Soltar caja con ESPACIO (solo si no está pausado)
  if (event.key === " " && mode === MODES.BOUNCE) {
    mode = MODES.FALL;
  }
});

canvas.onpointerdown = () => {
  // No permitir clicks cuando está pausado
  if (mode === MODES.PAUSED) return;

  if (mode === MODES.GAMEOVER) {
    restart();
  } else if (mode === MODES.BOUNCE) {
    mode = MODES.FALL;
  }
};

restart();
