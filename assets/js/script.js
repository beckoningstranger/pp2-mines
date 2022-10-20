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
    console.log(playingFieldWithMines);
}

form = document.getElementById('set-difficulty');
form.addEventListener('submit', startGame);