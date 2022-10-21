const board_size = document.getElementById("board-size");
const board_color = document.getElementById("board-color");
const p0_color = document.getElementById("p0-color");
const p1_color = document.getElementById("p1-color");

function onPageLoad() {
  let board_size_setting = localStorage.getItem("board-size");
  let board_color_setting = localStorage.getItem("board-color");
  let p0_color_setting = localStorage.getItem("p0-color");
  let p1_color_setting = localStorage.getItem("p1-color");

  board_size.innerText = board_size_setting;
  board_color.style.backgroundColor = board_color_setting;
  p0_color.style.backgroundColor = p0_color_setting;
  p1_color.style.backgroundColor = p1_color_setting;

}
