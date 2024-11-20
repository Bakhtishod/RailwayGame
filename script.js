document.querySelectorAll('.rules').forEach(button => {
    button.addEventListener('click', openPopup);
});

document.querySelectorAll('.start-game').forEach(button => {
    button.addEventListener('click', startGame);
});

const easyButton = document.querySelector('#easy');
const hardButton = document.querySelector('#hard');
const container = document.querySelector('.container');
const gameContainer = document.querySelector('.game-container');
const railTrackImage = document.querySelector('#railTrack');
const designerName = document.querySelector('#designerName');
const timerElement = document.querySelector('#timer');
const gridContainer = document.querySelector('.game-board');
const optionsTitle = document.querySelector('#optionsTitle');
const cellOptionsContainer = document.querySelector('#cellOptionsContainer');
const errorPopup = document.querySelector('#errorPopup');
const errorMessage = document.querySelector('#errorMessage');
const winPopup = document.querySelector('#winPopup');
const winMessage = document.querySelector('#winMessage');
const timeTakenElement = document.querySelector('#timeTaken');
const restartButton = document.querySelector('#restartButton');
const backButton = document.querySelector('#backButton');
const mainBackButton = document.querySelector('#mainBackButton');
const leaderBoardButton = document.querySelector('#leaderBoardButton');
const leaderboardPopup = document.querySelector('#leaderboardPopup');
const leaderboardContent = document.querySelector('#leaderboardContent');

let timerInterval;
let startTime;
let selectedDifficulty = null;
let currentSelectedCell = null;
let gridSize;
let randomIndex;
let gridMatrix = [];

let eSolutions = [];
let hSolutions = [];

easyButton.addEventListener('click', () => toggleDifficulty('easy', easyButton, hardButton));
hardButton.addEventListener('click', () => toggleDifficulty('hard', hardButton, easyButton));

function toggleDifficulty(level, button, otherButton) {
    if (selectedDifficulty === level) {
        button.classList.remove('active');
        button.style.border = '2px solid #EAEFD3';
        selectedDifficulty = null;
    } else {
        button.classList.add('active');
        otherButton.classList.remove('active');
        selectedDifficulty = level;
    }
}

function startGame() {
    clearInterval(timerInterval);
    timerElement.textContent = '0:00';

    const username = document.querySelector('#username').value;
    if (!selectedDifficulty) {
        showErrorPopup('Please select a difficulty level before starting the game :|');
        return;
    }
    if (!username) {
        showErrorPopup('Please enter your name before starting the game :|');
        return;
    }

    designerName.textContent = username;
    container.style.display = 'none';
    railTrackImage.style.display = 'none';
    gameContainer.style.display = 'flex';
    optionsTitle.style.display = 'none';
    cellOptionsContainer.style.display = 'none';
    startTime = Date.now();
    startTimer();
    generateGrid();
}

function showErrorPopup(message) {
    errorMessage.textContent = message;
    errorPopup.style.display = 'block';
    setTimeout(() => {
        errorPopup.style.display = 'none';
    }, 5000);
}

function startTimer() {
    let elapsedTime = 0;
    const totalTime = 20 * 60;

    timerInterval = setInterval(() => {
        elapsedTime++;
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (elapsedTime >= totalTime) {
            clearInterval(timerInterval);
            showWinPopup(false);
        }
    }, 1000);
}

function generateGrid() {
    gridContainer.innerHTML = '';
    const gridData = selectedDifficulty === 'easy' ? getRandomArray(easy) : getRandomArray(hard);
    randomIndex = (selectedDifficulty === 'easy') ? easy.indexOf(gridData) : hard.indexOf(gridData);

    gridSize = gridData.length;
    gridMatrix = JSON.parse(JSON.stringify(gridData));

    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');

            const imageUrl = gridData[row][col];
            if (imageUrl) {
                cell.style.backgroundImage = `url(${imageUrl})`;
                cell.style.backgroundSize = 'cover';
                cell.style.backgroundRepeat = 'no-repeat';
            } else {
                cell.style.backgroundColor = '#EAEFD3';
            }

            cell.addEventListener('click', () => selectCell(cell, row, col));
            gridContainer.appendChild(cell);
        }
    }
}

function getRandomArray(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

function selectCell(selectedCell, row, col) {
    if (currentSelectedCell && currentSelectedCell.element === selectedCell) {
        displayCellOptions(selectedCell, row, col);
        return;
    }

    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.border = '1px solid #A49584';
    });

    selectedCell.style.border = '4px solid white';
    currentSelectedCell = { element: selectedCell, row, col };

    displayCellOptions(selectedCell, row, col);
}

function displayCellOptions(selectedCell, row, col) {
    cellOptionsContainer.innerHTML = '';
    optionsTitle.style.display = 'none';
    cellOptionsContainer.style.display = 'none';

    const cellImage = selectedCell.style.backgroundImage;
    let options = [];

    if (cellImage.includes(bridge) || cellImage.includes(bridge_rail)) {
        options = [bridge_rail];
    } else if (cellImage.includes(bridge_90) || cellImage.includes(bridge_rail_90)) {
        options = [bridge_rail_90];
    } else if (cellImage.includes(empty) || cellImage.includes(straight_rail) || cellImage.includes(straight_rail_90) ||
        cellImage.includes(curve_rail) || cellImage.includes(curve_rail_90) ||
        cellImage.includes(curve_rail_180) || cellImage.includes(curve_rail_270)) {
        options = [straight_rail, straight_rail_90, curve_rail, curve_rail_90, curve_rail_180, curve_rail_270];
    } else if (cellImage.includes(mountain) || cellImage.includes(mountain_rail)) {
        options = [mountain_rail];
    } else if (cellImage.includes(mountain_90) || cellImage.includes(mountain_rail_90)) {
        options = [mountain_rail_90];
    } else if (cellImage.includes(mountain_180) || cellImage.includes(mountain_rail_180)) {
        options = [mountain_rail_180];
    } else if (cellImage.includes(mountain_270) || cellImage.includes(mountain_rail_270)) {
        options = [mountain_rail_270];
    }

    if (options.length > 0) {
        optionsTitle.style.display = 'block';
        cellOptionsContainer.style.display = 'flex';
        options.forEach(optionSrc => {
            const optionImg = document.createElement('img');
            optionImg.src = optionSrc;

            optionImg.addEventListener('click', () => {
                if (currentSelectedCell) {
                    currentSelectedCell.element.style.backgroundImage = `url(${optionSrc})`;
                    currentSelectedCell.element.style.backgroundSize = 'cover';
                    currentSelectedCell.element.style.backgroundRepeat = 'no-repeat';
                    gridMatrix[row][col] = optionSrc;

                    if (checkIfSolved()) {
                        clearInterval(timerInterval);
                        showWinPopup(true);
                    }
                }
            });

            cellOptionsContainer.appendChild(optionImg);
        });
    }
}

function checkIfSolved() {
    const solution = selectedDifficulty === 'easy' ? eSolutions[randomIndex] : hSolutions[randomIndex];

    if (!solution || !solution.length) {
        return false;
    }

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gridMatrix[i][j] !== solution[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function showWinPopup(isWin) {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    winMessage.textContent = isWin ? 'You won :)' : 'You lost :(';
    winMessage.style.color = isWin ? '#4CAF50' : '#f44336';
    timeTakenElement.textContent = `Time taken: ${formattedTime}`;

    const existingLeaderboard = document.querySelector('#leaderboard');
    if (existingLeaderboard) {
        existingLeaderboard.remove();
    }

    const leaderboardKey = `leaderboard_${selectedDifficulty}`;
    let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];

    if (isWin && selectedDifficulty) {
        const username = document.querySelector('#username').value;

        leaderboard.push({ name: username, time: timeTaken });
        leaderboard.sort((a, b) => a.time - b.time);

        localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
    }

    const top3 = leaderboard.slice(0, 3);
    const leaderboardDiv = document.createElement('div');
    leaderboardDiv.id = 'leaderboard';
    leaderboardDiv.innerHTML = '<h3>TOP 3 results</h3>';

    if (top3.length > 0) {
        top3.forEach((entry, index) => {
            const entryElement = document.createElement('p');
            entryElement.textContent = `${index + 1}. ${entry.name} - ${Math.floor(entry.time / 60)}:${entry.time % 60 < 10 ? '0' : ''}${entry.time % 60}`;
            leaderboardDiv.appendChild(entryElement);
        });
    } else {
        const noResultElement = document.createElement('p');
        noResultElement.textContent = 'No result found :|';
        leaderboardDiv.appendChild(noResultElement);
    }

    winPopup.insertBefore(leaderboardDiv, restartButton);
    winPopup.style.display = 'block';
}

leaderBoardButton.addEventListener('click', showFullLeaderboard);

function showFullLeaderboard() {
    const leaderboardKey = `leaderboard_${selectedDifficulty}`;
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];

    leaderboardContent.innerHTML = '';

    if (leaderboard.length > 0) {
        leaderboard.forEach((entry, index) => {
            const entryElement = document.createElement('p');
            entryElement.textContent = `${index + 1}. ${entry.name} - ${Math.floor(entry.time / 60)}:${entry.time % 60 < 10 ? '0' : ''}${entry.time % 60}`;
            leaderboardContent.appendChild(entryElement);
        });
    } else {
        const noResultElement = document.createElement('p');
        noResultElement.textContent = 'No result found :|';
        leaderboardContent.appendChild(noResultElement);
    }
    leaderboardPopup.style.display = 'block';
}

function closeLeaderboardPopup() {
    leaderboardPopup.style.display = 'none';
}

restartButton.addEventListener('click', () => {
    winPopup.style.display = 'none';
    startGame();
});

backButton.addEventListener('click', () => {
    winPopup.style.display = 'none';
    clearInterval(timerInterval);
    gameContainer.style.display = 'none';
    railTrackImage.style.display = 'flex';
    container.style.display = 'flex';
    startTime = null;
});

mainBackButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    gameContainer.style.display = 'none';
    railTrackImage.style.display = 'flex';
    container.style.display = 'flex';
    startTime = null;
});

document.querySelector('.close').addEventListener('click', closePopup);

function openPopup() {
    document.querySelector('#rulesPopup').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    document.querySelector('#rulesPopup').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}