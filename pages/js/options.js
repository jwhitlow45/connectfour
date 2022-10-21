import { colors, board_sizes } from './config.js';

const board_size = document.getElementById("board-size");
const board_color = document.getElementById("board-color");
const p0_color = document.getElementById("p0-color");
const p1_color = document.getElementById("p1-color");

board_size.addEventListener('click', nextBoardSize)
board_color.addEventListener('click', nextColor)
p0_color.addEventListener('click', nextColor)
p1_color.addEventListener('click', nextColor)

function onPageLoad() {
  let board_size_setting = board_sizes[localStorage.getItem("board-size")];
  let board_color_setting = colors[localStorage.getItem("board-color")];
  let p0_color_setting = colors[localStorage.getItem("p0-color")];
  let p1_color_setting = colors[localStorage.getItem("p1-color")];

  board_size.innerText = board_size_setting;
  board_color.style.backgroundColor = board_color_setting;
  p0_color.style.backgroundColor = p0_color_setting;
  p1_color.style.backgroundColor = p1_color_setting;
}

function nextColor() {
  var colorIndex = localStorage.getItem(this.id);
  colorIndex = (parseInt(colorIndex) + 1) % colors.length;
  localStorage.setItem(this.id, colorIndex);

  if (localStorage.getItem("p0-color") == localStorage.getItem("p1-color")) {
    colorIndex = (parseInt(colorIndex) + 1) % colors.length;
    localStorage.setItem(this.id, colorIndex);
  }

  let htmlelem = document.getElementById(this.id);
  htmlelem.style.backgroundColor = colors[colorIndex];
}

function nextBoardSize() {
  var boardIndex = localStorage.getItem("board-size");
  boardIndex = (parseInt(boardIndex) + 1) % board_sizes.length;
  localStorage.setItem("board-size", boardIndex);
  board_size.innerText = board_sizes[boardIndex];
}

onPageLoad();