let start = document.getElementById("start");
let reset = document.getElementById("reset");
let cards = Array.from(document.querySelectorAll(".card"));
let scoure = document.getElementById("scoure");

let register_btn = document.getElementById("register-btn");
let registeration_page = document.getElementById("registeration-page");
let user_name = document.getElementById("user-name");
let heightest_scour_name = document.getElementById("heightest-scour-name");
let heightest_scour_scour = document.getElementById("heightest-scour-scour");

let myScoure = 0;
let cells = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let cells2 = [[], [], [], []];

let scouerData = {
  userName: "Mostafa Ahmed",
  userScoure: 0,
};

user_name.addEventListener("change", (e) => {
  scouerData.userName = e.target.value;
});

register_btn.addEventListener("click", (e) => {
  registeration_page.classList.toggle("d-none");
  e.preventDefault();
});

function reloadw() {
  let obj = JSON.parse(localStorage.getItem("heightest_scour_data"));

  if (obj != null) {
    // console.log("false");
    heightest_scour_name.innerHTML = obj.userName;
    heightest_scour_scour.innerHTML = obj.userScoure;
  }
}
reloadw();

reset.addEventListener("click", () => {
  alert("Restart The Game");
  location.reload();
});

function matching(cells) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      cards[row * 4 + col].value = cells[row][col];
      cards[row * 4 + col].classList = [];
      cards[row * 4 + col].classList.add("card");
    }
  }
  color();
}

function color() {
  cards.forEach((card) => {
    if (card.value == 0) {
      card.classList.add("x0");
    } else if (card.value == 2) {
      card.classList.add("x2");
    } else if (card.value == 4) {
      card.classList.add("x4");
    } else if (card.value == 8) {
      card.classList.add("x8");
    } else if (card.value == 16) {
      card.classList.add("x16");
    } else if (card.value == 32) {
      card.classList.add("x32");
    } else if (card.value == 64) {
      card.classList.add("x64");
    } else if (card.value == 128) {
      card.classList.add("x128");
    } else if (card.value == 256) {
      card.classList.add("x256");
    } else if (card.value == 512) {
      card.classList.add("x512");
    } else if (card.value > 512) {
      card.classList.add("x1024");
    }
  });
}

start.addEventListener("click", function () {
  for (let loop = 0; loop < 2; loop++) {
    CreatRandomCell();
  }
});

function CreatRandomCell() {
  try {
    let positionRow = Math.floor(Math.random() * 4);
    let positionCol = Math.floor(Math.random() * 4);
    update(positionRow, positionCol);
  } catch (error) {
    scouerData.userScoure = myScoure;
    let obj = JSON.parse(localStorage.getItem("heightest_scour_data"));
    if (obj != null) {
      if (myScoure >= obj.userScoure) {
        localStorage.setItem(
          "heightest_scour_data",
          JSON.stringify(scouerData)
        );
      }
    } else {
      localStorage.setItem("heightest_scour_data", JSON.stringify(scouerData));
    }

    alert("Game Over : Scouer = " + myScoure);
    location.reload();
  }
}

function update(positionRow, positionCol) {
  if (cells[positionRow][positionCol] == 0) {
    // console.log("positionRow : " + positionRow + "   positionCol : " + positionCol );
    cells[positionRow][positionCol] = 2;
    matching(cells);
  } else {
    CreatRandomCell();
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp") checkUp_or_down("up");
  else if (event.key === "ArrowDown") checkUp_or_down("down");
  else if (event.key === "ArrowLeft") checkRight_or_left("left");
  else if (event.key === "ArrowRight") checkRight_or_left("right");
});

function checkRight_or_left(diriction) {
  for (let row = 0; row < 4; row++) {
    cells2[row] = cells[row].filter((element) => element != 0);

    if (diriction == "right") cells2[row].reverse();

    for (let col = 0; col < cells2[row].length - 1; col++) {
      if (cells2[row][col] == cells2[row][col + 1]) {
        cells2[row][col] = cells2[row][col] * 2;
        cells2[row][col + 1] = 0;

        myScoure += Number(cells2[row][col]);
        scoure.innerHTML = `${myScoure}`;
      }
    }

    cells2[row] = cells2[row].filter((element) => element != 0);
    while (cells2[row].length < 4) {
      cells2[row].push(0);
    }

    if (diriction == "right") cells2[row].reverse();
  }
  cells = [...cells2];

  matching(cells);
  CreatRandomCell();
}

function checkUp_or_down(diriction) {
  for (let col = 0; col < 4; col++) {
    cells2[col] = [cells[0][col], cells[1][col], cells[2][col], cells[3][col]];

    if (diriction == "down") cells2[col].reverse();
  }

  for (let row = 0; row < 4; row++) {
    cells2[row] = cells2[row].filter((element) => element != 0);
    // console.log(cells2[row]);
  }
  /* -------------------------------------------------------------------------- */
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < cells2[row].length - 1; col++) {
      if (cells2[row][col] == cells2[row][col + 1]) {
        cells2[row][col] = cells2[row][col] * 2;
        cells2[row][col + 1] = 0;

        myScoure += Number(cells2[row][col]);
        scoure.innerHTML = `${myScoure}`;
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
  matching(cells);
  CreatRandomCell();
}
