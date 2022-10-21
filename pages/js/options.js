const board_size = document.getElementById("board-size");
const board_color = document.getElementById("board-color");
const p0_color = document.getElementById("p0-color");
const p1_color = document.getElementById("p1-color");

const colors = [
  "red",
  "fuchsia",
  "lime",
  "yellow",
  "blue",
  "aqua"
];

const boardSizes = [
  "6x7",
  "8x9"
];

function onPageLoad() {
  let board_size_setting = boardSizes[localStorage.getItem("board-size")];
  let board_color_setting = colors[localStorage.getItem("board-color")];
  let p0_color_setting = colors[localStorage.getItem("p0-color")];
  let p1_color_setting = colors[localStorage.getItem("p1-color")];

  board_size.innerText = board_size_setting;
  board_color.style.backgroundColor = board_color_setting;
  p0_color.style.backgroundColor = p0_color_setting;
  p1_color.style.backgroundColor = p1_color_setting;
}

function nextColor(elemId) {
  var colorIndex = localStorage.getItem(elemId);
  colorIndex = (parseInt(colorIndex) + 1) % colors.length;
  localStorage.setItem(elemId, colorIndex);

  if (localStorage.getItem("p0-color") == localStorage.getItem("p1-color")) {
    colorIndex = (parseInt(colorIndex) + 1) % colors.length;
    localStorage.setItem(elemId, colorIndex);
  }

  let htmlelem = document.getElementById(elemId);
  htmlelem.style.backgroundColor = colors[colorIndex];
}

function nextBoardSize() {
  var boardIndex = localStorage.getItem("board-size");
  boardIndex = (parseInt(boardIndex) + 1) % boardSizes.length;
  localStorage.setItem("board-size", boardIndex);
  board_size.innerText = boardSizes[boardIndex];
}