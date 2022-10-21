function onPageLoad() {
  if (localStorage.getItem("board-color") == null) {
    localStorage.setItem("board-size", 0);
    localStorage.setItem("board-color", 4);
    localStorage.setItem("p0-color", 0);
    localStorage.setItem("p1-color", 3);
  }
}