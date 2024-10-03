document.getElementById("balance").innerText = localStorage.getItem("balance");

let balance = parseInt(localStorage.getItem("balance")) || 1000; // Начальный баланс
let betAmount = 0;
let multiplier = 1;
let mines = [];
let revealedCells = 0;
let gameEnded = false;
const totalCells = 25;
const totalMines = 4;
const multiplierStep = 0.35; // Увеличение коэффициента за каждую безопасную ячейку

// Функция для обновления баланса
function updateBalance() {
    document.getElementById("balance").innerText = balance;
    localStorage.setItem("balance", balance);
}

// Функция для начала игры
function startGame() {
    betAmount = parseInt(document.getElementById("bet").value);
    if (betAmount > balance) {
        alert("Недостаточно средств для ставки.");
        return;
    }

    balance -= betAmount; // Снимаем ставку с баланса при начале игры
    updateBalance();
    
    resetGrid();
    placeMines();
    revealedCells = 0;
    gameEnded = false;
    multiplier = 1;
    updateMultiplier();
    document.getElementById("collectPrize").disabled = false;
    document.getElementById("placeBet").disabled = true;
}

// Обновить коэффициент
function updateMultiplier() {
    document.getElementById("multiplier").innerText = multiplier.toFixed(2);
}

// Сброс игрового поля
function resetGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = '';
    for (let i = 0; i < totalCells; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", () => revealCell(i, cell));
        grid.appendChild(cell);
    }
}

// Расположение мин случайным образом
function placeMines() {
    mines = Array(totalCells).fill(false);
    let placedMines = 0;
    while (placedMines < totalMines) {
        let index = Math.floor(Math.random() * totalCells);
        if (!mines[index]) {
            mines[index] = true;
            placedMines++;
        }
    }
}

// Открытие ячейки
function revealCell(index, cell) {
    if (gameEnded || cell.classList.contains("revealed")) return;

    cell.classList.add("revealed");
    if (mines[index]) {
        cell.classList.add("mine");
        gameOver(false); // Проигрыш
    } else {
        cell.classList.add("safe");
        revealedCells++;
        multiplier += multiplierStep;
        updateMultiplier();
        if (revealedCells === totalCells - totalMines) {
            gameOver(true); // Победа
        }
    }
}

// Завершение игры
function gameOver(win) {
    gameEnded = true;
    document.getElementById("collectPrize").disabled = true;
    document.getElementById("placeBet").disabled = false;

    // Вскрытие всех ячеек
    document.querySelectorAll(".cell").forEach((cell, index) => {
        if (mines[index]) {
            cell.classList.add("mine");
        } else {
            cell.classList.add("safe");
        }
    });

    if (win) {
        balance += betAmount * multiplier; // Начисление выигрыша только при победе
        updateBalance();
    }

    // Через 2 секунды перезапустить игру
    setTimeout(resetGame, 2000);
}

// Сброс игры
function resetGame() {
    resetGrid();
    placeMines();
    revealedCells = 0;
    gameEnded = false;
    multiplier = 1;
    updateMultiplier();
}

// Забирать приз до окончания игры
document.getElementById("collectPrize").addEventListener("click", function() {
    gameEnded = true;
    balance += betAmount * multiplier; // Начисление частичного выигрыша
    updateBalance();

    // Вскрыть ячейки и через 2 секунды перезапустить игру
    document.querySelectorAll(".cell").forEach((cell, index) => {
        if (mines[index]) {
            cell.classList.add("mine");
        } else {
            cell.classList.add("safe");
        }
    });

    setTimeout(resetGame, 2000);
});

// Начать новую игру
document.getElementById("placeBet").addEventListener("click", startGame);

// Инициализация баланса
updateBalance();
      
