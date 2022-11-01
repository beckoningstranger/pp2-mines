# Contents

* [**Validator Testing**](#validator-testing)
  * [HTML and CSS](#html-and-css)
  * [Javascript](#javascript)
  * [Lighthouse Test](#lighthouse-test)
  * [WAVE Web Accessibility Evaluation Tool](#wave-web-accessibility-evaluation-tool)
* [Responsiveness Test](#responsiveness-test)
  * [Chrome Dev Tools](#chrome-dev-tools)
  * [Firefox Dev Tools](#firefox-dev-tools)
* [Testing User Stories](#testing-user-stories)
* [Solved Bugs](#solved-bugs)
* [Known Bugs](#known-bugs)

[Back to README.md](README.md)

# Validator Testing

## HTML and CSS

  To test compliance with HTML standards, the [W3C Markup Validation Service](https://validator.w3.org/) was used. Here are the results for all files:

  ![index.html](/assets/readme-images/nuhtml.jpg)
  ![style.css](/assets/readme-images/jigsaw.jpg)

  [Back to top](<#contents>)

## Javascript

  To ensure that there are no problems in my Javascript code I used JSHint and discussed the results with my mentor.
  ![style.css](/assets/readme-images/jshint.png)

## Lighthouse Test

  Lighthouse Test for desktops - index.html

  ![Lighthouse Test for desktops](/assets/readme-images/lighthouse_desktop.jpg)

  Lighthouse Test for mobile devices - index.html

  ![Lighthouse Test for mobile devices](/assets/readme-images/lighthouse_mobile.jpg)

  [Back to top](<#contents>)

## WAVE Web Accessibility Evaluation Tool

  WAVE does not report any errors or contrast errors.

  ![WAVE Testing](/assets/readme-images/wave.jpg)

  [Back to top](<#contents>)

# Responsiveness Test

  Extensive tests were conducted to ensure that the website looks great both on devices as small as the Galaxy Fold, which has only 280px of horizontal space when in portrait mode, up to viewports with 1920px in viewport width such as desktop computers. Mobile devices were tested with both Google Chrome and Firefox Dev Tools and both in portrait as well as landscape mode.

  All tests were carried out in the developer tools of the browsers.

## Chrome Dev Tools

  || Moto G4 | iPhone SE | iPhone XR | iPhone 12 Pro | Pixel 5 | Samsung Galaxy S8+ | Samsung Galaxy S20 Ultra | iPad Air | iPad Mini | iPad Pro (12.9 inch) | Surface Pro 7 | Surface Duo | Galaxy Fold | Nest Hub | Nest Hub Max | Pixel 2 XL | Laptops (1366x768) | Desktops (1920x1080px) |
  | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | Render | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
  | Images | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
  | Links | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |

## Firefox Dev Tools

  || iPad Air | iPad Mini | iPad Pro (12.9 inch) | iPhone 12/13 + Pro iOS 14.6 | iPhone 5/SE iOS 10.3.1 | iPhone 2nd gen iOS 14.6 | iPhone XR/11 iOS 12 | Microsoft Lumia 550 | Microsoft Lumia 950 | Laptops (1366x768) | Desktops (1920x1080px)
  | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
  | User Agent | Safari | Safari | Safari | Safari | Safari | Safari | Safari | Edge | Edge | Firefox | Firefox |
  | Render | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
  | Images | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |
  | Links | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass | pass |

[Back to top](<#contents>)

# Browser compatibility

The website was tested in Google Chrome, Mozilla Firefox, Microsoft Edge, Opera and Brave. Everything worked as intended.

[Back to top](<#contents>)

# Testing User Stories

  **As a user, I want to learn how the game works.**
  
  * From the main menu, users can click the 'How To Play' button to do this.

  **As a user, I want to play Minesweeper in a difficulty setting fitting my skill level so that I won't feel frustrated while playing.**

  * From the main menu, users can click 'Start Game' and then either pick a predefined difficulty level by clicking one of the three buttons for this or click 'Customize Settings' to go to the custom difficulty page where they can set their own settings by entering values for height, width and mines. After clicking the 'Start playing' button, the game starts.

  **As a user, I want to customize the look of the game so that it's pleasing to the eye.**

  * From the main menu, users can click the 'Settings' button to open the settings menu. Here, they can choose from 9 different background colors just by clicking one of the colored buttons. They can also activate 'Desktop Mode' to prevent the squares on the playing field from being resized to fully use the available space of their viewports. These settings are saved in a cookie so that users won't have to set them again and again.

  **As a user, I want to see how long it takes me to win a game so that I can track my performance and see whether I'm getting faster.**

  * After starting a game, a timer at the top of the playing field is started that only stops after the user has either won or lost the current game. This way, users can keep track of their performance.

  **As a user, I want to see how many mines there are left to find so that it helps me to make informed decisions during the final phase of the game.**

  * At the top of the playing field the number of mines that users still have to find is shown. It decreases when a user marks a field by right-clicking on it.

  **As a user, I want the ability to mark and unmark squares as mines so that it's easier for me to make quick decisions during the game.**

  * This is done by right-clicking squares, just as experienced Minesweeper players would expect.

  **As a user, I want the ability to quickly restart my game without having to go through the initial menus. Losing happens frequently, so I don't want to waste time.**

   * There is a button (a circle arrow) at the top left of the playing field that allows users to quickly generate a new playing field with one click.

[Back to top](<#contents>)

# Solved Bugs

* When I was working on the part of the code that distributed mines on the playing field, at some point the code looked like this:
  ```js
  let numberOfMines = 10;
  let assignedMines = 0;
  while (assignedMines < numberOfMines) {
    let randomSquare = squares[Math.floor(Math.random() * squares.length)];
    randomSquare.hasMine = 1;
    assignedMines++
    }
  ```
  It was not separated into a function at that point. With this code, sometimes playing fields were generated that did not have the required amount of mines. This was because some fields were assigned two mines, so while laying the mines I had to keep track of the fields that already had been assigned one so that it could not be used twice.

  Now the code looks like this: 
  ```js
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
    ```
* The biggest challenge in all of this was finding a way to compile a list of all squares that surround any given square. This is done by the findSurroundingSquares function. Figuring this out, I first got lists where even border squares that have only 5 adjacent squares would have 8 surrounding squares in the code. The code was this:
  ```js
  if ((numberOfThisSquare === columns.length) && (borderSquareVertically === 0)) {
            numberBefore = columns.length - 1;
        } else {
            numberBefore = numberOfThisSquare - 1;
            numberAfter =  numberOfThisSquare + 1;
            }
  ```
  I then realized that I needed to check whether it needed to assign a numberAfter value. This should not happen if it is looking at a border square and there should not be a square next to it. After introducing this check the code worked:
  ```js
  if ((numberOfThisSquare === columns.length) && (borderSquareVertically === 0)) {
            numberBefore = columns.length - 1;
        } else {
            numberBefore = numberOfThisSquare - 1;
            if (columns.includes(numberOfThisSquare + 1)) {
                numberAfter =  numberOfThisSquare + 1;
            }
        }
  ```
* After creating an array of potential surrounding squares in findSurroundingSquares one of the last steps is to clean up this array by eliminating all array items that are not valid squares. Iterating through this array by index number and cutting off unwanted items would mess up the iteration process because index numbers would shift when items were cut off. The solution was to iterate through the array in reverse order. This way, the index numbers of the items that still needed to be looked at would stay the same. Now the code is this:
  ```js
  // Clean up broken square names generated above by iterating in reverse order through the array and splicing all from the array 
  // that are either undefined, NaN or just a letter or a number, not a combination of both.
  for (let i = adjacentSquares.length - 1; i >= 0; i--) {
        if ((adjacentSquares[i].length < 2) || (adjacentSquares[i] === "undefined") || (Number.isNaN(adjacentSquares[i]))) {
            let indexOfThatSquare = adjacentSquares.indexOf(adjacentSquares[i]);
            adjacentSquares.splice(indexOfThatSquare, 1);
        }
    }
  ```
* The function buildVisiblePlayingField(playingFieldInformation, rows) generates HTML based on the data in the array that contains the playing field information and inserts it into the DOM. It takes the value of the 'rows' variable (which should be a number) to the sizeOfSmallerArray variable. Initially my code was this:
  ```js
  function buildVisiblePlayingField(playingFieldInformation, rows) {
    // First, slice the big playing field array into smaller arrays so that we get one array per row
    let sizeOfSmallerArrays = rows; 
      let arrayOfArrays = [];
      for (let i=0; i < playingFieldInformation.length; i += sizeOfSmallerArrays) {
        arrayOfArrays.push(playingFieldInformation.slice(i, i + sizeOfSmallerArrays));
    }
  ```
  It did not work. After some troubleshooting I found that the data type of the 'rows' value was a string. Converting this back to a number fixed the bug:
  ```js
  function buildVisiblePlayingField(playingFieldInformation, rows) {
    // First, slice the big playing field array into smaller arrays so that we get one array per row
    let sizeOfSmallerArrays = Number(rows); 
      let arrayOfArrays = [];
      for (let i=0; i < playingFieldInformation.length; i += sizeOfSmallerArrays) {
        arrayOfArrays.push(playingFieldInformation.slice(i, i + sizeOfSmallerArrays));
    }
  ```
* Generating larger playing fields I encountered a bug where playing fields that had more than 9 rows did not work. The critical part was in the findSurroundingSquares function where it assigns the 'numberOfThisSquare' variable.
  ```js
  let numberOfThisSquare = Number(squares[i].name[1]);
  ```
  This looked only at the second (and last) character in the square name, so any square name that consisted of three characters would be cut off. I then created this function to perform the task of finding the correct number, which fixed the issue. It now checks how long the square name is and acts accordingly, looking at the last and second to last character if it's a 3 character square name.
  ```js
  function findNumberOfThisSquare(squares, i) {
    if (squares[i].name.length === 3) {
        let numberOfThisSquare = Number(squares[i].name[1] + squares[i].name[2]);
        return numberOfThisSquare;
    } else if (squares[i].name.length === 2) {
        let numberOfThisSquare = Number(squares[i].name[1]);
        return numberOfThisSquare;
    }
  }
  ```
* After implementing the winning and losing behavior of the playing field, users could initially play on after either winning or losing because the playing field would still be clickable. This way, they could still trigger winning behavior after having clicked on a mine and they could also still lose after having won. The solution was to get rid of all playing field related event triggers after either winning or losing. This was accomplished by using an abort controller.

  This is the winning behavior that calls the abort function for the abort controller.
  ```js
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
  ```
  This abort controller is initialized and used here:
  ```js
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
  ```
  Now the playing field becomes unresponsive after either winning or losing. Problem solved.

[Back to top](<#contents>)

# Known Bugs

  * None.

[Back to top](<#contents>)

[Back to README.md](README.md)