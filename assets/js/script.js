function userChoseDifficulty(event) {
    event.preventDefault();
    rows = document.getElementById('width').value;
    columns = document.getElementById('height').value;
    mines = document.getElementById('mines').value;
    console.log(`User wants a playing field that's ${rows} x ${columns} with ${mines} mines.`);
    // Hide the settings menu:
    const difficultySettings = document.getElementById('difficulty-settings');
    difficultySettings.style.display = 'none';
    // Show and style playing field:
    const playingField = document.getElementById('playing-field');
    playingField.style.display = 'grid';
    playingField.style.alignContent = 'center';
}

function calculateMaxNumberOfMines() {
    console.log('YO');
}

form = document.getElementById('set-difficulty');
form.addEventListener('submit', userChoseDifficulty);