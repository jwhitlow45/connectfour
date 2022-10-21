function onPageLoad() {
  if (localStorage.getItem("board-color") == null) {
    localStorage.setItem("board-size", "6x7");
    localStorage.setItem("board-color", "blue");
    localStorage.setItem("p0-color", "red");
    localStorage.setItem("p1-color", "yellow");
  }
}