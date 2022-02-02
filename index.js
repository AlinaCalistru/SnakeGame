function setObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getObject(key) {
  var value = localStorage.getItem(key);
  return value && JSON.parse(value);
}

const grid = document.querySelector(".grid");
const startButton = document.querySelector("#start");
const scoreDisplay = document.querySelector("#score");
let elements = [];
let currentSnake = [2, 1, 0];
let direction = 1;
let width = 20;
let appleIndex = 0;
let score = 0;
let intervalTime = 1000;
let speed = 0.9;
let timerId = 0;
let leaderBoard = getObject("leaderBoard") || [];
let currentPlayer = localStorage.getItem("player");

console.log(leaderBoard);

function createGrid() {
  for (let el = 0; el < width * width; el++) {
    const element = document.createElement("div");
    element.classList.add("element");
    grid.appendChild(element);
    elements.push(element);
  }
}
createGrid();
elements[2].classList.add("snake-head");
currentSnake.forEach((index) => elements[index].classList.add("snake"));

function startGame() {
  currentSnake.forEach((index) => elements[index].classList.remove("snake"));
  elements[appleIndex].classList.remove("apple");
  clearInterval(timerId);
  currentSnake = [2, 1, 0];
  score = 0;
  scoreDisplay.textContent = score;
  direction = 1;
  intervalTime = 1000;

  generateApples();

  elements[2].classList.add("snake-head");
  currentSnake.forEach((index) => elements[index].classList.add("snake"));
  timerId = setInterval(move, intervalTime);
}

function move() {
  console.log(currentSnake[0] + direction);
  console.log(elements[currentSnake[0] + direction]);
  if (
    (currentSnake[0] + width >= width * width && direction === width) ||
    (currentSnake[0] % width === width - 1 && direction === 1) ||
    (currentSnake[0] % width === 0 && direction === -1) ||
    (currentSnake[0] - width < 0 && direction === -width) ||
    elements[currentSnake[0] + direction].classList.contains("snake")
  ) {
    console.log("Game Over!");
    let leaderBoard = getObject("leaderBoard");
    if (leaderBoard === null){
      leaderBoard = [];
    }
    console.log(leaderBoard);
    leaderBoard.push({ score: score, name: currentPlayer });
    setObject("leaderBoard", leaderBoard);
    displayLeaderBoard()
    return clearInterval(timerId);
  }

  const tail = currentSnake.pop();
  elements[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
  if (elements[currentSnake[0]].classList.contains("apple")) {
    elements[currentSnake[0]].classList.remove("apple");
    elements[tail].classList.add("snake");
    currentSnake.push(tail);
    generateApples();

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

function generateApples() {
  do {
    appleIndex = Math.floor(Math.random() * elements.length);
  } while (elements[appleIndex].classList.contains("snake"));
  elements[appleIndex].classList.add("apple");
}
generateApples();

function control(e) {
  console.log(e.key);
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
document.addEventListener("keydown", control);
startButton.addEventListener("click", startGame);

// create and manage players functionality

const existingUserContainer = document.getElementById("existing-user");
const newUserContainer = document.getElementById("new-user");

function checkPlayer() {
  let currentPlayer = localStorage.getItem("player");
  console.log(currentPlayer);
  if (currentPlayer === null) {
    existingUserContainer.style.display = "none";
    newUserContainer.style.display = "block";
  } else {
    existingUserContainer.style.display = "block";
    newUserContainer.style.display = "none";
    let playerPlaceholder = existingUserContainer.getElementsByTagName("span");
    playerPlaceholder[0].textContent = currentPlayer;
  }
}

checkPlayer();

// create player
const registerBtn = document.getElementById("register-btn");
registerBtn.addEventListener("click", newPlayer);

function newPlayer() {
  localStorage.setItem("player", document.getElementById("player").value);
  checkPlayer();
}

const changePlayerBtn = document.getElementById("change-player-btn");
changePlayerBtn.addEventListener("click", changePlayer);
function changePlayer() {
  localStorage.removeItem("player");
  checkPlayer();
}

// Leaderboard

function displayLeaderBoard() {
 let leaderBoard = getObject("leaderBoard");
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
    topPlayers.innerHTML += `<li><span>${index+1} ${player.name}</span> <span>${player.score}</span></li>`;
    // return (`<li>{player.score} ${player.name}</li>`)
  });
}

displayLeaderBoard();
