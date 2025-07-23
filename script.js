let display = document.getElementById('display');
let expression = document.getElementById('expression');
let angleMode = document.getElementById('angleMode');
let memory = 0;
let isRadians = true;
let currentExpression = '';
let shouldResetDisplay = false;
let lastWasOperator = false;

function updateDisplay(value) {
    display.textContent = value;
}

function updateExpression(value) {
    expression.textContent = value;
}

function inputNumber(num) {
    if (shouldResetDisplay) {
        display.textContent = num;
        shouldResetDisplay = false;
    } else if (display.textContent === '0' || lastWasOperator) {
        display.textContent = num;
    } else {
        display.textContent += num;
    }
    lastWasOperator = false;
}
function inputDecimal() {
    if (shouldResetDisplay || lastWasOperator) {
        display.textContent = '0.';
        shouldResetDisplay = false;
        lastWasOperator = false;
    } else if (!display.textContent.includes('.')) {
        display.textContent += '.';
    }
}

function inputOperator(op) {
    if (op === '^') {
        if (currentExpression || display.textContent !== '0') {
            let base = currentExpression ? currentExpression + display.textContent : display.textContent;
            currentExpression = base + '**2';
            updateExpression(base + '²');
            shouldResetDisplay = true;
        }
    } else if (op === '!') {
        if (currentExpression || display.textContent !== '0') {
            let num = currentExpression ? currentExpression + display.textContent : display.textContent;
            currentExpression = 'factorial(' + num + ')';
            updateExpression(num + '!');
            shouldResetDisplay = true;
        }
    } else {
        if (currentExpression && !lastWasOperator) {
            currentExpression += display.textContent;
        } else if (!currentExpression && display.textContent !== '0') {
            currentExpression = display.textContent;
        }
        
        // Prevent consecutive operators
        if (!lastWasOperator || op === '(' || op === ')') {
            currentExpression += op;
            updateExpression(currentExpression.replace(/\*/g, '×').replace(/\*\*/g, '^'));
        }
    }
    lastWasOperator = (op !== '(' && op !== ')');
    shouldResetDisplay = (op !== '(' && op !== ')');
}
function inputFunction(func) {
    if (shouldResetDisplay || display.textContent === '0' || lastWasOperator) {
        display.textContent = '';
        currentExpression += func;
        updateExpression(currentExpression);
        shouldResetDisplay = false;
    } else {
        currentExpression += '*' + func;
        updateExpression(currentExpression.replace(/\*/g, '×').replace(/\*\*/g, '^') + func);
    }
    lastWasOperator = false;
}

function inputConstant(constant) {
    let value;
    if (constant === 'π') {
        value = Math.PI;
        if (shouldResetDisplay || display.textContent === '0' || lastWasOperator) {
            display.textContent = value.toFixed(8).replace(/\.?0+$/, '');
            shouldResetDisplay = false;
        } else {
            currentExpression += display.textContent + '*';
            display.textContent = value.toFixed(8).replace(/\.?0+$/, '');
        }
    } else if (constant === 'e') {
        value = Math.E;
        if (shouldResetDisplay || display.textContent === '0' || lastWasOperator) {
            display.textContent = value.toFixed(8).replace(/\.?0+$/, '');
            shouldResetDisplay = false;
        } else {
            currentExpression += display.textContent + '*';
            display.textContent = value.toFixed(8).replace(/\.?0+$/, '');
        }
    }
    lastWasOperator = false;
}
function clearAll() {
    display.textContent = '0';
    expression.textContent = '';
    currentExpression = '';
    shouldResetDisplay = false;
    lastWasOperator = false;
}

function clearEntry() {
    display.textContent = '0';
    shouldResetDisplay = false;
    lastWasOperator = false;
}

function deleteLast() {
    if (display.textContent.length > 1) {
        display.textContent = display.textContent.slice(0, -1);
    } else {
        display.textContent = '0';
    }
    lastWasOperator = false;
}