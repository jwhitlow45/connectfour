const tablehtml = document.getElementById("board");
const moveplayer = document.getElementById("move-player");
const movecount = document.getElementById("move-count");
const alerthtml = document.getElementById("alert");

class Board {
  #playerMove = 0;
  
  constructor(row, col, color0="red", color1="yellow") {
    this.rowsize = row;
    this.colsize = col;
    this.grid = Array.from(Array(row), () => new Array(col));
    this.colors = [color0, color1];
  }

  init() {
    moveplayer.innerText = this.colors[this.#playerMove];
    this.drawBoard();
  }

  #getPlayerToMove() {
    this.#playerMove = Math.abs(this.#playerMove - 1);
    return Math.abs(this.#playerMove - 1);
  }
  
  #findMoveRow(col) {
    for (let i = this.rowsize - 1; i >=0; i--) {
      if (this.grid[i][col] != undefined) {
        continue;
      }
      return i;
    }
    // not a valid move
    return -1;
  }

  move(col) {
    let row = this.#findMoveRow(col);

    // verify move is valid
    if (row == -1) {
      console.log("Invalid move!");
      alerthtml.innerText = "Invalid Move!";
      return;
    }

    // get whos turn it is
    let player = this.#getPlayerToMove();
    
    // play move as current player
    this.grid[row][col] = player;
    let cell = document.getElementById(row+"-"+col);
    cell.classList.add("p"+player);
    
    // update hud
    moveplayer.innerText = this.colors[this.#playerMove];
    movecount.innerText = parseInt(movecount.innerText) + 1;

    // check for draw
    if (movecount.innerText == 42) {
      alerthtml.innerText = "Draw!";
    }
  }

  drawBoard() {
    for (let i = 0; i < this.rowsize; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < this.colsize; j++) {
          let td = document.createElement("td");
          td.classList.add("cell");
          td.id = i+"-"+j;
          td.onclick = function() { handleClick(this.id); };
          row.appendChild(td);
      }
      tablehtml.appendChild(row);
    }
  }
}

const GameBoard = new Board(6, 7);
GameBoard.init();

function handleClick(eventid) {
  let coords = eventid.split("-");
  GameBoard.move(parseInt(coords[1]));
}