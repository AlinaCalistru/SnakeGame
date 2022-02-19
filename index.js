/**
 * Set an object into localStorage memory by converting it
 * to a JSON string
 */
function setObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieve an object from localStorage by parsing it from
 * JSON string to an object
 */
function getObject(key) {
  var value = localStorage.getItem(key);
  return value && JSON.parse(value);
}

/**
 * Create the playground grid of divs
 */
function createGrid() {
  for (let el = 0; el < width * width; el++) {
    const element = document.createElement("div");
    element.classList.add("element");
    grid.appendChild(element);
    elements.push(element);
  }
}

/**
 * Start the game
 */
function startGame() {
  document.getElementById("game-over").style.display = "none";
  currentSnake.forEach((index) => elements[index].classList.remove("snake"));
  elements[flameIndex].classList.remove("flame");
  clearInterval(timerId);
  currentSnake = [2, 1, 0];
  score = 0;
  scoreDisplay.textContent = score;
  direction = 1;
  intervalTime = 1000;

  generateFlames();

  elements[2].classList.add("snake-head");
  currentSnake.forEach((index) => elements[index].classList.add("snake"));
  timerId = setInterval(move, intervalTime);
  return false;
}

/**
 * Checks if it is game over otherwise increases the score and
 * snake lenght
 */
function move() {
  if (
    (currentSnake[0] + width >= width * width && direction === width) || //if snake has hit bottom
    (currentSnake[0] % width === width - 1 && direction === 1) || //if snake has hit right wall
    (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
    (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
    elements[currentSnake[0] + direction].classList.contains("snake")
  ) {
    // Game Over!
    // Display Game Over message 
    document.getElementById("game-over").style.display = "block";
    
    //Add current player score to the Leaderboard localStorage variable 
    let leaderBoard = getObject("leaderBoard");
    if (leaderBoard === null) {
      leaderBoard = [];
    }

    leaderBoard.push({ score: score, name: currentPlayer });
    setObject("leaderBoard", leaderBoard);
    displayLeaderBoard();
    return clearInterval(timerId);
  }

  const tail = currentSnake.pop();
  elements[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
  if (elements[currentSnake[0]].classList.contains("flame")) {
    elements[currentSnake[0]].classList.remove("flame");
    elements[tail].classList.add("snake");
    currentSnake.push(tail);
    generateFlames();

    score++;
    scoreDisplay.textContent = score;
    clearInterval(timerId);
    intervalTime = intervalTime * speed;
    timerId = setInterval(move, intervalTime);
  }

  currentSnake.forEach((index) =>
    elements[index].classList.remove("snake-head")
  );
  elements[currentSnake[0]].classList.add("snake");
  elements[currentSnake[0]].classList.add("snake-head");
}

/**
 * Generates random flames on the grid
 */
function generateFlames() {
  do {
    flameIndex = Math.floor(Math.random() * elements.length);
  } while (elements[flameIndex].classList.contains("snake"));
  elements[flameIndex].classList.add("flame");
}

/**
 * Register the pressed keys and moves the direction of the snake
 * @param {*} e the key pressed
 */
function control(e) {
  e = e || window.event;
  if (e.key === "ArrowUp") {
    direction = -width;
  } else if (e.key === "ArrowDown") {
    direction = +width;
  } else if (e.key === "ArrowRight") {
    direction = 1;
  } else if (e.key === "ArrowLeft") {
    direction = -1;
  }
}

/**
 * Checks if there is a player in localStorage otherwise displays the
 *  register form
 */
function checkPlayer() {
  currentPlayer = localStorage.getItem("player");

  if (currentPlayer === null) {
    existingUserContainer.style.display = "none";
    newUserContainer.style.display = "block";
  } else {
    existingUserContainer.style.display = "block";
    newUserContainer.style.display = "none";
    let playerPlaceholder = existingUserContainer.getElementsByTagName("span");
    playerPlaceholder[0].textContent = currentPlayer;
  }
  return false;
}

/**
 * Set localStorage variable with the player name
 */
function newPlayer(event) {
  event.preventDefault();
  localStorage.setItem("player", document.getElementById("player").value);
  checkPlayer();
  
}

/**
 * Removes player variable from localStorage and displays register form
 */
function changePlayer() {
  localStorage.removeItem("player");
  checkPlayer();
  return false;
}

/**
 * Retrieves the Leaderboard from localStorage and generates
 * an ordered list
 */
function displayLeaderBoard() {
  let leaderBoard = getObject("leaderBoard");
  if (leaderBoard === null) {
    leaderBoard = [];
  }
  if (leaderBoard.length > 1) {
    leaderBoard.sort(function (a, b) {
      let keyA = a.score,
        keyB = b.score;

      // Compare the 2 numbers
      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
      return 0;
    });
  }

  const topPlayers = document.getElementById("leaderboard");
  topPlayers.innerHTML = "";
  leaderBoard.map((player, index) => {
    if (index < 15) {
      topPlayers.innerHTML += `<li><span>${index + 1} ${
        player.name
      }</span> <span>${player.score}</span></li>`;
    }
  });
}

// ---------------------------------------------------------------------------

//Initial setup
const grid = document.querySelector(".grid");
const startButtons = document.getElementsByClassName("start-btn");
const scoreDisplay = document.querySelector("#score");
let elements = [];
let currentSnake = [2, 1, 0];
let direction = 1;
let width = 20;
let flameIndex = 0;
let score = 0;
let intervalTime = 1000;
let speed = 0.9;
let timerId = 0;
let leaderBoard = getObject("leaderBoard") || [];
let currentPlayer = localStorage.getItem("player");

// Generate the playground grid
createGrid();

// Attach dragon head to the snake :)
elements[2].classList.add("snake-head");
currentSnake.forEach((index) => elements[index].classList.add("snake"));

// Generate initial flame
generateFlames();

// Register when an arrow is pressed
document.addEventListener("keydown", control);

// Attach click event for start game buttons
Array.from(startButtons).forEach(function (element) {
  element.addEventListener("click", startGame);
});

// create and manage players functionality
const existingUserContainer = document.getElementById("existing-user");
const newUserContainer = document.getElementById("new-user");

// Verifies if there is a player set in localStorage or display register form
checkPlayer();

// Attach click event for new player form submision
const registerBtn = document.getElementById("register-btn");
registerBtn.addEventListener("click", newPlayer);

// Attach click event for change player buttons
const changePlayerBtns = document.getElementsByClassName("change-player-btn");
Array.from(changePlayerBtns).forEach(function (element) {
  element.addEventListener("click", changePlayer);
});

// Genarate Leaderboard
displayLeaderBoard();
