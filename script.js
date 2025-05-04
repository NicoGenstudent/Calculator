
let displayValue = "0";
let firstNumber = null;
let secondNumber = null; 
let operator = null;
let waitingForSecondNumber = false;
let justCalculated = false; 


const display = document.getElementById("display");



function updateDisplay() {
    if (display) { 
        display.textContent = displayValue;
    } else {
        console.error("Display element not found!");
    }
}

function appendToDisplay(value) {
    if (displayValue === "Error") {
        displayValue = value;
        firstNumber = null; operator = null; waitingForSecondNumber = false;
        justCalculated = false;
    }
    else if (waitingForSecondNumber) {

        if (justCalculated) {
            firstNumber = null; 
            operator = null;    
        }
        displayValue = value;
        waitingForSecondNumber = false;
        justCalculated = false; 
    }
    else {
        if (displayValue === "0") {
            displayValue = value;
        } else {
                 displayValue += value;
        }
        justCalculated = false; 
    }
    updateDisplay();
}

function appendDecimal() {
    if (displayValue === "Error") {
        displayValue = "0.";
        firstNumber = null; operator = null; waitingForSecondNumber = false;
        justCalculated = false;
    }
    else if (waitingForSecondNumber) {
        if (justCalculated) {
            firstNumber = null; operator = null;
        }
        displayValue = "0.";
        waitingForSecondNumber = false;
        justCalculated = false;
    }
    else if (!displayValue.includes(".")) {
        displayValue += ".";
        justCalculated = false;
    }
    updateDisplay();
}

function setOperator(op) {
    if (displayValue === "Error") return;

    if (waitingForSecondNumber && !justCalculated) {
        operator = op; 
        return;
    }


    if (firstNumber !== null && !waitingForSecondNumber) {
        calculate();
        if (displayValue === "Error") return;
    }


    if (firstNumber === null || !waitingForSecondNumber) { 
         if (displayValue !== "Error") {
            firstNumber = parseFloat(displayValue);
         } else {
            return; 
         }
    }


    operator = op;
    waitingForSecondNumber = true;
    justCalculated = false; 
}


function calculate() {

    if (firstNumber === null || operator === null || waitingForSecondNumber || displayValue === "Error") {
        return;
    }

    secondNumber = parseFloat(displayValue);
    let result;

    // Calculation
    switch (operator) {
        case "+": result = add(firstNumber, secondNumber); break;
        case "-": result = subtract(firstNumber, secondNumber); break;
        case "*": result = multiply(firstNumber, secondNumber); break;
        case "/":
            if (secondNumber === 0) {
                result = "Error"; 
            } else {
                result = divide(firstNumber, secondNumber);
            }
            break;
        default:
            console.error("Unknown operator:", operator);
            return;
    }

    // Result
    if (result === "Error") {
        displayValue = "Error";
        firstNumber = null; secondNumber = null; operator = null; waitingForSecondNumber = false;
        justCalculated = true; 
    } else {

        if (typeof result === "number" && result % 1 !== 0) {
            result = parseFloat(result.toFixed(2));
        }
        displayValue = result.toString();
        firstNumber = result;
        secondNumber = null;
        operator = null;    
        waitingForSecondNumber = true;
        justCalculated = true;
    }
    updateDisplay();
}


function clearDisplay() {
    displayValue = "0";
    firstNumber = null;
    secondNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    justCalculated = false; 
    updateDisplay();
}

function backspace() {

    if (displayValue === "Error" || justCalculated || waitingForSecondNumber) {
        return; 
    }

    if (displayValue.length === 1) {
        displayValue = "0"; 
    } else {
        displayValue = displayValue.slice(0, -1);
    }
    if (displayValue === "-") {
        displayValue = "0";
    }

    updateDisplay();
}

const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;

document.addEventListener("keydown", function(event) {
    let key = event.key;
    const code = event.code;

    let mappedKey = null; 
    let isOperator = false; 

    if (/^[0-9]$/.test(key)) { mappedKey = key; }
    else if (code.startsWith("Numpad") && /^[0-9]$/.test(code.slice(6))) { mappedKey = code.slice(6); }
    else if (key === "." || code === "NumpadDecimal") { mappedKey = "."; }
    else if (["+", "-", "*", "/"].includes(key)) { mappedKey = key; isOperator = true; }
    else if (code === "NumpadAdd") { mappedKey = "+"; isOperator = true; }
    else if (code === "NumpadSubtract") { mappedKey = "-"; isOperator = true; }
    else if (code === "NumpadMultiply") { mappedKey = "*"; isOperator = true; }
    else if (code === "NumpadDivide") { mappedKey = "/"; isOperator = true; }
    else if (key === "Enter" || key === "=" || code === "NumpadEnter") { mappedKey = "="; }
    else if (key === "Backspace") { mappedKey = "Backspace"; }
    else if (key === "Escape" || key.toLowerCase() === 'c') { mappedKey = "Clear"; }

    if (mappedKey !== null) {
        event.preventDefault();

        if (mappedKey === ".") {
            appendDecimal();
        } else if (isOperator) {
            setOperator(mappedKey);
        } else if (mappedKey === "=") {
            calculate();
        } else if (mappedKey === "Backspace") {
            backspace();
        } else if (mappedKey === "Clear") {
            clearDisplay();
        } else {
            // Otherwise, assume it's a digit
            appendToDisplay(mappedKey);
        }
    }
});

updateDisplay();