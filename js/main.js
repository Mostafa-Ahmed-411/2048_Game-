let start = document.getElementById("start");
let reset = document.getElementById("reset");
let cards = Array.from(document.querySelectorAll(".card"));
let scoure = document.getElementById("score");

let register_btn = document.getElementById("register-btn");
let registeration_page = document.getElementById("registeration-page");
let user_name = document.getElementById("user-name");
let heightest_scour_name = document.getElementById("heightest-score-name");
let heightest_scour_scour = document.getElementById("heightest-score-score");

/* -------------------------------- functions ------------------------------- */
loadStoredScorerData();
start.addEventListener("click", startGame);
reset.addEventListener("click", resetGame);
register_btn.addEventListener("click", handleRegisterClick);

let myScore = 0;
let cells = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let cells2 = [[], [], [], []];

let scoreData = {
  userName: "Mostafa Ahmed",
  userScore: 0,
};

/* ---------------------------- // get user name ---------------------------- */
user_name.addEventListener("change", (e) => {
  scoreData.userName = e.target.value;
});
function handleRegisterClick(e) {
  e.preventDefault();
  localStorage.setItem("heightest_scour_data", JSON.stringify(scoreData));
  registeration_page.classList.toggle("d-none");
}
/* -------------------------- start & End the game -------------------------- */
function startGame() {
  for (let i = 0; i < 2; i++) {
    creatRandomCell();
  }
}
function resetGame() {
  if (confirm("Restart the game?")) {
    location.reload();
  }
}
/* --------------------------- // load stored data -------------------------- */
function loadStoredScorerData() {
  let storedData = JSON.parse(localStorage.getItem("heightest_scour_data"));
  if (storedData) {
    heightest_scour_name.innerHTML = storedData.userName;
    heightest_scour_scour.innerHTML = storedData.userScore;
  }
}

/* -------------------------- // updateCells card colors ------------------------- */
function updateCardColors() {
  cards.forEach((card) => {
    let value = card.value;
    if (value > 512) {
      card.classList.add("x1024");
    } else {
      card.classList.add(`x${value}`);
    }
  });
}

function creatRandomCell() {
  try {
    let positionRow = Math.floor(Math.random() * 4);
    let positionCol = Math.floor(Math.random() * 4);
    updateCells(positionRow, positionCol);
  } catch (error) {
    scoreData.userScore = myScore;
    let obj = JSON.parse(localStorage.getItem("heightest_scour_data"));
    if (obj != null) {
      if (myScore >= obj.userScore) {
        localStorage.setItem("heightest_scour_data", JSON.stringify(scoreData));
      }
    } else {
      localStorage.setItem("heightest_scour_data", JSON.stringify(scoreData));
    }

    alert("Game Over : Scouer = " + myScore);
    location.reload();
  }
}

function updateUI(cells) {
  const cardValues = cells.flat();
  cards.forEach((card, index) => {
    card.value = cardValues[index];
    card.classList = [];
    card.classList.add("card");
  });
  // function updateUI(cells) {
  //   for (let row = 0; row < 4; row++) {
  //     for (let col = 0; col < 4; col++) {
  //       cards[row * 4 + col].value = cells[row][col];
  //       cards[row * 4 + col].classList = [];
  //       cards[row * 4 + col].classList.add("card");
  //     }
  //   }
  updateCardColors();
}

function updateCells(row, col) {
  if (cells[row][col] === 0) {
    cells[row][col] = 2;
    updateUI(cells);
  } else {
    creatRandomCell();
  }
}

/* ----------------------- // up , down , left , right ---------------------- */
document.addEventListener("keydown", function (event) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault(); // Stop page from scrolling
  }
  if (event.key === "ArrowUp") checkUp_or_down("up");
  else if (event.key === "ArrowDown") checkUp_or_down("down");
  else if (event.key === "ArrowLeft") checkRight_or_left("left");
  else if (event.key === "ArrowRight") checkRight_or_left("right");
});

/* ----------- // swipe up , swipe down , swipe left , swipe right ---------- */
let startX = 0,
  startY = 0;
const minDistance = 50;
document.addEventListener(
  "touchstart",
  (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  },
  { passive: false }
);

document.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault(); // Stop page scroll while swiping
  },
  { passive: false }
);
document.addEventListener(
  "touchend",
  (e) => {
    let dx = e.changedTouches[0].clientX - startX;
    let dy = e.changedTouches[0].clientY - startY;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < minDistance) {
      console.log("Tap detected, not a swipe");
      return; // Ignore if movement is less than 50px
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      dx > 0 ? checkRight_or_left("right") : checkRight_or_left("left");
    } else {
      dy > 0 ? checkUp_or_down("down") : checkUp_or_down("up");
    }
  },
  { passive: false }
);
/* -------------------------------------------------------------------------- */

function checkRight_or_left(diriction) {
  for (let row = 0; row < 4; row++) {
    cells2[row] = cells[row].filter((element) => element != 0);

    if (diriction == "right") cells2[row].reverse();

    for (let col = 0; col < cells2[row].length - 1; col++) {
      if (cells2[row][col] == cells2[row][col + 1]) {
        cells2[row][col] = cells2[row][col] * 2;
        cells2[row][col + 1] = 0;

        myScore += Number(cells2[row][col]);
        scoure.innerHTML = `${myScore}`;
        /* ----------------------------------- xx ----------------------------------- */
        if (myScore > Number(heightest_scour_scour.innerHTML)) {
          heightest_scour_name.innerHTML = scoreData.userName;
          heightest_scour_scour.innerHTML = myScore;
        }
      }
    }

    cells2[row] = cells2[row].filter((element) => element != 0);
    while (cells2[row].length < 4) {
      cells2[row].push(0);
    }

    if (diriction == "right") cells2[row].reverse();
  }
  cells = [...cells2];

  updateUI(cells);
  creatRandomCell();
}

function checkUp_or_down(diriction) {
  for (let col = 0; col < 4; col++) {
    cells2[col] = [cells[0][col], cells[1][col], cells[2][col], cells[3][col]];

    if (diriction == "down") cells2[col].reverse();
  }

  for (let row = 0; row < 4; row++) {
    cells2[row] = cells2[row].filter((element) => element != 0);
  }
  /* -------------------------------------------------------------------------- */
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < cells2[row].length - 1; col++) {
      if (cells2[row][col] == cells2[row][col + 1]) {
        cells2[row][col] = cells2[row][col] * 2;
        cells2[row][col + 1] = 0;

        myScore += Number(cells2[row][col]);
        scoure.innerHTML = `${myScore}`;
        /* ----------------------------------- xx ----------------------------------- */
        if (myScore > Number(heightest_scour_scour.innerHTML)) {
          heightest_scour_name.innerHTML = scoreData.userName;
          heightest_scour_scour.innerHTML = myScore;
        }
      }
    }
  }
  /* -------------------------------------------------------------------------- */
  for (let row = 0; row < 4; row++) {
    cells2[row] = cells2[row].filter((element) => element != 0);
    while (cells2[row].length < 4) {
      cells2[row].push(0);
    }

    if (diriction == "down") cells2[row].reverse();
  }
  /* -------------------------------------------------------------------------- */
  for (let col = 0; col < 4; col++) {
    cells[col] = [
      cells2[0][col],
      cells2[1][col],
      cells2[2][col],
      cells2[3][col],
    ];
  }
  updateUI(cells);
  creatRandomCell();
}
