let displayValue = "0";
let firstNumber = null;
let secondNumber = null;
let operator = null;
let waitingForSecondNumber = false;

function updateDisplay() {
    const display = document.getElementById("display");
    display.textContent = displayValue;
}

function appendToDisplay(value) {

    if (waitingForSecondNumber) {
        displayValue = value;
        waitingForSecondNumber = false;
    } else {
        if (displayValue === "0") {
            displayValue = value;
        } else {
            displayValue += value;
        }
    }
    updateDisplay();
}

function appendDecimal() {
    if (waitingForSecondNumber) {
        displayValue = "0.";
        waitingForSecondNumber = false;
    } else if (!displayValue.includes(".")) {
        displayValue += ".";
    }
    updateDisplay();
}

function setOperator(op) {
    if (firstNumber === null) {
        firstNumber = parseFloat(displayValue);
    } else if (waitingForSecondNumber) {
        operator = op; 
        return;
    } else {
        calculate();
    }
    operator = op;
    waitingForSecondNumber = true;
}

function calculate() {
    if (firstNumber === null || operator === null || waitingForSecondNumber) return;

    secondNumber = parseFloat(displayValue);
    let result;

    switch (operator) {
        case "+":
            result = add(firstNumber, secondNumber);
            break;
        case "-":
            result = subtract(firstNumber, secondNumber);
            break;
        case "*":
            result = multiply(firstNumber, secondNumber);
            break;
        case "/":
            if (secondNumber === 0) {
                result = "Error";
            } else {
                result = divide(firstNumber, secondNumber);
            }
            break;
        default:
            return;
    }

    if (typeof result === "number" && result % 1 !== 0) {
        result = parseFloat(result.toFixed(2));
    }

    displayValue = result.toString();
    firstNumber = parseFloat(result);
    secondNumber = null;
    operator = null;
    waitingForSecondNumber = true;
    updateDisplay();
}

function clearDisplay() {
    displayValue = "0";
    firstNumber = null;
    secondNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    updateDisplay();
}

function backspace() {
    displayValue = displayValue.slice(0, -1);
    if (displayValue === "") {
        displayValue = "0";
    }
    updateDisplay();
}

document.addEventListener("keydown", function(event) {
    if (!isNaN(event.key)) { 
        appendToDisplay(event.key);
    } else if (event.key === ".") {
        appendDecimal();
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        event.preventDefault();
        setOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    } else if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
    } else if (event.key === "Escape") {
        clearDisplay();
    }
});

const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;
