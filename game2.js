// Отображение текущего баланса
document.getElementById("balance").innerText = localStorage.getItem("balance");

let balance = parseInt(localStorage.getItem("balance"));
let betAmount = 0;
let currentRound = 0;
const maxRounds = 5;
let isPlaying = false;

// Обновление баланса
function updateBalance() {
    document.getElementById("balance").innerText = balance;
    localStorage.setItem("balance", balance);
}

// Функция для начала игры
function startGame() {
    betAmount = parseInt(document.getElementById("bet").value);
    let userGuess = document.getElementById("guess").value;

    if (betAmount > balance) {
        alert("Недостаточно средств для ставки.");
        return;
    }

    balance -= betAmount;
    updateBalance();
    
    isPlaying = true;
    currentRound = 1;

    spinCoin(userGuess);
}

// Анимация вращения монеты
function spinCoin(userGuess) {
    document.getElementById("placeBet").disabled = true;

    let coin = document.getElementById("coin");
    coin.style.transform = "rotateY(720deg)";

    setTimeout(() => {
        let result = Math.random() < 0.5 ? "heads" : "tails";
        let win = result === userGuess;

        // Окрашивание фона в зависимости от результата
        if (win) {
            document.getElementById("game").style.backgroundColor = "#00ff00"; // Зеленый при выигрыше
            betAmount *= 1.3;
            // Включение индикатора текущего раунда
            document.getElementById(`round${currentRound}`).classList.add('active');
        } else {
            document.getElementById("game").style.backgroundColor = "#ff0000"; // Красный при проигрыше
        }

        // Зачисление выигрыша после каждого раунда
        if (win) {
            balance += betAmount;
        }

        updateBalance();
        coin.style.transform = `rotateY(${result === "heads" ? "0deg" : "180deg"})`;

        setTimeout(() => {
            document.getElementById("game").style.backgroundColor = "#1e1e1e"; // Возвращаем оригинальный цвет через 2 секунды
            document.getElementById("nextRound").disabled = false;

            if (!win || currentRound >= maxRounds) {
                resetGame();
            }
        }, 1000); // Зелёный/красный цвет держится 2 секунды
    }, 1000); // Время анимации вращения монеты
}

// Сброс игры
function resetGame() {
    document.getElementById("placeBet").disabled = false;
    document.getElementById("nextRound").disabled = true;
    betAmount = 0;
    currentRound = 0;
    isPlaying = false;

    // Сброс индикаторов раундов
    for (let i = 1; i <= maxRounds; i++) {
        document.getElementById(`round${i}`).classList.remove('active');
    }
}

// Переход к следующему раунду
document.getElementById("nextRound").addEventListener("click", function() {
    currentRound++;
    let userGuess = document.getElementById("guess").value;
    document.getElementById("nextRound").disabled = true;
    spinCoin(userGuess);
});

// Обработка нажатия кнопки "Сделать ставку"
document.getElementById("placeBet").addEventListener("click", function() {
    startGame();
});
                   
