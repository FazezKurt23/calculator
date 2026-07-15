// ====== Grab DOM elements ======
const previousOperandEl = document.getElementById('previous-operand');
const currentOperandEl = document.getElementById('current-operand');

const numberButtons = document.querySelectorAll('.number-btn');
const operatorButtons = document.querySelectorAll('.operator-btn');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const percentButton = document.getElementById('percent');

// ====== Calculator state ======
let currentOperand = '0';   // value currently being typed/displayed
let previousOperand = '';   // value stored before an operator was chosen
let operator = null;        // currently selected operator (+, -, ×, ÷)
let shouldResetScreen = false; // flag: next number input should start fresh (after =)

// ====== Update the display with current state ======
function updateDisplay() {
  currentOperandEl.textContent = currentOperand;
  previousOperandEl.textContent = operator
    ? `${previousOperand} ${operator}`
    : previousOperand;
}

// ====== Append a number or decimal point to current operand ======
function appendNumber(number) {
  // If we just pressed "=", typing a new number should start a fresh entry
  if (shouldResetScreen) {
    currentOperand = '';
    shouldResetScreen = false;
  }

  // Prevent multiple decimal points in one number
  if (number === '.' && currentOperand.includes('.')) return;

  // Replace a lone "0" with the new digit, otherwise append
  if (currentOperand === '0' && number !== '.') {
    currentOperand = number;
  } else {
    currentOperand += number;
  }
}

// ====== Choose an operator (+, -, ×, ÷) ======
function chooseOperator(op) {
  if (currentOperand === '' ) return; // nothing to operate on

  // If there's already a previous operand and operator, compute first
  // (this allows chaining: 5 + 3 + 2 = computes 5+3 before adding 2)
  if (previousOperand !== '' && operator) {
    compute();
  }

  operator = op;
  previousOperand = currentOperand;
  currentOperand = '';
  shouldResetScreen = false;
}

// ====== Perform the calculation based on selected operator ======
function compute() {
  let result;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  // Guard against incomplete input
  if (isNaN(prev) || isNaN(current)) return;

  // Easter egg: 1 + 1 shows a hidden message instead of the number 2
  if (operator === '+' && prev === 1 && current === 1) {
    currentOperand = 'I miss you';
    operator = null;
    previousOperand = '';
    return;
  }

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '×':
      result = prev * current;
      break;
    case '÷':
      // Handle divide-by-zero gracefully
      result = current === 0 ? 'Error' : prev / current;
      break;
    default:
      return;
  }

  // Round long decimals to avoid floating-point noise (e.g. 0.1 + 0.2)
  currentOperand = (typeof result === 'number')
    ? Math.round(result * 100000000) / 100000000
    : result;

  operator = null;
  previousOperand = '';
}

// ====== Clear everything (AC) ======
function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operator = null;
  shouldResetScreen = false;
}

// ====== Delete last character (DEL) ======
function deleteLast() {
  if (currentOperand.length === 1) {
    currentOperand = '0';
  } else {
    currentOperand = currentOperand.toString().slice(0, -1);
  }
}

// ====== Convert current value to a percentage ======
function applyPercent() {
  if (currentOperand === '') return;
  currentOperand = (parseFloat(currentOperand) / 100).toString();
}

// ====== Event listeners: numbers ======
numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    appendNumber(button.dataset.number);
    updateDisplay();
  });
});

// ====== Event listeners: operators ======
operatorButtons.forEach((button) => {
  button.addEventListener('click', () => {
    chooseOperator(button.dataset.operator);
    updateDisplay();
  });
});

// ====== Event listener: equals ======
equalsButton.addEventListener('click', () => {
  compute();
  shouldResetScreen = true; // next digit typed starts a new calculation
  updateDisplay();
});

// ====== Event listener: clear (AC) ======
clearButton.addEventListener('click', () => {
  clearAll();
  updateDisplay();
});

// ====== Event listener: delete (DEL) ======
deleteButton.addEventListener('click', () => {
  deleteLast();
  updateDisplay();
});

// ====== Event listener: percent (%) ======
percentButton.addEventListener('click', () => {
  applyPercent();
  updateDisplay();
});

// ====== Optional: keyboard support for convenience ======
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') appendNumber('.');
  else if (e.key === '+') chooseOperator('+');
  else if (e.key === '-') chooseOperator('-');
  else if (e.key === '*') chooseOperator('×');
  else if (e.key === '/') chooseOperator('÷');
  else if (e.key === 'Enter' || e.key === '=') { compute(); shouldResetScreen = true; }
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
  else return;

  updateDisplay();
});

// ====== Initial render ======
updateDisplay();