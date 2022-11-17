import { colors, board_sizes } from './config.js';

const tablehtml = document.getElementById("board");
const moveplayer = document.getElementById("move-player");
const movecount = document.getElementById("move-count");
const alerthtml = document.getElementById("alert");
const timecount = document.getElementById("time-count");
const replay = document.getElementById("replay");

class Board {
  #playerMove = 0;
  #nummoves = 0;
  
  constructor(row, col, color0, color1, winnum = 4) {
    this.rowsize = row;
    this.colsize = col;
    this.grid = Array.from(Array(row), () => new Array(col));
    this.colors = [color0, color1];
    this.winnum = winnum;
  }

  init() {
    moveplayer.innerText = this.colors[this.#playerMove];
    this.#setColors();
    this.#drawBoard();
  }

  #setColors() {
    let stylesheet = document.styleSheets[0];

    stylesheet.insertRule(".p0 { background-color: " + this.colors[0] +"; }", stylesheet.cssRules.length);
    stylesheet.insertRule(".p1 { background-color: " + this.colors[1] +"; }", stylesheet.cssRules.length);
    stylesheet.insertRule(".cell { border: 3px " + colors[localStorage.getItem("board-color")] + " solid; }", stylesheet.cssRules.length);
    
  }

  #getPlayerToMove() {
    this.#playerMove = Math.abs(this.#playerMove - 1);
    return Math.abs(this.#playerMove - 1);
  }

  peekPlayerToMove() {
    return this.#playerMove;
  }
  
  findMoveRow(col) {
    for (let i = this.rowsize - 1; i >=0; i--) {
      if (this.grid[i][col] != undefined) {
        continue;
      }
      return i;
    }
    // not a valid move
    return -1;
  }

  #drawBoard() {
    for (let i = 0; i < this.rowsize; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < this.colsize; j++) {
          let td = document.createElement("td");
          td.classList.add("cell");
          td.id = i+"-"+j;
          td.addEventListener('click', function() { handleClick(this.id); showPlacement(this.id)});
          td.onmouseenter = function() { showPlacement(this.id); }
          td.onmouseleave = function() { hidePlacement(this.id); }
          row.appendChild(td);
      }
      tablehtml.appendChild(row);
    }
  }

  #inBounds(row, col) {
    return row >= 0 && col >= 0 && row < this.rowsize && col < this.colsize;
  }

  #checkWin(row, col) {
    // check every direction (left, right, up, down, diags) for win
    let moves = [[0,1], [1,0], [1,1], [1,-1]];
    let player = this.grid[row][col];

    for (let move of moves) {
      let count = 1

      // check in one direction, then opposite direction while
      // tracking the count of nodes from current player
      for (let mult of [-1,1]) {
        // start from starting node
        let rowcur = row;
        let colcur = col;

        let rowdir = move[0] * mult;
        let coldir = move[1] * mult;
        while (this.#inBounds(rowcur + rowdir, colcur + coldir)) {
          rowcur += rowdir;
          colcur += coldir;
  
          if (this.grid[rowcur][colcur] == player) {
            count += 1;
          } else {
            break;
          }
        }
      }

      if (count >= 4) {
        return true;
      }
    }
    return false;
  }

  move(col) {
    let row = this.findMoveRow(col);

    // verify move is valid
    if (row == -1) {
      alerthtml.innerText = "Invalid Move!";
      return;
    }
    alerthtml.innerText = "";

    // get whos turn it is
    let player = this.#getPlayerToMove();
    
    // play move as current player
    this.grid[row][col] = player;
    let cell = document.getElementById(row+"-"+col);
    cell.classList.add("p"+player);
    this.#nummoves += 1;
    
    // update hud
    moveplayer.innerText = this.colors[this.#playerMove];
    movecount.innerText = this.#nummoves;

    // check for draw
    if (this.#nummoves == 42) {
      alerthtml.innerText = "Draw!";
      return true;
    }

    // check for win
    if (this.#checkWin(row, col)) {
      alerthtml.innerText = this.colors[player] + " wins!";
      return true;
    }

    return false;
  }
}

var gameOver = false;
const board_size = board_sizes[localStorage.getItem("board-size")].split('x');
const color0 = colors[localStorage.getItem("p0-color")];
const color1 = colors[localStorage.getItem("p1-color")];
const GameBoard = new Board(parseInt(board_size[0]), parseInt(board_size[1]), color0, color1);
GameBoard.init();

function handleClick(eventid) {
  if (gameOver) {
    return;
  }
  let coords = eventid.split("-");
  gameOver = GameBoard.move(parseInt(coords[1]));
  if (gameOver) {
    replay.innerText = "Click here to play again!";
    replay.onclick = function() { window.location.reload(); }
    let cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
      let newcell = cell.cloneNode(true);
      cell.parentNode.replaceChild(newcell, cell);
    }
  }
}

function showPlacement(elemId) {
  // create div showing where current move will be played
  const moveindicator = document.createElement("div");
  moveindicator.style.borderRadius = "inherit";
  moveindicator.style.opacity = 0.25;
  moveindicator.style.backgroundColor = GameBoard.colors[GameBoard.peekPlayerToMove()];
  moveindicator.style.height = "inherit"
  moveindicator.style.width = "inherit"

  // get move placement
  let col = elemId.split('-')[1];
  let row = GameBoard.findMoveRow(parseInt(col));

  // put indicator in target cell
  const targethtml = document.getElementById(row + "-" + col);
  if (targethtml == null) return;

  targethtml.appendChild(moveindicator);
}

function hidePlacement(elemId) { 
  let col = elemId.split('-')[1];
  let row = GameBoard.findMoveRow(parseInt(col));

  // remove move indicator
  const targethtml = document.getElementById(row + "-" + col)
  if (targethtml == null) return;
  
  targethtml.innerHTML = "";
}

var pageloadtime = new Date();
let gametime = setInterval(function() {
  let now = new Date();
  let secs = (now.getTime() - pageloadtime.getTime()) / 1000;
  let strMins = String(Math.floor(secs / 60)).padStart(2, '0');
  let strSecs = String(Math.floor(secs % 60)).padStart(2, '0');
  timecount.innerText = strMins + ":" + strSecs;
}, 1000);