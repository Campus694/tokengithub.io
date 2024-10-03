// Отображение текущего баланса
document.getElementById("balance").innerText = localStorage.getItem("balance");

let balance = parseInt(localStorage.getItem("balance"));
let betAmount = 0;
let isPlaying = false;
let multiplier = 1.00;
let rocketInterval = null;
let rocketHeight = 0;

// Функция для обновления баланса
function updateBalance() {
    document.getElementById("balance").innerText = balance;
    localStorage.setItem("balance", balance);
}

// Начало игры (взлет ракеты)
function startGame() {
    isPlaying = true;
    multiplier = 1.00;
    rocketHeight = 0;
    document.getElementById("multiplier").innerText = multiplier.toFixed(2);
    document.getElementById("cashOut").disabled = false;

    rocketInterval = setInterval(() => {
        multiplier += 0.02; // Коэффициент растет
        rocketHeight += 2; // Ракета поднимается

        document.getElementById("multiplier").innerText = multiplier.toFixed(2);
        document.getElementById("rocket").style.transform = `translateY(-${rocketHeight}px)`;

        if (Math.random() < 0.02) { // 2% вероятность взрыва на каждом шаге
            endGame(false);
        }
    }, 100);
}

// Завершение игры
function endGame(isSuccess) {
    clearInterval(rocketInterval);
    document.getElementById("cashOut").disabled = true;
    isPlaying = false;

    if (isSuccess) {
        const winnings = (betAmount * multiplier).toFixed(2);
        balance += parseFloat(winnings);
        alert(`Вы забрали ставку! Ваш выигрыш: ${winnings}`);
    } else {
        alert("Ракета взорвалась! Вы потеряли ставку.");
    }

    updateBalance();
    resetGame();
}

// Сброс игры
function resetGame() {
    document.getElementById("rocket").style.transform = "translateY(0)";
    rocketHeight = 0;
    betAmount = 0;
    document.getElementById("bet").disabled = false;
    document.getElementById("placeBet").disabled = false;
}

// Обработка нажатия кнопки "Сделать ставку"
document.getElementById("placeBet").addEventListener("click", function() {
    betAmount = parseInt(document.getElementById("bet").value);
    
    if (betAmount > balance) {
        alert("Недостаточно средств для ставки.");
        return;
    }

    balance -= betAmount;
    updateBalance();
    startGame();

    document.getElementById("bet").disabled = true;
    document.getElementById("placeBet").disabled = true;
});

// Обработка нажатия кнопки "Забрать ставку"
document.getElementById("cashOut").addEventListener("click", function() {
    if (isPlaying) {
        endGame(true);
    }
});
  
