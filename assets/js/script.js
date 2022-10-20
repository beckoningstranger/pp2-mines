function userChoseDifficulty(event) {
    event.preventDefault();
    rows = document.getElementById('width').value;
    columns = document.getElementById('height').value;
    mines = document.getElementById('mines').value;
    console.log(`User wants a playing field that's ${rows} x ${columns} with ${mines} mines.`);
}

form = document.getElementById('set-difficulty');
form.addEventListener('submit', userChoseDifficulty);