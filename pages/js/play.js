import { colors, board_sizes } from './config.js';

const tablehtml = document.getElementById("board");
const moveplayer = document.getElementById("move-player");
const movecount = document.getElementById("move-count");
const alerthtml = document.getElementById("alert");
const timecount = document.getElementById("time-count");
const replay = document.getElementById("replay");
const flipbutton = document.getElementById("flip-button");

class Board {
  #nummoves = 0;
  
  constructor(row, col, color0, color1, winnum = 4) {
    this.numrows = row;
    this.numcols = col;
    this.grid = Array.from(Array(row), () => new Array(col));
    this.colors = [color0, color1];
    this.winnum = winnum;
    this.p0flip = true;
    this.p1flip = true;
    this.playerMove = 0;
  }

  init() {
    moveplayer.innerText = this.colors[this.playerMove];
    this.#setColors();
    this.drawBoard();
  }

  #setColors() {
    let stylesheet = document.styleSheets[0];

    stylesheet.insertRule(".p0 { background-color: " + this.colors[0] +"; }", stylesheet.cssRules.length);
    stylesheet.insertRule(".p1 { background-color: " + this.colors[1] +"; }", stylesheet.cssRules.length);
    stylesheet.insertRule(".cell { border: 3px " + colors[localStorage.getItem("board-color")] + " solid; }", stylesheet.cssRules.length);
    
  }

  #getPlayerToMove() {
    this.playerMove = Math.abs(this.playerMove - 1);
    return Math.abs(this.playerMove - 1);
  }

  peekPlayerToMove() {
    return this.playerMove;
  }
  
  findMoveRow(col) {
    for (let i = this.numrows - 1; i >=0; i--) {
      if (this.grid[i][col] != undefined) {
        continue;
      }
      return i;
    }
    // not a valid move
    return -1;
  }

  drawBoard() {
    for (let i = 0; i < this.numrows; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < this.numcols; j++) {
          let td = document.createElement("td");
          td.classList.add("cell");
          td.id = i+"-"+j;
          td.addEventListener('click', function() { handleClick(this.id); showPlacement(this.id); });
          td.onmouseenter = function() { showPlacement(this.id); }
          td.onmouseleave = function() { hidePlacement(this.id); }
          
          // add discs to cell if needed
          if (this.grid[i][j] == 0) td.classList.add('p0');
          else if (this.grid[i][j] == 1) td.classList.add('p1');
          
          row.appendChild(td);
      }
      tablehtml.appendChild(row);
    }
  }

  inBounds(row, col) {
    return row >= 0 && col >= 0 && row < this.numrows && col < this.numcols;
  }

  checkWin(row, col) {
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
        while (this.inBounds(rowcur + rowdir, colcur + coldir)) {
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
    moveplayer.innerText = this.colors[this.playerMove];
    movecount.innerText = this.#nummoves;

    // check for draw
    if (this.#nummoves == 42) {
      result = -1;
      alerthtml.innerText = "Draw!";
      return true;
    }

    // check for win
    if (this.checkWin(row, col)) {
      result = player;
      alerthtml.innerText = this.colors[player] + " wins!";
      return true;
    }

    return false;
  }

  flip() {
    let NewBoard = new Board(this.numrows, this.numcols, this.color0, this.color1);
    
    // flip board by playing moves in new board from top of each column to bottom
    for (let i = 0; i < this.numrows; i++) {
      for (let j = 0; j < this.numcols; j++) {
        if (this.grid[i][j] == undefined) continue;

        NewBoard.playerMove = this.grid[i][j];
        NewBoard.move(j);
      }
    }

    this.grid = NewBoard.grid;
    tablehtml.innerHTML = "";
    this.drawBoard();
    moveplayer.innerText = this.colors[this.playerMove];
  }

  countDiscSequences(player, size) {
    let sequences = 0;

    // horizontal sequences
    for (let i = 0; i < this.numrows; i++) {
      let count = 0;
      for (let j = 0; j < this.numcols; j++) {
        if (this.grid[i][j] != player) {
          count = 0;
          continue;
        }
        count += 1
        if (count >= size) {
          sequences += 1;
        }
      }
    }

    // vertical sequences
    for (let j = 0; j < this.numcols; j++) {
      let count = 0;
      for (let i = 0; i < this.numrows; i++) {
        if (this.grid[i][j] != player) {
          count = 0;
          continue;
        }
        count += 1
        if (count >= size) {
          sequences += 1;
        }
      }
    }

    const dirs = [[1,1],[1,-1]];

    // check top row in both diagonal directions
    for (let dir of dirs) {
      for (let col = 0; col <= this.numcols; col++) {
        let count = 0;
        let currow = 0;
        let curcol = col;
        if (this.grid[currow][curcol] == player) // start count at 1 if starting on player's tile
          count++;
        while (this.inBounds(currow + dir[0], curcol + dir[1])) {
          currow += dir[0];
          curcol += dir[1];

          if (this.grid[currow][curcol] == player) {
            count += 1;
            if (count >= size) {
              sequences += 1;
              count = 0;
            }
          } else {
            count = 0;
          }
        }
      }
    }

    let rows = [];  // get row which need to be checked on left and right side of grid
    for (let i = 1; i <= this.grid[0].length - size; i++) {
      rows.push(i);
    }

    for (let row of rows) { // count diagonals starting from left side of grid
      let dir = [1,1];
      let currow = row;
      let curcol = 0;
      let count = 0;
      if (this.grid[currow][curcol] == player) {
        count += 1;
      }
      while (this.inBounds(currow + dir[0], curcol + dir[1])) {
        currow += dir[0];
        curcol += dir[1];

        if (this.grid[currow][curcol] == player) {
          count += 1;
          if (count >= size) {
            sequences += 1;
            count = 0;
          }
        } else {
          count = 0;
        }
      }
    }

    for (let row of rows) { // count diagonals starting from right side of grid
      let dir = [1,-1];
      let currow = row;
      let curcol = this.numcols - 1;
      let count = 0;
      if (this.grid[currow][curcol] == player) {
        count += 1;
      }
      while (this.inBounds(currow + dir[0], curcol + dir[1])) {
        currow += dir[0];
        curcol += dir[1];

        if (this.grid[currow][curcol] == player) {
          count += 1;
          if (count >= size) {
            sequences += 1;
            count = 0;
          }
        } else {
          count = 0;
        }
      }
    }

    return sequences;
  }
}

var gameOver = false;
let result;
const board_size = board_sizes[localStorage.getItem("board-size")].split('x');
const color0 = colors[localStorage.getItem("p0-color")];
const color1 = colors[localStorage.getItem("p1-color")];
const three_count_labels = document.getElementsByClassName('three-count-label');
three_count_labels[0].innerText = 'Connect Three ' + color0;
three_count_labels[1].innerText = 'Connect Three ' + color1;
const GameBoard = new Board(parseInt(board_size[0]), parseInt(board_size[1]), color0, color1);
GameBoard.init();
flipbutton.addEventListener('click', function() { handleFlip(); });

function handleGameOver() {
  // stop timer
  clearInterval(gametime);
  // show button to play again
  replay.innerText = "Click here to play again!";
  replay.onclick = function() { window.location.reload(); }

  // remove event listeners once game is over by cloning and replacing cells
  let cells = document.getElementsByClassName('cell');
  for (let cell of cells) {
    let newcell = cell.cloneNode(true);
    cell.parentNode.replaceChild(newcell, cell);
  }

  updateDBStats();
}

function handleClick(eventid) {
  if (!gameOver) {
    let coords = eventid.split("-");
    gameOver = GameBoard.move(parseInt(coords[1]));
    const three_counts = document.getElementsByClassName('three-count');
    three_counts[0].innerText = GameBoard.countDiscSequences(0, 3);
    three_counts[1].innerText = GameBoard.countDiscSequences(1, 3);

    if (!GameBoard.p0flip && GameBoard.peekPlayerToMove() == 0) {
      flipbutton.style.opacity = '50%';
    } else if (!GameBoard.p1flip && GameBoard.peekPlayerToMove() == 1) {
      flipbutton.style.opacity = '50%';
    } else {
      flipbutton.style.opacity = '100%';
    }
  }
  if (gameOver) {
    handleGameOver();
  }
}

function handleFlip() {
  let player = GameBoard.peekPlayerToMove();
  if (player == 0) { // player 0
    if (!GameBoard.p0flip) { // check if powerup has been used
      alerthtml.innerHTML = "Player " + GameBoard.colors[player] + " flip already used!";
      return;
    }
    GameBoard.p0flip = false; // set powerup as used
  } else { // player 1
    if (!GameBoard.p1flip) {
      alerthtml.innerHTML = "Player " + GameBoard.colors[player] + " flip already used!";
      return;
    }
    GameBoard.p1flip = false;
  }
  GameBoard.flip();
  flipbutton.style.opacity = '50%';
  alerthtml.innerHTML = "Player " + GameBoard.colors[player] + " used flip!";
  const three_counts = document.getElementsByClassName('three-count');
  three_counts[0].innerText = GameBoard.countDiscSequences(0, 3);
  three_counts[1].innerText = GameBoard.countDiscSequences(1, 3);

  let winners = [false, false];

  // check entire board for wins due to flip
  for (let i = 0; i < GameBoard.numrows; i++) {
    for (let j = 0; j < GameBoard.numcols; j++) {
      // skip empty cells
      if (GameBoard.grid[i][j] == undefined) continue;
      // check for win in populated cells
      if (GameBoard.checkWin(i, j)) {
        winners[GameBoard.grid[i][j]] = true;
      }
    }
  }

  // if neither player wins then terminate early
  if (!(winners[0] || winners[1])) return;

  // check for draw then winner
  if (winners[0] && winners[1]) {
    alerthtml.innerText = "Draw!";
    result = -1;
  } else if (winners[0]) {
    alerthtml.innerText = GameBoard.colors[0] + " wins!";
    result = 0;
  } else {
    alerthtml.innerText = GameBoard.colors[1] + " wins!";
    result = 1;
  }
  gameOver = true;
  handleGameOver();
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

  targethtml.replaceChildren(moveindicator);
}

function hidePlacement(elemId) { 
  let col = elemId.split('-')[1];
  let row = GameBoard.findMoveRow(parseInt(col));

  // remove move indicator
  const targethtml = document.getElementById(row + "-" + col)
  if (targethtml == null) return;
  
  targethtml.innerHTML = "";
}

async function updateDBStats() {

  // check if user is logged in
  let isLoggedIn = await fetch('../php/loggedin.php', {
    method: 'GET'
  }).then((response => {
    if (!response.ok) {
      throw response;
    }
    return response.json();
  }));

  // don't update stats if user is not logged in
  if (isLoggedIn == 0) return;

  // calculate how many seconds elasped during the game
  let time_elapsed = timecount.innerText.split(':');
  let seconds = parseInt(time_elapsed[0]) * 60 + parseInt(time_elapsed[1]);
  // add seconds to user's time played

  // update stats in db
  let url = '../php/updatestats.php?result=' + result + '&time=' + seconds;

  let request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
}

var pageloadtime = new Date();
let gametime = setInterval(function() {
  let now = new Date();
  let secs = (now.getTime() - pageloadtime.getTime()) / 1000;
  let strMins = String(Math.floor(secs / 60)).padStart(2, '0');
  let strSecs = String(Math.floor(secs % 60)).padStart(2, '0');
  timecount.innerText = strMins + ":" + strSecs;
}, 1000);