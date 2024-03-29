// These three variables control the height, width and number of mines of the playing field
var height;
var width;
var mines;

var playingFieldInformation = buildPlayingField(width, height, mines);

var squaresToCheck = [];
var alreadyChecked = [];
var revealToWin = null;

// This enables users to prevent the playing field from being resized according to their viewport
var desktopMode;
// This timer is started when users start to play and stops either when they win or lose
var myTimer;
// Check for a cookie and apply settings accordingly
checkCookie();
// Set event listeners for the menus
initializeMenu();
// Hide hard and custom difficulty modes on viewports that have less than 1024px width as large playing fields would break the layout:
if (
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) <
  1024
) {
  document.getElementById("hard-setting").style.display = "none";
  document.getElementById("custom-setting").style.display = "none";
}

/**
 * This function sets the event listeners for the menus and also sets parameters for the three set difficulty levels
 */
function initializeMenu() {
  let startMenu = document.getElementById("start-menu");
  let difficultySettingsMenu = document.getElementById("difficulty-settings");
  let startButton = document.getElementById("start-game-button");
  startButton.addEventListener("click", function () {
    difficultySettingsMenu.style.display = "flex";
    startMenu.style.display = "none";
  });

  let easySetting = document.getElementById("easy-setting");
  easySetting.addEventListener("click", function () {
    difficultySettingsMenu.style.display = "none";
    width = 8;
    height = 8;
    mines = 10;
    startGame();
  });

  let mediumSetting = document.getElementById("medium-setting");
  mediumSetting.addEventListener("click", function () {
    difficultySettingsMenu.style.display = "none";
    width = 8;
    height = 16;
    mines = 25;
    startGame();
  });

  let hardSetting = document.getElementById("hard-setting");
  hardSetting.addEventListener("click", function () {
    // If viewport width is too small for the big playing field of a hard game, tell user about it
    // The code for getting the viewport height and width was taken from https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
    let viewportWidth = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    if (viewportWidth < 1024) {
      alert(
        "Unfortunately your viewport is too small. If you're in portrait mode, try using your device in landscape mode or switch to a larger device."
      );
    } else {
      difficultySettingsMenu.style.display = "none";
      width = 26;
      height = 19;
      mines = 99;
      startGame();
    }
  });

  let difficultySettingsMenuBackButton = document.getElementById(
    "difficulty-settings-back-button"
  );
  difficultySettingsMenuBackButton.addEventListener("click", function () {
    difficultySettingsMenu.style.display = "none";
    startMenu.style.display = "inline-grid";
  });

  let customDifficultySettingMenu = document.getElementById(
    "custom-difficulty-settings"
  );
  let customSetting = document.getElementById("custom-setting");
  customSetting.addEventListener("click", function () {
    difficultySettingsMenu.style.display = "none";
    customDifficultySettingMenu.style.display = "inline-grid";
  });

  let customSettingStartButton = document.getElementById(
    "custom-difficulty-start-button"
  );
  customSettingStartButton.addEventListener("click", function () {
    width = Math.floor(document.getElementById("width").value);
    height = Math.floor(document.getElementById("height").value);
    mines = Math.floor(document.getElementById("mines").value);
    // Check whether user input conforms to supported parameters
    if (width < 5) {
      alert(
        "The minimum supported width is 8. Will use this value to create the playing field."
      );
      width = 5;
    }
    if (width > 26) {
      alert(
        "The maximum supported width is 26. Will use this value to create the playing field."
      );
      width = 26;
    }
    if (height < 4) {
      alert(
        "The minimum supported height is 4. Will use this value to create the playing field."
      );
      height = 4;
    }
    if (height > 19) {
      alert(
        "The maximum supported height is 19. Will use this value to create the playing field."
      );
      height = 19;
    }
    if (mines < 5) {
      alert(
        "The minimum supported number of mines is 4. Will use this value to create the playing field."
      );
      mines = 4;
    }
    if (mines > 99) {
      alert(
        "The maximum supported number of mines is 19. Will use this value to create the playing field."
      );
      mines = 19;
    }
    startGame();
  });

  let customSettingBackButton = document.getElementById(
    "custom-difficulty-settings-back-button"
  );
  customSettingBackButton.addEventListener("click", function () {
    customDifficultySettingMenu.style.display = "none";
    startMenu.style.display = "inline-grid";
  });

  let howToPlayButton = document.getElementById("how-to-play-button");
  howToPlayButton.addEventListener("click", function () {
    startMenu.style.display = "none";
    let howToPlayPage = document.getElementById("how-to-play");
    howToPlayPage.style.display = "flex";
    document.getElementById("game-area").style.height = "auto";

    let htpBackButton = document.getElementById("how-to-play-back-button");
    htpBackButton.addEventListener("click", function () {
      startMenu.style.display = "inline-grid";
      howToPlayPage.style.display = "none";
      document.getElementById("game-area").style.height = "100vh";
    });
  });

  let settingsButton = document.getElementById("settings-button");
  settingsButton.addEventListener("click", function () {
    let desktopModeButton = document.getElementById("desktop-mode-button");
    if (desktopMode === 1) {
      desktopModeButton.style.backgroundColor = "LawnGreen";
      desktopModeButton.innerText = "Activated";
    }
    startMenu.style.display = "none";
    let settingsMenu = document.getElementById("settings");
    settingsMenu.style.display = "flex";
    let setBackButton = document.getElementById("settings-back-button");
    setBackButton.addEventListener("click", function () {
      startMenu.style.display = "inline-grid";
      settingsMenu.style.display = "none";
      setCookie(
        "prefcolor",
        document.getElementById("game-area").style.backgroundColor
      );
      setCookie(
        "desktopModeCookie",
        document.getElementById("desktop-mode-button").innerText
      );
    });
    desktopModeButton.addEventListener("click", function () {
      if (this.innerText === "Activated") {
        this.style.backgroundColor = "red";
        this.innerText = "Deactivated";
        desktopMode = 0;
      } else if (this.innerText === "Deactivated") {
        this.style.backgroundColor = "LawnGreen";
        this.innerText = "Activated";
        desktopMode = 1;
      }
    });
    let colorOptions = document.getElementsByClassName("color-picker-box");
    for (let option of colorOptions) {
      let wantedColor = "#" + option.id.slice(-6);
      option.style.backgroundColor = wantedColor;
      option.addEventListener("click", function () {
        document.getElementById("game-area").style.backgroundColor =
          wantedColor;
      });
    }
  });
}

/**
 * Reads how big the playing field is supposed to be and how many mines should be placed from the DOM.
 * When user clicks 'Start Playing!', it hides the menu where the user could set game parameters and calls functions to build the playing field.
 * Also contains event listeners for the restart and quit buttons
 */
function startGame() {
  // Make sure the custom difficulty settings menu is hidden:
  const customDifficultySettings = document.getElementById(
    "custom-difficulty-settings"
  );
  customDifficultySettings.style.display = "none";

  // Create event listener for the restart button
  let restartButton = document.getElementById("restart-button");
  restartButton.addEventListener("click", function () {
    // Reset Mine Counter
    document.getElementById("mine-countdown").innerText =
      document.getElementsByClassName("has-mine").length;

    // Reset timer
    clearInterval(myTimer);

    // Delete current playing field and create space for a new one
    let playingField = document.getElementById("actual-playing-field");
    playingField.remove();
    let whereToInsert = document.querySelector("#playing-field-area");
    let whatToInsert = '<div id="actual-playing-field"></div>';
    whereToInsert.insertAdjacentHTML("beforeend", whatToInsert);

    // Data for game is re-created. Constructs the playing field in an array
    playingFieldInformation = buildPlayingField(width, height, mines);
    revealToWin = playingFieldInformation.reduce((a, curr) => {
      if (curr.hasMine !== 1) {
        a.push(curr.name);
      }
      return a;
    }, []);
    squaresToCheck = [];
    alreadyChecked = [];
    document
      .getElementById("actual-playing-field")
      .addEventListener("contextmenu", (e) => e.preventDefault());

    // Uses the array to now create a visible playing field in HTML
    buildVisiblePlayingField(playingFieldInformation, width);

    // Add event listeners to each created square
    makePlayingFieldInteractive();

    // Restart Timer
    startTimer();

    // Adjust playing field
    adjustPlayingField();
  });

  // Create event listener for quit button
  let quitButton = document.getElementById("quit-button");
  quitButton.addEventListener("click", function () {
    location.reload();
  });

  // Check if there are too many mines on the playing field. If so, set a more reasonable amount and start the game
  let recommendedAmountOfMines = Math.floor((height * width) / 4);
  if (recommendedAmountOfMines < mines) {
    window.alert(`This is too many mines. Even for a very hard game, I recommend you play with at most ${recommendedAmountOfMines} given the dimensions you chose.
        \nWill create a game with this parameter now.`);
    mines = recommendedAmountOfMines;
  }

  // Initialize Mine Countdown
  document.getElementById("mine-countdown").innerText = mines;

  // Show playing field:
  const playingField = document.getElementById("playing-field-area");
  playingField.style.display = "flex";

  // Data for game is created. Constructs the playing field in an array
  playingFieldInformation = buildPlayingField(width, height, mines);
  revealToWin = playingFieldInformation.reduce((a, curr) => {
    if (curr.hasMine !== 1) {
      a.push(curr.name);
    }
    return a;
  }, []);
  document
    .getElementById("actual-playing-field")
    .addEventListener("contextmenu", (e) => e.preventDefault());

  // Uses the array to now create a visible playing field in HTML
  buildVisiblePlayingField(playingFieldInformation, width);

  // Add event listeners to each created button
  makePlayingFieldInteractive();

  // Start timer
  startTimer();

  // Adjust playing field
  adjustPlayingField();
}

/**
 * Adjust Playing Field depending on whether the user is in portrait or landscape mode unless Desktop Mode is activated
 */
function adjustPlayingField() {
  if (desktopMode === 0 && landscapeOrPortraitMode() === "portrait") {
    adjustPlayingFieldToViewportWidth();
  } else if (desktopMode === 0 && landscapeOrPortraitMode() === "landscape") {
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
  const LETTERS = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const NUMBERS = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26,
  ];
  let rows = [];
  let columns = [];

  // Create an array of letters for rows based on how many the user chose
  for (let i = 0; i < height; i++) {
    rows.push(LETTERS[i]);
  }
  // Create an array of numbers for columns based on how many the user chose
  for (let i = 0; i < width; i++) {
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
  let playingFieldWithMinesAndInfoOnNeighboringSquares = findSurroundingSquares(
    playingFieldWithMines,
    rows,
    columns
  );
  let playingFieldWithNumberOfMinesInAdjacentSquares =
    findMinesInSurroundingSquares(
      playingFieldWithMinesAndInfoOnNeighboringSquares
    );
  return playingFieldWithNumberOfMinesInAdjacentSquares;
}

/**
 * Gets random squares from the playing field and assign mines to them.
 * @param {*} minesToLay is the amount of mines to be distributed on the playing field
 * @param {*} playingField is the array of objects (one object per square) that is modified in this function
 * @returns
 */
function layMines(minesToLay, playingField) {
  let assignedMines = 0;
  let randomlyPickedSquares = [];
  while (assignedMines < minesToLay) {
    let randomSquare =
      playingField[Math.floor(Math.random() * playingField.length)];
    if (!randomlyPickedSquares.includes(randomSquare.name)) {
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
 * @param {*} squares takes an array of objects (one object per square) that is modified in this function
 * @param {*} rows takes an array of letters, one for each row on the playing field, e.g. ["a", "b", "c", "d", "e"]
 * @param {*} columns takes an array of numbers, one for each column on the playing field, e.g. ["1", "2", "3", "4", "5"]
 * @returns
 */
function findSurroundingSquares(squares, rows, columns) {
  for (let i = 0; i < squares.length; i++) {
    let borderSquareHorizontally = 0;
    let borderSquareVertically = 0;
    let letterBefore = "";
    let letterAfter = "";
    let numberBefore = "";
    let numberAfter = "";

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
    if (lettersIndexNumber === 0 && borderSquareHorizontally === 0) {
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
    if (numberOfThisSquare === columns.length && borderSquareVertically === 0) {
      numberBefore = columns.length - 1;
    } else {
      numberBefore = numberOfThisSquare - 1;
      if (columns.includes(numberOfThisSquare + 1)) {
        numberAfter = numberOfThisSquare + 1;
      }
    }

    // This makes sure corner squares don't have a0 etc. as neighboring squares.
    if (numberBefore === 0) {
      numberBefore = "";
    }

    // Now it puts the letters and numbers together to form square names like d3, e5 or a2. Where there are values missing,
    // it will produce broken square names like "a" or "3". These would be squares that we won't want anyway, so it's a good thing.
    let adjacentSquares = [
      letterOfThisSquare + numberAfter,
      letterOfThisSquare + numberBefore,
      letterBefore + numberOfThisSquare,
      letterBefore + numberBefore,
      letterBefore + numberAfter,
      letterAfter + numberOfThisSquare,
      letterAfter + numberBefore,
      letterAfter + numberAfter,
    ];

    // Clean up broken square names generated above by iterating in reverse order through the array and splicing all from the array
    // that are either undefined, NaN or just a letter or a number, not a combination of both.
    for (let i = adjacentSquares.length - 1; i >= 0; i--) {
      if (
        adjacentSquares[i].length < 2 ||
        adjacentSquares[i] === "undefined" ||
        Number.isNaN(adjacentSquares[i])
      ) {
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
 * It then adds this information for each square and returns the array of squares.
 */
function findMinesInSurroundingSquares(squares) {
  for (let i = 0; i < squares.length; i++) {
    let squaresToCheck = squares[i].neighboringSquares;
    let countedMines = 0;
    for (let square of squaresToCheck) {
      // Get the index number of the square we want to check
      for (let j = 0; j < squares.length; j++) {
        if (squares[j].name === square) {
          // With the index number, check if the square has a mine
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
  for (
    let i = 0;
    i < playingFieldInformation.length;
    i += sizeOfSmallerArrays
  ) {
    arrayOfArrays.push(
      playingFieldInformation.slice(i, i + sizeOfSmallerArrays)
    );
  }

  // Now, generate the HTML
  let playingFieldHTML = "";
  let playingFieldHTMLRow = "";
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
    playingFieldHTMLRow += "</div>";
    playingFieldHTML += playingFieldHTMLRow;
    playingFieldHTMLRow = "";
  }
  // Insert the HTML
  let whereToInsert = document.querySelector("#actual-playing-field");
  whereToInsert.insertAdjacentHTML("beforeend", playingFieldHTML);
}

/**
 * This function contains the event listeners for the playing field as well as the triggers for winning or losing the game.
 * With left clicks, users reveal squares.
 * With right clicks, users can mark squares as mined. When they click such squares again, they unmark the squares again.
 * The functions actually doing this are just below this function.
 */
function makePlayingFieldInteractive() {
  let squares = document.getElementsByClassName("square");

  for (let square of squares) {
    square.addEventListener("click", leftClickOnSquare);
    square.addEventListener("contextmenu", rightClickOnSquare);
    // The onLongPress function was taken from https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone
    onLongPress(square, function (element) {
      longPressOnSquare(square);
    });
  }
}

/**
 * This whole function was taken from https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone
 * with minimal editing.
 * @param {} element
 * @param {*} callback
 */
function onLongPress(element, callback) {
  var timeoutId;

  element.addEventListener(
    "touchstart",
    function (e) {
      timeoutId = setTimeout(function () {
        timeoutId = null;
        e.stopPropagation();
        callback(e.target);
      }, 2000);
    },
    { passive: true }
  );

  element.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  element.addEventListener(
    "touchend",
    function () {
      if (timeoutId) clearTimeout(timeoutId);
    },
    { passive: true }
  );

  element.addEventListener(
    "touchmove",
    function () {
      if (timeoutId) clearTimeout(timeoutId);
    },
    { passive: true }
  );
}

function leftClickOnSquare() {
  // Find out what square was clicked:
  const filterForSquare = playingFieldInformation.filter(
    (square) => square.name === this.id
  );
  const thisSquare = filterForSquare[0];

  // Reveal square
  revealSquare(thisSquare.name, thisSquare.neighboringSquares);

  // Lose?
  if (thisSquare.hasMine === 1) {
    clearInterval(myTimer);
    document.getElementById("actual-playing-field").style.backgroundColor =
      "red";
    document.getElementById(thisSquare.name).style.border = "4px solid yellow";
    document.getElementById(thisSquare.name).style.color = "transparent";
    let markedSquares = document.getElementsByClassName("marked-as-mine");
    for (let square of markedSquares) {
      square.style.backgroundColor = "#f0f0f0";
    }
    let minedSquares = document.getElementsByClassName("has-mine");
    for (let square of minedSquares) {
      square.style.backgroundColor = "black";
    }
  }

  // Win?
  if (revealToWin.length === 0) {
    clearInterval(myTimer);
    document.getElementById("actual-playing-field").style.backgroundColor =
      "green";
    let minedSquares = document.getElementsByClassName("has-mine");
    for (let square of minedSquares) {
      square.style.backgroundColor = "black";
    }
    document.getElementById("mine-countdown").innerText = 0;
    removeInteractivity();
  }

  // If there are no mines in its adjacent squares, add all of them to an array of squares to reveal

  while (squaresToCheck.length > 0) {
    if (
      !document
        .getElementById(squaresToCheck[0].name)
        .classList.contains("has-mine")
    ) {
      if (!alreadyChecked.includes(squaresToCheck[0]))
        revealSquare(
          squaresToCheck[0].name,
          squaresToCheck[0].neighboringSquares
        );
      alreadyChecked.push(squaresToCheck[0]);
    }
    squaresToCheck.splice(0, 1);
  }
  alreadyChecked = [];
}

function revealSquare(square, neighbors) {
  revealToWin = revealToWin.filter((x) => x !== square);

  const x = document.getElementById(square);
  x.style.backgroundColor = "white";

  let number = Number(x.innerText);
  // Set a different font color depending on how many mines there are in the surrounding squares
  switch (number) {
    case 0:
      x.style.color = "transparent";
      break;
    case 1:
      x.style.color = "black";
      break;
    case 2:
      x.style.color = "darkorange";
      break;
    case 3:
      x.style.color = "red";
      break;
    case 4:
      x.style.color = "blue";
      break;
    case 5:
      x.style.color = "hotpink";
      break;
    case 6:
      x.style.color = "maroon";
      break;
    case 7:
      x.style.color = "navy";
      break;
    case 8:
      x.style.color = "fuchsia";
      break;
  }
  if (Number(x.innerText) === 0) {
    if (neighbors) {
      for (let neighbor of neighbors) {
        const filterForSquare = playingFieldInformation.filter(
          (square) => square.name === neighbor
        );
        const thisSquare = filterForSquare[0];
        if (
          !squaresToCheck.includes(thisSquare) &&
          !alreadyChecked.includes(thisSquare)
        ) {
          // There is a bug where "undefined" mysteriously gets added to "squaresToCheck" that I could not investigate yet.
          // For now, this prevents it so everything is working.
          if (thisSquare !== undefined) {
            squaresToCheck.push(thisSquare);
          }
        }
      }
    }
  }
  x.removeEventListener("contextmenu", rightClickOnSquare);
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
      this.classList.add("marked-as-mine");
      this.removeEventListener("click", leftClickOnSquare);
      // Update mine counter
      document.getElementById("mine-countdown").innerText =
        document.getElementsByClassName("has-mine").length -
        document.getElementsByClassName("marked-as-mine").length;
      break;
    case "black":
      this.style.backgroundColor = "";
      this.classList.remove("marked-as-mine");
      this.addEventListener("click", leftClickOnSquare);
      // Update mine counter
      document.getElementById("mine-countdown").innerText =
        document.getElementsByClassName("has-mine").length -
        document.getElementsByClassName("marked-as-mine").length;
      break;
  }
}

function longPressOnSquare(square) {
  switch (square.style.backgroundColor) {
    case "":
      square.style.backgroundColor = "black";
      square.classList.add("marked-as-mine");
      // Update mine counter
      document.getElementById("mine-countdown").innerText =
        document.getElementsByClassName("has-mine").length -
        document.getElementsByClassName("marked-as-mine").length;
      break;
    case "black":
      square.style.backgroundColor = "";
      square.classList.remove("marked-as-mine");
      // Update mine counter
      document.getElementById("mine-countdown").innerText =
        document.getElementsByClassName("has-mine").length -
        document.getElementsByClassName("marked-as-mine").length;
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
    counter++;
    document.getElementById("timer").innerText = counter;
  }, 1000);
}

/**
 * This function finds the viewport height and width of the user's device. It then adjusts the square size to the viewport width
 * so that the screen real estate is used better. This results in bigger buttons and a better user experience on mobile.
 */
function adjustPlayingFieldToViewportWidth() {
  // The code for getting the viewport height and width was taken from https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  const numberOfColumns =
    document.getElementsByClassName("row-of-mines")[0].childElementCount;
  const numberOfRows = document.getElementsByClassName("row-of-mines").length;

  // Calculate and set how big the square should be to fit and fill the screen horizontally
  let squareWidth = Math.floor((vw / numberOfColumns) * 0.8);
  let squares = document.getElementsByClassName("square");
  for (let square of squares) {
    square.style.height = `${squareWidth}px`;
    square.style.width = `${squareWidth}px`;
  }

  // Calculate and set needed vertical space
  let neededVerticalSpace = squareWidth * numberOfRows + squareWidth * 3;
  if (neededVerticalSpace > vh) {
    let verticalHeight = document.getElementById("game-area");
    verticalHeight.style.height = `${neededVerticalSpace}px`;
  }
}

/**
 * This function finds the viewport height and width of the user's device. It then adjusts the square size to the viewport height
 * so that the screen real estate is used better. This results in bigger buttons and a better user experience on mobile.
 */
function adjustPlayingFieldToViewportHeight() {
  // The code for getting the viewport height and width was taken from https://stackoverflow.com/questions/1248081/how-to-get-the-browser-viewport-dimensions
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const numberOfRows = document.getElementsByClassName("row-of-mines").length;
  const numberOfColumns =
    document.getElementsByClassName("row-of-mines")[0].childElementCount;

  // Calculate and set how big the square should be to fit and fill the screen vertically
  let squareWidth = Math.floor((vh / numberOfRows) * 0.8);

  // If calculated square width would not fit because there are too many columns (might happen with user customized parameters), calculated maximum available horizontal space and fill that.
  if (squareWidth * numberOfColumns > vw) {
    squareWidth = Math.floor((vw / numberOfColumns) * 0.8);
  }

  // Style all squares with the calculated value
  let squares = document.getElementsByClassName("square");
  for (let square of squares) {
    square.style.height = `${squareWidth}px`;
    square.style.width = `${squareWidth}px`;
  }
}

/**
 * This function takes a name and value for a cookie and sets it.
 * This was adapted from https://www.w3schools.com/js/js_cookies.asp, I cut out the part where it sets an expiry date for the cookie.
 * @param {*} cname = cookie's name
 * @param {*} cvalue = cookie's value
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
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
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
  document.getElementById("game-area").style.backgroundColor = prefcolor;
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
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  if (vw > vh) {
    return "landscape";
  } else {
    return "portrait";
  }
}

function removeInteractivity() {
  let squares = document.getElementsByClassName("square");
  for (let square of squares) {
    square.removeEventListener("click", leftClickOnSquare);
    square.removeEventListener("contextmenu", rightClickOnSquare);
    // The onLongPress function was taken from https://stackoverflow.com/questions/6139225/how-to-detect-a-long-touch-pressure-with-javascript-for-android-and-iphone
    onLongPress(square, () => {
      longPressOnSquare(square);
    });
  }
}
