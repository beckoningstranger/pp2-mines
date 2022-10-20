/**
 * Reads how big the playing field is supposed to be and how many mines should be placed from the DOM.
 * When user clicks 'Start Playing!' it hides the menu where the user could set game parameters and calls functions to build the playing field.
 */
function startGame(event) {
    event.preventDefault();
    let width = document.getElementById('width').value;
    let height = document.getElementById('height').value;
    let mines = document.getElementById('mines').value;
    console.log(`User wants a playing field that's ${width} x ${height} with ${mines} mines.`);
    // Hide the settings menu:
    const difficultySettings = document.getElementById('difficulty-settings');
    difficultySettings.style.display = 'none';
    // Show and style playing field:
    const playingField = document.getElementById('playing-field');
    playingField.style.display = 'grid';
    playingField.style.alignContent = 'center';
    buildPlayingField(width, height, mines)
}

/**
* Gets random squares from the playing field and assign mines to them.
* @param {*} squares 
* @returns 
*/
function layMines(minesToLay, playingField) {
	let assignedMines = 0;
	let randomlyPickedSquares = []
	while (assignedMines < minesToLay) {
		let randomSquare = playingField[Math.floor(Math.random() * playingField.length)];
		if (! randomlyPickedSquares.includes(randomSquare.name)) {
		randomSquare.hasMine = 1;
		assignedMines++;
		randomlyPickedSquares.push(randomSquare.name)
		}
	}
    return playingField;
}

/**
 * Receives the playing field as an array of objects and adds for all square objects what squares are next to them.
 * This information is later used to calculate how many mines are next to each squares.
 * @param {*} squares 
 * @returns 
 */
function findSurroundingSquares(squares, rows, columns) {
    for (let i = 0; i < squares.length; i++) {
    
        let borderSquareHorizontally = 0;
  	    let borderSquareVertically = 0;
	    let letterBefore = '';
        let letterAfter = '';
        let numberBefore = '';
        let numberAfter = '';
        
        // Seperate the square's name into letter and number:
        let letterOfThisSquare = squares[i].name[0];
        let numberOfThisSquare = Number(squares[i].name[1]);
        
        // Find out if the square is a border square on the playing field
        // by looking at its index number in the array containing all letters/rows.
        let lettersIndexNumber = rows.indexOf(letterOfThisSquare);
        if (lettersIndexNumber === rows.length) {
            letterBefore = rows[lettersIndexNumber - 1];
            borderSquareHorizontally = 1;
            }
	
	    // If it's not a horizontal border square, let check if it is a vertical border square.
        if ((lettersIndexNumber === 0) && (borderSquareHorizontally === 0)) {
            letterAfter = rows[lettersIndexNumber + 1];
            } else {
                letterBefore = rows[lettersIndexNumber - 1];
                letterAfter = rows[lettersIndexNumber + 1];
            }
            
        if (numberOfThisSquare === 1) {
            numberAfter = 2;
            borderSquareVertically = 1;
        }
        
        if ((numberOfThisSquare === columns.length) && (borderSquareVertically === 0)) {
            numberBefore = columns.length - 1;
        } else {
            numberBefore = numberOfThisSquare - 1;
            if (columns.includes(numberOfThisSquare + 1)) {
                numberAfter =  numberOfThisSquare + 1;
            }
        }
	    if (numberBefore === 0 ) {
            numberBefore = '';
	    }
        let adjacentSquares = [letterOfThisSquare + numberAfter, letterOfThisSquare + numberBefore, letterBefore + numberOfThisSquare, letterBefore + numberBefore, letterBefore + numberAfter, letterAfter + numberOfThisSquare, letterAfter + numberBefore, letterAfter + numberAfter];
	    // Clean up the generated squares above by iterating in reverse order through the array and splicing all from the array that are either undefined, NaN or just a letter or a number, not a combination of both.
	    for (let i = adjacentSquares.length - 1; i >= 0; i--) {
            if ((adjacentSquares[i].length < 2) || (adjacentSquares[i] === "undefined") || (Number.isNaN(adjacentSquares[i]))) {
                let indexOfThatSquare = adjacentSquares.indexOf(adjacentSquares[i]);
                adjacentSquares.splice(indexOfThatSquare, 1)
            }
      }
        squares[i].neighboringSquares = adjacentSquares;
    }
    return squares;
}

/**
* Generates an array of objects called "squares". Each object is a square on the playing field and contains the
* following information: 
* 1. Its name, 
* 2. Whether it has a mine, 
* 3. Whether the player has already clicked it
* 4. How many mines there are in adjacent squares
*/
function buildPlayingField(width, height, mines) {
    const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    let rows = [];
    let columns = [];

    // Create an array of letters for rows based on how many the user chose
    for (let i = 0; i < width; i++) {
        rows.push(LETTERS[i]);
    }
    // Create an array of numbers for columns based on how many the user chose
    for (let i = 0; i < height; i++) {
        columns.push(NUMBERS[i]);
    }
    console.log(rows, columns, mines);
    let squares = [];
    for (let a = 0; a < rows.length; a++) {
        for (let b = 1; b < columns.length + 1; b++) {
                let square = {
                    name: rows[a] + b,
                    hasMine: 0,
                    uncovered: 0,
                    minesNextDoor: 0,
            }
        squares.push(square);
        }
    }
    playingFieldWithMines = layMines(mines, squares);
    playingFieldWithMinesAndInfoOnNeighboringSquares = findSurroundingSquares(playingFieldWithMines, rows, columns);
    console.log(playingFieldWithMinesAndInfoOnNeighboringSquares);
}

form = document.getElementById('set-difficulty');
form.addEventListener('submit', startGame);