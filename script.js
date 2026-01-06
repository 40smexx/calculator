const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let firstValue = null;
let operator = null;
let waitingForSecond = false;

function updateDisplay(value) {
  display.textContent = value.toString().slice(0, 12);
}

function clearAll() {
  updateDisplay("0");
  firstValue = null;
  operator = null;
  waitingForSecond = false;
}

function backspace() {
  if (waitingForSecond) return;
  display.textContent =
    display.textContent.length > 1
      ? display.textContent.slice(0, -1)
      : "0";
}

function inputNumber(num) {
  if (waitingForSecond) {
    updateDisplay(num);
    waitingForSecond = false;
    return;
  }
  updateDisplay(
    display.textContent === "0" ? num : display.textContent + num
  );
}

function inputDecimal() {
  if (!display.textContent.includes(".")) {
    updateDisplay(display.textContent + ".");
  }
}

function calculate(a, op, b) {
  a = Number(a);
  b = Number(b);
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? "💀 NOPE" : a / b;
}

function inputOperator(op) {
  if (operator && !waitingForSecond) {
    const result = calculate(firstValue, operator, display.textContent);
    updateDisplay(Math.round(result * 1000) / 1000);
    firstValue = display.textContent;
  } else {
    firstValue = display.textContent;
  }
  operator = op;
  waitingForSecond = true;
}

function handleEquals() {
  if (!operator || waitingForSecond) return;
  const result = calculate(firstValue, operator, display.textContent);
  updateDisplay(Math.round(result * 1000) / 1000);
  operator = null;
  waitingForSecond = true;
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const op = button.dataset.operator;
    const action = button.dataset.action;

    if (number) {
      number === "." ? inputDecimal() : inputNumber(number);
    }
    if (op) inputOperator(op);
    if (action === "equals") handleEquals();
    if (action === "clear") clearAll();
    if (action === "backspace") backspace();
  });
});

window.addEventListener("keydown", e => {
  if (e.key >= 0 && e.key <= 9) inputNumber(e.key);
  if (e.key === ".") inputDecimal();
  if (["+","-","*","/"].includes(e.key)) inputOperator(e.key);
  if (e.key === "Enter" || e.key === "=") handleEquals();
  if (e.key === "Backspace") backspace();
  if (e.key === "Escape") clearAll();
});
