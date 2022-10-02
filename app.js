let matrix = [];
let rows = 20,
  cols = 60;
for (let i = 0; i < rows; i++) {
  let temp = [];
  for (let j = 0; j < cols; j++) {
    temp.push(100);
  }
  matrix[i] = temp;
}

if (!localStorage.getItem("matrix"))
  localStorage.setItem("matrix", JSON.stringify(matrix));

function updateMat(ind1, ind2, val) {
  const temp = JSON.parse(localStorage.getItem("matrix"));
  temp[ind1][ind2] = val;
  localStorage.setItem("matrix", JSON.stringify(temp));
}

var curr = localStorage.getItem("curr")
  ? JSON.parse(localStorage.getItem("curr"))
  : { 0: 1, 1: 1 };

const app = document.getElementById("app1");
JSON.parse(localStorage.getItem("matrix")).forEach((row, i) => {
  const matrixContainer = document.createElement("div");
  matrixContainer.classList.add("matContainer");
  row.forEach((col, j) => {
    const matrixElement = document.createElement("span");
    matrixElement.classList.add("matElement");
    matrixElement.setAttribute("id", `${i}-${j}`);
    if (curr[0] == i && curr[1] == j) {
      matrixElement.classList.add("currElem");
    }
    if (col === 300) {
      matrixElement.classList.add("visited");
    }
    if (col === 400) {
      matrixElement.classList.add("focused");
    }
    if (col === 500) {
      matrixElement.classList.add("captured");
    }
    matrixContainer.appendChild(matrixElement);
  });
  app.appendChild(matrixContainer);
});

////////////////////////////

var a = 1;
var initial = -1;
var stack = [[curr[0], curr[1]]];
var visited = [];
var focusedarr = [];
var captured = [];
var running = 1; //not running stage
async function capturing(input) {
  return new Promise((resolve, reject) => {
    console.log("capturing");

    setTimeout(() => {
      updateMat(input[0], input[1], 500);
      captured.push(input);

      for (let i = 0; i < captured.length; i++) {
        document.getElementById(
          `${captured[i][0]}-${captured[i][1]}`
        ).style.background = "black";
      }

      resolve();
    }, 2000);
  });
}

async function focused(initial) {
  running = 0; //
  console.log("focusing");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      running = 1;
      updateMat(initial[0], initial[1], 400);
      focusedarr.push(initial);
      console.log("focused", focusedarr);
      document.getElementById(`${initial[0]}-${initial[1]}`).style.background =
        "blue";
      if (stack[stack.length - 1] === initial) {
        resolve(1);
      }
      reject("hi");
    }, 3000);
  });
}

async function focusing(input) {
  if (initial === -1) {
    initial = stack[0];
  } else {
    initial = stack[stack.length - 1];
  }
  focused(initial)
    .then(() => {
      capturing(initial).then(() => {
        console.log("captured", captured);
      });
    })
    .catch(() => {
      console.log("catch");
      initial = stack[stack.length - 1];
      stack.length = 0;
      stack.push(initial);
      initial = -1;

      focusing();
    });
}

document.addEventListener("keyup", (e) => {
    let temp = curr;
    document
      .getElementById(`${temp[0]}-${temp[1]}`)
      .classList.remove("currElem");
    document.getElementById(`${temp[0]}-${temp[1]}`).classList.add("visited");
    visited.push(curr);

    if (e.code === "ArrowLeft") {
      curr[1] = curr[1] - 1;
      localStorage.setItem("curr", JSON.stringify(curr));
    } else if (e.code === "ArrowRight") {
      curr[1] = curr[1] + 1;
      localStorage.setItem("curr", JSON.stringify(curr));
    } else if (e.code === "ArrowUp") {
      curr[0] = curr[0] - 1;
      localStorage.setItem("curr", JSON.stringify(curr));
    } else if (e.code === "ArrowDown") {
      curr[0] = curr[0] + 1;
      localStorage.setItem("curr", JSON.stringify(curr));
    }
    document.getElementById(`${curr[0]}-${curr[1]}`).classList.add("currElem");
    updateMat(curr[0], curr[1], 300);
    stack.push(Object.values(curr).slice());
    console.log(`${curr} was pushed in stack`);
    if (running) {
      focusing();
    }
});
