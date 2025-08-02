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
    
    console.log('inputNumber called with:', num);
    console.log('display.textContent is now:', display.textContent);
    console.log('currentExpression is:', currentExpression);
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
        currentExpression += func + '(';
        updateExpression(currentExpression);
        display.textContent = '';
    } else {
        currentExpression += func + '(' + display.textContent + ')';
        updateExpression(currentExpression.replace(/\*/g, '×').replace(/\*\*/g, '^'));
        display.textContent = '';
    }
    shouldResetDisplay = false;
    lastWasOperator = false;
    
    console.log('inputFunction called with:', func);
    console.log('currentExpression is now:', currentExpression);
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
        
        if (display.textContent && display.textContent !== '' && display.textContent !== 'Error') {
            if (!lastWasOperator) {
                expr += display.textContent;
            } else if (!currentExpression) {
                expr = display.textContent;
            }
        }
        
        console.log('Expression before processing:', expr);
        
        if (!expr || expr.trim() === '') {
            return;
        }
        
        expr = expr.replace(/×/g, '*');
        expr = expr.replace(/÷/g, '/');
        
        let openParens = (expr.match(/\(/g) || []).length;
        let closeParens = (expr.match(/\)/g) || []).length;
        if (openParens > closeParens) {
            expr += ')'.repeat(openParens - closeParens);
        }
        
        console.log('Expression after balancing parentheses:', expr);
        
        if (!isRadians) {
            // Degree mode - convert input from degrees to radians for trig functions
            expr = expr.replace(/(sin|cos|tan)\(([^)]*)\)/g, function(match, func, arg) {
                return `Math.${func}(toRadians(${arg}))`;
            });
            // For inverse trig functions, convert output from radians to degrees
            expr = expr.replace(/(asin|acos|atan)\(([^)]*)\)/g, function(match, func, arg) {
                return `toDegrees(Math.${func}(${arg}))`;
            });
        } else {
            // Radian mode - use Math functions directly
            expr = expr.replace(/(sin|cos|tan|asin|acos|atan)\(/g, 'Math.$1(');
        }
        
        expr = expr.replace(/log\(/g, 'Math.log10(');
        expr = expr.replace(/ln\(/g, 'Math.log(');
        expr = expr.replace(/sqrt\(/g, 'Math.sqrt(');
        expr = expr.replace(/exp\(/g, 'Math.exp(');
        expr = expr.replace(/factorial\(/g, 'factorial(');
        expr = expr.replace(/mod/g, '%');
        
        console.log('Expression to evaluate:', expr);
        
        let result = eval(expr);
        
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
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
        console.error('Calculation error:', error);
        console.error('Final expression that failed:', expr);
        display.textContent = 'Error';
        expression.textContent = '';
        currentExpression = '';
        shouldResetDisplay = true;
        lastWasOperator = false;
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    event.preventDefault();
    
    if (key >= '0' && key <= '9') {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+') {
        inputOperator('+');
    } else if (key === '-') {
        inputOperator('-');
    } else if (key === '*') {
        inputOperator('*');
    } else if (key === '/') {
        inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '(') {
        inputOperator('(');
    } else if (key === ')') {
        inputOperator(')');
    }
});