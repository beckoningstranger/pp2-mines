form = document.getElementById('set-difficulty');
form.addEventListener('submit', startGame);

/**
 * Reads how big the playing field is supposed to be and how many mines should be placed from the DOM.
 * When user clicks 'Start Playing!' it hides the menu where the user could set game parameters and calls functions to build the playing field.
 */
 function startGame(event) {
    event.preventDefault();
    const WIDTH = document.getElementById('width').value;
    const HEIGHT = document.getElementById('height').value;
    const MINES = document.getElementById('mines').value;
    console.log(`User wants a playing field that's ${WIDTH} x ${HEIGHT} with ${MINES} mines.`);

    // Hide the settings menu:
    const difficultySettings = document.getElementById('difficulty-settings');
    difficultySettings.style.display = 'none';

    // Create event listeners for the restart and quit button
    let restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', function restartGame() {

        // Delete current playing field and create space for a new one
        let playingField = document.getElementById('actual-playing-field');
        playingField.remove();
        let whereToInsert = document.querySelector('#playing-field-area');
        let whatToInsert = '<div id="actual-playing-field"></div>'
        whereToInsert.insertAdjacentHTML("beforeend", whatToInsert);

        // Data for game is re-created. Constructs the playing field in an array
        playingFieldInformation = buildPlayingField(WIDTH, HEIGHT, MINES);
        
        // Uses the array to now create a visible playing field in HTML
        buildVisiblePlayingField(playingFieldInformation, HEIGHT);

        // Amount of squares user has to click to win without clicking a mine
        squaresToWin = WIDTH * HEIGHT - MINES;

        // Add event listeners to each created button
        makePlayingFieldInteractive();

        // Restart Timer
        startTimer();
    })


    // Show playing field:
    const playingField = document.getElementById('playing-field-area');
    playingField.style.display = 'flex';

    // Data for game is created. Constructs the playing field in an array
    playingFieldInformation = buildPlayingField(WIDTH, HEIGHT, MINES);
    
    // Uses the array to now create a visible playing field in HTML
    buildVisiblePlayingField(playingFieldInformation, HEIGHT);

    // Amount of squares user has to click to win without clicking a mine
    squaresToWin = WIDTH * HEIGHT - MINES;

    // Add event listeners to each created button
    makePlayingFieldInteractive();

    // Start Timer
    startTimer();
}

/**
* Generates an array of objects called "squares". Each object is a square on the playing field and contains the
* following information: 
* 1. Its name, 
* 2. Whether it has a mine, (this will be populated later)
* 3. How many mines there are in adjacent squares (this will be populated later)
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
    let squares = [];
    for (let a = 0; a < rows.length; a++) {
        for (let b = 1; b < columns.length + 1; b++) {
                let square = {
                    name: rows[a] + b,
                    hasMine: 0,
                    minesNextDoor: 0,
            }
        squares.push(square);
        }
    }
    playingFieldWithMines = layMines(mines, squares);
    playingFieldWithMinesAndInfoOnNeighboringSquares = findSurroundingSquares(playingFieldWithMines, rows, columns);
    playingFieldWithNumberOfMinesInAdjacentSquares = findMinesInSurroundingSquares(playingFieldWithMinesAndInfoOnNeighboringSquares);
    return playingFieldWithNumberOfMinesInAdjacentSquares;
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
        
        // If this square is on the left border, i.e a1, b1, etc., make a note of that (this will cause the next if statement to return 'false')
        // and set numberAfter accordingly
        if (numberOfThisSquare === 1) {
            numberAfter = 2;
            borderSquareVertically = 1;
        }
        
        // If this square is on the right border, set numberBefore accordingly
        // If it's not on either border, set numberBefore and numberAfter
        if ((numberOfThisSquare === columns.length) && (borderSquareVertically === 0)) {
            numberBefore = columns.length - 1;
        } else {
            numberBefore = numberOfThisSquare - 1;
            if (columns.includes(numberOfThisSquare + 1)) {
                numberAfter =  numberOfThisSquare + 1;
            }
        }

        // This if statement makes sure corner squares don't have a0 etc. as neighboring squares.
	    if (numberBefore === 0) {
            numberBefore = '';
	    }

        // Now it puts the letters and numbers together to form square names like d3, e5 or a2. Where there are values missing, 
        // it will produce broken square names like "a" or "3". These would be squares that we won't want anyway, so it's a good thing.
        let adjacentSquares = [letterOfThisSquare + numberAfter, letterOfThisSquare + numberBefore, letterBefore + numberOfThisSquare, 
            letterBefore + numberBefore, letterBefore + numberAfter, letterAfter + numberOfThisSquare, letterAfter + numberBefore, letterAfter + numberAfter];

	    // Clean up broken square names generated above by iterating in reverse order through the array and splicing all from the array 
        // that are either undefined, NaN or just a letter or a number, not a combination of both.
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
 * Iterates through all squares of the playing field and counts the mines in all adjacent squares.
 * It then adds this information for each square.
 */
function findMinesInSurroundingSquares(squares) {
    for (let i = 0; i < squares.length; i++) {
        let squaresToCheck = squares[i].neighboringSquares;
        let countedMines = 0;
        for (let square of squaresToCheck) {
            thatSquaresIndexNumber = ''
            // Get the index number of the square we want to check
            for (let j = 0; j < squares.length; j++) {
                if (squares[j].name === square) {
                    // With the index number, check of the square has a mine
                    if (squares[j].hasMine === 1) {
                        countedMines++;
                    }
                }	
            }
        }
        // Set minesNextDoor for the square that we checked to the number we counted to
        squares[i].minesNextDoor = countedMines;
    }
    return squares;
}

/**
 * Generates HTML to append to the DOM. It creates buttons that contain all necessary information to play the game as classes
 * @param {*} playingFieldInformation 
 * @param {*} rows 
 */
function buildVisiblePlayingField(playingFieldInformation, rows) {
	// First, slice the big playing field array into smaller arrays so that we get one array per row
	let sizeOfSmallerArrays = Number(rows); 
    let arrayOfArrays = [];
    for (let i=0; i < playingFieldInformation.length; i += sizeOfSmallerArrays) {
	     arrayOfArrays.push(playingFieldInformation.slice(i, i + sizeOfSmallerArrays));
	}
	
    // Now, generate the HTML
	let playingFieldHTML = '';
	let playingFieldHTMLRow = '';
	for (row of arrayOfArrays) {
		playingFieldHTMLRow += '<div class="row-of-mines">';
		for (item of row) {
			playingFieldHTMLRow += `<button class="square unrevealed`
			if (item.hasMine === 1) {
				playingFieldHTMLRow += ` has-mine`;
			}
			playingFieldHTMLRow += `
            " id="${item.name}">${item.minesNextDoor}</button>
            `
		}
		playingFieldHTMLRow += '</div>';
		playingFieldHTML += playingFieldHTMLRow;
		playingFieldHTMLRow = '';
	}
	let whereToInsert = document.querySelector('#actual-playing-field');
	whereToInsert.insertAdjacentHTML("beforeend", playingFieldHTML);
}

function makePlayingFieldInteractive() {
    let squares = document.getElementsByClassName('square');

    // Left-Click Event:
    for (square of squares) {
        square.addEventListener("click", function() {
            let squaresToWin = document.getElementsByClassName('square').length - document.getElementsByClassName('has-mine').length;
            let clickedSquares = document.getElementsByClassName('square').length - document.getElementsByClassName('unrevealed').length;
            let number = Number(this.innerText);
            if (this.classList.contains('has-mine')) {
                console.log('GAME OVER');
            } else {
                if (this.classList.contains('unrevealed')) {
                    clickedSquares++;
                    console.log(`${clickedSquares}/${squaresToWin}`);
                    this.classList.remove('unrevealed');
                }
                if (clickedSquares === squaresToWin) {
                    console.log('YOU WIN!')
                }
                switch (number) {
                    case 0:
                        this.style.color = "forestgreen";
                        break;
                    case 1:
                        this.style.color = "black";
                        break;
                    case 2:
                        this.style.color = "darkorange";
                        break;
                    case 3:
                        this.style.color = "red";
                        break;
                    case 4:
                        this.style.color = "blue";
                        break;
                    case 5:
                        this.style.color = "hotpink";
                        break;
                    case 6:
                        this.style.color = "maroon";
                        break;
                    case 7:
                        this.style.color = "navy";
                        break;
                    case 8:
                        this.style.color = "fuchsia";
                        break;
                }
            }
        });
    }

    // Right-Click Event:
    for (square of squares) {
        square.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            switch (this.style.backgroundColor) {
                case "":
                    this.style.backgroundColor = "black";
                    this.classList.add('marked-as-mine');
                    console.log(`Looks like you found ${document.getElementsByClassName('marked-as-mine').length}/${document.getElementsByClassName('has-mine').length} mines.`)
                    break;
                case "black":
                    this.style.backgroundColor = "";
                    this.classList.remove('marked-as-mine');
                    console.log(`Looks like you found ${document.getElementsByClassName('marked-as-mine').length}/${document.getElementsByClassName('has-mine').length} mines.`)
                    break;
            }
            // this.innerText = `<i class='fa-solid fa-land-mine-on'></i>`;
            // this.style.color = "black";
        })
    }
}

function startTimer() {
    // 1. reset timer first;
}

function restartGame(WIDTH, HEIGHT, MINES) {

}