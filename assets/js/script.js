let height = document.getElementById('height').value;
let width = document.getElementById('width').value;
let mines = document.getElementById('mines').value;
var desktopMode = 0;
// This timer is started when users start to play and stops either when they win or lose
var myTimer;
// The purpose of this is to have an abort signal for an event trigger so users can't play on after winning or losing
var controller;
// Check for a cookie and apply settings accordingly
checkCookie();
initializeMenu();

/**
 * This function sets the event listeners for the menus
 */
function initializeMenu() {
    let startMenu = document.getElementById('start-menu');
    let difficultySettingsMenu = document.getElementById('difficulty-settings');
    let startButton = document.getElementById('start-game-button');
    startButton.addEventListener('click', function() {
        difficultySettingsMenu.style.display = 'flex';
        startMenu.style.display = 'none';
    });

    let easySetting = document.getElementById('easy-setting');
        easySetting.addEventListener('click', function() {
            difficultySettingsMenu.style.display = 'none';
            width = 8;
            height = 8;
            mines = 10;
            startGame();    
        });
        
    let mediumSetting = document.getElementById('medium-setting');
    mediumSetting.addEventListener('click', function() {
        difficultySettingsMenu.style.display = 'none';
        width = 16;
        height = 8;
        mines = 25;
        startGame();   
    });

    let hardSetting = document.getElementById('hard-setting');
    hardSetting.addEventListener('click', function() {
        // If viewport width is too small for the big playing field of a hard game, tell user about it:
        let viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        if ( viewportWidth < 1024) {
            alert("Unfortunately your viewport is too small. If you're in portrait mode, try using your device in landscape mode or switch to a larger device.");
        } else {
            difficultySettingsMenu.style.display = 'none';
            width = 19;
            height = 26;
            mines = 99;
            startGame();   
        }
    });

    let difficultySettingsMenuBackButton = document.getElementById('difficulty-settings-back-button');
    difficultySettingsMenuBackButton.addEventListener('click', function() {
        difficultySettingsMenu.style.display = 'none';        
        startMenu.style.display = 'inline-grid';
    });

    let customDifficultySettingMenu = document.getElementById('custom-difficulty-settings');
    let customSetting = document.getElementById('custom-setting');    
    customSetting.addEventListener('click', function() {
        difficultySettingsMenu.style.display = 'none';        
        customDifficultySettingMenu.style.display = 'inline-grid';
    });

    let customSettingStartButton = document.getElementById('custom-difficulty-start-button');
    customSettingStartButton.addEventListener('click', function() {
        width = document.getElementById('height').value;
        height = document.getElementById('width').value;
        mines = document.getElementById('mines').value;
        startGame();
    });

    let customSettingBackButton = document.getElementById('custom-difficulty-settings-back-button');
    customSettingBackButton.addEventListener('click', function() {
        customDifficultySettingMenu.style.display = 'none';
        startMenu.style.display = 'inline-grid';
    });

    let howToPlayButton = document.getElementById('how-to-play-button');
    howToPlayButton.addEventListener('click', function() {
        startMenu.style.display = 'none';
        let howToPlayPage = document.getElementById('how-to-play');
        howToPlayPage.style.display = 'flex';
        document.getElementById('game-area').style.height = "auto";

    let htpBackButton = document.getElementById('how-to-play-back-button');
    htpBackButton.addEventListener('click', function() {
        startMenu.style.display = 'inline-grid';
        howToPlayPage.style.display = 'none';
        document.getElementById('game-area').style.height = "100vh";
    });
    });

    let settingsButton = document.getElementById('settings-button');
    settingsButton.addEventListener('click', function() {
        let desktopModeButton = document.getElementById('desktop-mode-button');
        if (desktopMode === 1) {
            desktopModeButton.style.backgroundColor = 'LawnGreen';  
            desktopModeButton.innerText = 'Activated';
        }
        startMenu.style.display = 'none';
        let settingsMenu = document.getElementById('settings');
        settingsMenu.style.display = 'flex';
        let setBackButton = document.getElementById('settings-back-button');
        setBackButton.addEventListener('click', function() {
            startMenu.style.display = 'inline-grid';
            settingsMenu.style.display = 'none';
            setCookie("prefcolor", document.getElementById('game-area').style.backgroundColor);
            setCookie("desktopModeCookie", document.getElementById('desktop-mode-button').innerText);
        });
        desktopModeButton.addEventListener('click', function() {
            if (this.innerText === 'Activated') {
                this.style.backgroundColor = 'red';
                this.innerText = 'Deactivated';
                desktopMode = 0;
            } else if (this.innerText === 'Deactivated') {
                this.style.backgroundColor = 'LawnGreen';
                this.innerText = 'Activated';
                desktopMode = 1;
            }
        });
        let colorOptions = document.getElementsByClassName('color-picker-box');
        for (let option of colorOptions) {
            let wantedColor = '#' + option.id.slice(-6);
            option.style.backgroundColor = wantedColor;
            option.addEventListener('click', function() {
                document.getElementById('game-area').style.backgroundColor = wantedColor;
            });
        }
    });
}


/**
 * Reads how big the playing field is supposed to be and how many mines should be placed from the DOM.
 * When user clicks 'Start Playing!' it hides the menu where the user could set game parameters and calls functions to build the playing field.
 * Also contains event listeners for the restart and quit button
 */
 function startGame() {

    // Make sure the custom difficulty settings menu is hidden:
    const customDifficultySettings = document.getElementById('custom-difficulty-settings');
    customDifficultySettings.style.display = 'none';

    // Create event listener for the restart button
    let restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', function() {
        // Reset timer
        clearInterval(myTimer);

        // Reset smileyface
        document.getElementById('smileyface').innerText = "^_^";

        // Delete current playing field and create space for a new one
        let playingField = document.getElementById('actual-playing-field');
        playingField.remove();
        let whereToInsert = document.querySelector('#playing-field-area');
        let whatToInsert = '<div id="actual-playing-field"></div>';
        whereToInsert.insertAdjacentHTML("beforeend", whatToInsert);

        // Data for game is re-created. Constructs the playing field in an array
        let playingFieldInformation = buildPlayingField(width, height, mines);
        
        // Uses the array to now create a visible playing field in HTML
        buildVisiblePlayingField(playingFieldInformation, height);

        // Add event listeners to each created square
        makePlayingFieldInteractive();

        // Restart Timer
        startTimer();

        // Adjust Playing Field depending on whether the user is in portrait or landscape mode unless Desktop Mode is activated
        if ((desktopMode === 0) && (landscapeOrPortraitMode() === "portrait")) {
            adjustPlayingFieldToViewportWidth();
        } else if ((desktopMode === 0) && (landscapeOrPortraitMode() === "landscape")) {
            adjustPlayingFieldToViewportHeight();
        }
    });

    // Create event listener for quit button
    let quitButton = document.getElementById('quit-button');
    quitButton.addEventListener('click', function() {
        location.reload();
    });

    // Check if there are too many mines on the playing field. If so, set a more reasonable amount and start the game
    let recommendedAmountOfMines = Math.floor(((height * width)/4));
    if (recommendedAmountOfMines < mines) {
        window.alert(`This is too many mines. Even for a very hard game, I recommend you play with at most ${recommendedAmountOfMines}. Will create a game with this parameter now.`);
        mines = recommendedAmountOfMines;
    }

    // Initialize Mine Countdown
    document.getElementById('mine-countdown').innerText = mines;

    // Show playing field:
    const playingField = document.getElementById('playing-field-area');
    playingField.style.display = 'flex';

    // Data for game is created. Constructs the playing field in an array
    let playingFieldInformation = buildPlayingField(width, height, mines);
    
    // Uses the array to now create a visible playing field in HTML
    buildVisiblePlayingField(playingFieldInformation, height);

    // Add event listeners to each created button
    makePlayingFieldInteractive();

    // Start Timer
    startTimer();

    // Adjust Playing Field depending on whether the user is in portrait or landscape mode unless Desktop Mode is activated
    if ((desktopMode === 0) && (landscapeOrPortraitMode() === "portrait")) {
        adjustPlayingFieldToViewportWidth();
    } else if ((desktopMode === 0) && (landscapeOrPortraitMode() === "landscape")) {
        adjustPlayingFieldToViewportHeight();
    }
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
    const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
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
            };
        squares.push(square);
        }
    }
    let playingFieldWithMines = layMines(mines, squares);
    let playingFieldWithMinesAndInfoOnNeighboringSquares = findSurroundingSquares(playingFieldWithMines, rows, columns);
    let playingFieldWithNumberOfMinesInAdjacentSquares = findMinesInSurroundingSquares(playingFieldWithMinesAndInfoOnNeighboringSquares);
    return playingFieldWithNumberOfMinesInAdjacentSquares;
}

/**
* Gets random squares from the playing field and assign mines to them.
* @param {*} squares 
* @returns 
*/
function layMines(minesToLay, playingField) {
	let assignedMines = 0;
	let randomlyPickedSquares = [];
	while (assignedMines < minesToLay) {
		let randomSquare = playingField[Math.floor(Math.random() * playingField.length)];
		if (! randomlyPickedSquares.includes(randomSquare.name)) {
		randomSquare.hasMine = 1;
		assignedMines++;
		randomlyPickedSquares.push(randomSquare.name);
		}
	}
    return playingField;
}

/**
 * Receives the playing field as an array of objects and adds for all square objects what squares are next to them.
 * This information is later used to calculate how many mines are next to each square.
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
        let numberOfThisSquare = findNumberOfThisSquare(squares, i);

        
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
                adjacentSquares.splice(indexOfThatSquare, 1);
            }
      }
        squares[i].neighboringSquares = adjacentSquares;
    }
    return squares;
}

/**
 * This function receives an array of objects that contains all squares, looks at the square names and finds the number in the square name. 
 * It then returns this number.
 * @param {*} squares = The array of objects with all the squares.
 * @param {*} i = The index number with the array of the specific square the function is supposed to look at.
 * @returns number of the square the function was supposed to examine.
 */
 function findNumberOfThisSquare(squares, i) {
    if (squares[i].name.length === 3) {
        let numberOfThisSquare = Number(squares[i].name[1] + squares[i].name[2]);
        return numberOfThisSquare;
    } else if (squares[i].name.length === 2) {
        let numberOfThisSquare = Number(squares[i].name[1]);
        return numberOfThisSquare;
    }
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
 * Generates HTML to append to the DOM. It creates buttons that contain all necessary information to play the game as classes.
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
	for (let row of arrayOfArrays) {
		playingFieldHTMLRow += '<div class="row-of-mines">';
		for (let item of row) {
			playingFieldHTMLRow += `<button class="square unrevealed`;
			if (item.hasMine === 1) {
				playingFieldHTMLRow += ` has-mine`;
			}
			playingFieldHTMLRow += `
            " id="${item.name}">${item.minesNextDoor}</button>
            `;
		}
		playingFieldHTMLRow += '</div>';
		playingFieldHTML += playingFieldHTMLRow;
		playingFieldHTMLRow = '';
	}
    // Insert the HTML
	let whereToInsert = document.querySelector('#actual-playing-field');
	whereToInsert.insertAdjacentHTML("beforeend", playingFieldHTML);
}

/**
 * This function contains the event listeners for the playing field as well as the triggers for winning or losing the game.
 * With left clicks, users reveal squares.
 * With right clicks, users can mark squares as mined. When they click such squares again, they unmark the squares again.
 * The functions actually doing this are just below this function.
 */
function makePlayingFieldInteractive() {
    let squares = document.getElementsByClassName('square');
    controller = new AbortController();

    // Left-Click Event:
    for (let square of squares) {
        square.addEventListener("click", leftClickOnSquare, { signal: controller.signal });
    }

    // Right-Click Event:
    for (let square of squares) {
        square.addEventListener('contextmenu', rightClickOnSquare, { signal: controller.signal });
    }

    // Long Press Event:
    for (let square of squares) {
        // This function was taken from https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone
        onLongPress(square, function(element) {
            longPressOnSquare(square);
        });
    }

    // Mousedown Event:
    for (let square of squares) {
        square.addEventListener('mousedown', function() {
            document.getElementById('smileyface').innerText = "O_O";
        }, { signal: controller.signal });
    }

    // Mouseup Event:
    for (let square of squares) {
        square.addEventListener('mouseup', function() {
            document.getElementById('smileyface').innerText = "^_^";
        }, { signal: controller.signal });
    }
}


/**
 * This whole function taken from https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone with minimal editing.
 * @param {} element 
 * @param {*} callback 
 */
function onLongPress(element, callback) {
    var timeoutId;

    element.addEventListener('touchstart', function(e) {
        timeoutId = setTimeout(function() {
            timeoutId = null;
            e.stopPropagation();
            callback(e.target);
        }, 2000);
    }, {passive: true});

    element.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    element.addEventListener('touchend', function () {
        if (timeoutId) clearTimeout(timeoutId);
    }, {passive: true});

    element.addEventListener('touchmove', function () {
        if (timeoutId) clearTimeout(timeoutId);
    }, {passive: true});
}

function leftClickOnSquare() {
    let squaresToWin = document.getElementsByClassName('square').length - document.getElementsByClassName('has-mine').length;
            let clickedSquares = document.getElementsByClassName('square').length - document.getElementsByClassName('unrevealed').length;
            let number = Number(this.innerText);
            if (this.classList.contains('has-mine')) {
                // Lose behavior
                clearInterval(myTimer);
                document.getElementById('actual-playing-field').style.backgroundColor = "red";
                let minedSquares = document.getElementsByClassName('has-mine');
                for (let square of minedSquares) {
                    square.style.backgroundColor = "black";
                }
                document.getElementById('smileyface').innerText = "X_X";
                // Send abort signal to event trigger so that the playing field is no longer clickable
                controller.abort();
            } else {
                if (this.classList.contains('unrevealed')) {
                    clickedSquares++;
                    this.classList.remove('unrevealed');
                }
                // Win behavior
                if (clickedSquares === squaresToWin) {
                    clearInterval(myTimer);
                    document.getElementById('actual-playing-field').style.backgroundColor = "green";
                    let minedSquares = document.getElementsByClassName('has-mine');
                    for (let square of minedSquares) {
                        square.style.backgroundColor = "black";
                    }
                    document.getElementById('mine-countdown').innerText = 0;
                    document.getElementById('smileyface').innerText = "d^_^b";
                    // Send abort signal to event trigger so that the playing field is no longer clickable
                    controller.abort();
                }

                // Set a different font color depending on how many mines there are in the surrounding squares
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
}

/**
 * This function determines the behavior when users right click a square. 
 * If a square was not marked as being marked, it marks it by giving it a black background color and decreases the mine counter.
 * If a square was already marked, it unmarks it by resetting the background color and increases the mine counter.
 * @param {*} event 
 */
function rightClickOnSquare(event) {
    event.preventDefault();
    switch (this.style.backgroundColor) {
        case "":
            this.style.backgroundColor = "black";
            this.classList.add('marked-as-mine');
            // Update mine counter
            document.getElementById('mine-countdown').innerText = document.getElementsByClassName('has-mine').length - document.getElementsByClassName('marked-as-mine').length;
            break;
        case "black":
            this.style.backgroundColor = "";
            this.classList.remove('marked-as-mine');
            // Update mine counter
            document.getElementById('mine-countdown').innerText = document.getElementsByClassName('has-mine').length - document.getElementsByClassName('marked-as-mine').length;
            break;
    }
}

function longPressOnSquare(square) {
    switch (square.style.backgroundColor) {
        case "":
            square.style.backgroundColor = "black";
            square.classList.add('marked-as-mine');
            // Update mine counter
            document.getElementById('mine-countdown').innerText = document.getElementsByClassName('has-mine').length - document.getElementsByClassName('marked-as-mine').length;
            break;
        case "black":
            square.style.backgroundColor = "";
            square.classList.remove('marked-as-mine');
            // Update mine counter
            document.getElementById('mine-countdown').innerText = document.getElementsByClassName('has-mine').length - document.getElementsByClassName('marked-as-mine').length;
            break;
    }
}

/**
 * This function simply starts the counter at the top of the playing field.
 * Here is where I learned how to do this: https://medium.com/geekculture/creating-counter-with-javascript-4b1c60892c45
 */
function startTimer() {
    let counter = 0;
    myTimer = setInterval(function () {
        counter ++;
        document.getElementById('timer').innerText = counter;
    }, 1000);
}

/**
 * This function finds the viewport height and width of the user's device. It then adjusts the square size
 * so that the screen real estate is used better. This results in bigger buttons and a better user experience.
 * Font size of everything that's visible while playing is also adjusted to 4vw.
 */
function adjustPlayingFieldToViewportWidth() {
    // The code for getting the viewport height and width was taken from https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const numberOfColumns = document.getElementsByClassName('row-of-mines')[0].childElementCount;
    const numberOfRows = document.getElementsByClassName('row-of-mines').length;
    
    // Calculate and set how big the square should be to fit and fill the screen horizontally
    let squareWidth = Math.floor(vw / numberOfColumns * 0.8);
    let squares = document.getElementsByClassName('square');
    for (let square of squares) {
        square.style.height = `${squareWidth}px`;
        square.style.width = `${squareWidth}px`;
    }

    // Calculate and set needed vertical space
    let neededVerticalSpace = (squareWidth * numberOfRows) + (squareWidth * 3);
    if (neededVerticalSpace > vh) {
        let verticalHeight = document.getElementById('game-area');
        verticalHeight.style.height = `${neededVerticalSpace}px`;
    }
}

function adjustPlayingFieldToViewportHeight() {
    // The code for getting the viewport height and width was taken from https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const numberOfRows = document.getElementsByClassName('row-of-mines').length;
    
    // Calculate and set how big the square should be to fit and fill the screen vertically
    let squareWidth = Math.floor(vh / numberOfRows * 0.8);
    let squares = document.getElementsByClassName('square');
    for (let square of squares) {
        square.style.height = `${squareWidth}px`;
        square.style.width = `${squareWidth}px`;
    }
}

/**
 * This function takes a name and value for a cookie and sets it.
 * This was adapted from https://www.w3schools.com/js/js_cookies.asp, I cut the part where it sets an expiry date for the cookie out.
 * @param {*} cname 
 * @param {*} cvalue 
 */
function setCookie(cname, cvalue) {
    document.cookie = `${cname}=${cvalue};`;
}

/**
 * This function takes the name of a cookie and returns its value.
 * This was taken from https://www.w3schools.com/js/js_cookies.asp
 * @param {*} cname is the cookie's name.
 * @returns the cookie's value.
 */
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

/**
 * This function looks for cookies for background color and desktop mode and sets these settings accordingly
 * This was adapted from https://www.w3schools.com/js/js_cookies.asp
 */ 
function checkCookie() {
    let prefcolor = getCookie("prefcolor");
    let desktopModeCookie = getCookie("desktopModeCookie");
    document.getElementById('game-area').style.backgroundColor = prefcolor;
    if (desktopModeCookie === "Activated") {
        desktopMode = 1;
    } else {
        desktopMode = 0;
    }
  }

/**
 * This function looks at viewport width and height to determine what mode the user is in.
 * @returns "landscape" or "portrait" depending on what mode the user is in
 */
  function landscapeOrPortraitMode() {
    // The code for getting the viewport height and width was taken from https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    if (vw > vh) {
        return "landscape";
    } else {
        return "portrait";
    }
  }