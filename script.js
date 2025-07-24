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
function changeSign() {
    if (display.textContent !== '0') {
        if (display.textContent.startsWith('-')) {
            display.textContent = display.textContent.substring(1);
        } else {
            display.textContent = '-' + display.textContent;
        }
    }
    lastWasOperator = false;
}

function toggleAngleMode() {
    isRadians = !isRadians;
    angleMode.textContent = isRadians ? 'RAD' : 'DEG';
}

function memoryStore() {
    memory = parseFloat(display.textContent) || 0;
}

function memoryRecall() {
    display.textContent = memory.toString();
    shouldResetDisplay = true;
    lastWasOperator = false;
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function calculate() {
    try {
        let expr = currentExpression;
        
        // Add the current display value if we have one
        if (display.textContent && display.textContent !== '' && display.textContent !== 'Error') {
            if (!lastWasOperator && currentExpression) {
                expr += display.textContent;
            } else if (!currentExpression) {
                expr = display.textContent;
            }
        }
        
        // If expression ends with an incomplete function, complete it with display value
        if (expr.match(/(sin|cos|tan|asin|acos|atan|log|ln|sqrt|exp|factorial)\($/)) {
            expr += display.textContent + ')';
        }
        
        // Handle special cases and clean up expression
        expr = expr.replace(/×/g, '*');
        expr = expr.replace(/÷/g, '/');
        
        // Handle angle conversions for trig functions
        if (!isRadians) {
            expr = expr.replace(/sin\(/g, 'Math.sin(toRadians(');
            expr = expr.replace(/cos\(/g, 'Math.cos(toRadians(');
            expr = expr.replace(/tan\(/g, 'Math.tan(toRadians(');
            expr = expr.replace(/asin\(/g, 'toDegrees(Math.asin(');
            expr = expr.replace(/acos\(/g, 'toDegrees(Math.acos(');
            expr = expr.replace(/atan\(/g, 'toDegrees(Math.atan(');
            
            // Fix parentheses for degree mode
            expr = expr.replace(/Math\.sin\(toRadians\(([^)]+)\)\)/g, (match, content) => {
                let parenCount = 0;
                let endIndex = 0;
                for (let i = 0; i < content.length; i++) {
                    if (content[i] === '(') parenCount++;
                    if (content[i] === ')') parenCount--;
                    if (parenCount === 0) {
                        endIndex = i;
                        break;
                    }
                }
                return 'Math.sin(toRadians(' + content + '))';
            });
            
            expr = expr.replace(/Math\.cos\(toRadians\(([^)]+)\)\)/g, (match, content) => {
                return 'Math.cos(toRadians(' + content + '))';
            });
            
            expr = expr.replace(/Math\.tan\(toRadians\(([^)]+)\)\)/g, (match, content) => {
                return 'Math.tan(toRadians(' + content + '))';
            });
        } else {
            expr = expr.replace(/sin\(/g, 'Math.sin(');
            expr = expr.replace(/cos\(/g, 'Math.cos(');
            expr = expr.replace(/tan\(/g, 'Math.tan(');
            expr = expr.replace(/asin\(/g, 'Math.asin(');
            expr = expr.replace(/acos\(/g, 'Math.acos(');
            expr = expr.replace(/atan\(/g, 'Math.atan(');
        }
        
        // Handle other functions
        expr = expr.replace(/log\(/g, 'Math.log10(');
        expr = expr.replace(/ln\(/g, 'Math.log(');
        expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
        expr = expr.replace(/exp\(/g, 'Math.exp(');
        expr = expr.replace(/factorial\(/g, 'factorial(');
        expr = expr.replace(/mod/g, '%');
        
        console.log('Expression to evaluate:', expr); // Debug log
        
        let result = eval(expr);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        // Format the result
        if (Math.abs(result) < 0.0000001 && result !== 0) {
            result = parseFloat(result.toExponential(6));
        } else if (Math.abs(result) > 999999999) {
            result = parseFloat(result.toExponential(6));
        } else {
            result = parseFloat(result.toPrecision(12));
        }
        
        display.textContent = result.toString();
        expression.textContent = '';
        currentExpression = '';
        shouldResetDisplay = true;
        lastWasOperator = false;
        
    } catch (error) {
        console.error('Calculation error:', error); // Debug log
        display.textContent = 'Error';
        expression.textContent = '';
        currentExpression = '';
        shouldResetDisplay = true;
        lastWasOperator = false;
    }
}
