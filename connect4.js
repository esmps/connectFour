/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

//create array to hold game information
function makeBoard() {
  for (j = 0; j < HEIGHT; j++){
    board.push(new Array(WIDTH).fill(null));
  }
  return board;
}

//make HTML table and row of column tops.
function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");
  //create top row for piece placement
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  //create headcells for piece placement
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);
  // create game grid divs
  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

//given column x, return top empty y (null if filled)
function findSpotForCol(x) {
  let y = HEIGHT - 1;
    while (board[y][x]){
      if (y === 0){
        return null;
      }
      y--;
    }
    return y;
}

//update DOM to place piece into HTML table of board 
function placeInTable(y, x) {
  const placePiece = document.getElementById(`${y}-${x}`);
  placePiece.append(createNewPiece());
  updateCurrPlayer();
}

function createNewPiece(){
  const newPiece = document.createElement("div");
  newPiece.classList.add("piece");
  if (currPlayer === 1){
    newPiece.classList.add("p1");
  }
  else {
    newPiece.classList.add("p2");
  }
  return newPiece;
}

function updateCurrPlayer(){
  const player = document.getElementById("curr-player");
  if (currPlayer === 1){
    player.classList.remove("p1");
    player.classList.add("p2");
  }
  else{
    player.classList.remove("p2");
    player.classList.add("p1");
  }
}

//end game if a player won or there is a tie
function endGame() {
  const endGame = document.getElementById("game-over");

  announceWinner();  //show game over display
  setTimeout(() => {
    endGame.style.display = "block";
  }, 350);
  playAgain();
}

function playAgain(){
  const playAgain = document.getElementById("play-again");
  playAgain.addEventListener("click", (evt) => {
    window.location.reload();
  })
}

function announceWinner(){
  const winner = document.getElementById("winner");
  if (checkForTie()){
    winner.innerText = "1 & 2";
  }
  else{
    currPlayer === 1 ? winner.innerText = 1 : winner.innerText = 2;
  }
}

function disableClicks(){
  const columnTop = document.getElementById("column-top");
   columnTop.style.pointerEvents = 'none';
}

//handle click of column top to play piece 
function handleClick(evt) {
  let x = +evt.target.id;
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  board[y][x] = currPlayer;
  placeInTable(y, x);
  if (checkForWin() || checkForTie()) {
    return endGame();
  }
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

function checkForTie(){
  return board.every(value => value.every(piece => (piece === 1 || piece === 2)));
}

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //checking each horiz/vert/diag positioning for each [y][x] array element
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      //checking if one of them is a winner
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();