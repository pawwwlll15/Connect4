/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


/* where the rules of the Game are created */
class Game{

  /* assigning this.variables to constructor parameters */
  constructor(p1,p2,height = 6, width = 7){
    /* setting array of players */
    this.players = [p1,p2];
    this.height = height;
    this.width = width;
    /* starting game with player 1 active */
    this.currPlayer = p1;
    /* calling makeBoard method */
    this.makeBoard();
    /* calling makeHtmlBoard method */
    this.makeHtmlBoard();
    /* starting game with gameOver value as false */
    this.gameOver = false;
  }

  /* creating the board with a column height of 'this.height' and a row length of 'this.width'*/
  makeBoard(){
    this.board = [];
    for(let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /* creating the html elements within the games board */
  makeHtmlBoard() {
    /* finding div with 'id' of 'board. Then making sure the innerHTML of that board is empty */
    const board = document.getElementById('board');
    board.innerHTML = '';
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    
    /* assigning(binding) handleClick function to gameClick local variable */
    this.gameClick = this.handleClick.bind(this);

    /* putting an event listener to each div in the top row of the board */
    top.addEventListener('click',this.gameClick);

    /* while x is less than width value, create a td and assign it to headCell,
    set 'id' to x value, append headcell to top variable declared above */
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    /* append top to board div */
    board.append(top);
  
    // make main part of board and create a column of rows the same height as this.height. Each row will be the length of this.width
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      
      /*  */
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      
      /* append created row to board */
      board.append(row);
    }
  }

  /* This will place the players' into the correct location on the board */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /* creating a piece for new spot drop. Assiging both class 'piece' and currentPlayers color to new piece and then place it in 'spot' */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    /* assigning player color to players inputed color choice */
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /* Displays message at end of game */
  endGame(msg) {
    /* built in alert message to display endGame Message */
    alert(msg);
    const top = document.querySelector('#column-top');
    /* once game is over, remove the event listener on the top row */
    top.removeEventListener('click',this.gameClick);
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    /* this + symbol converts the value to a numeric type (if possible) */
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`${this.currPlayer.color.toUpperCase()} player wins!`);
    }
      
    // switch players
    /* if currPlayer is equal to players[0], change to players[1], else currPlayer = players[0] */
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  // Check four cells to see if they're all color of current player
  //  - cells: list of four (y, x) cells
  //  - returns true if all are legal coordinates & all match currPlayer
  checkForWin() {
    const _win = cells => cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

/* player class created to allow for customizability of player color */
class Player{
  constructor(color){
    this.color = color;
  }
}

/* Once the start game button is clicked, assign the values of the input fields to
associated players! */
document.getElementById('start-game').addEventListener('click', () => {
  /* assigning color values in each input field to designated players using the Player class. */
  let p1 = new Player(document.getElementById('p1-color').value);
  let p2 = new Player(document.getElementById('p2-color').value);
  new Game(p1, p2);
});





