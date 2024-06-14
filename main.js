const display = document.querySelector('[data-key="display"]');
let currentValue = "0";
let firstValue = null;
let operator = null;
let waitForSecondValue = false;

function inputDigit(digit) {
  if (waitForSecondValue) {
    currentValue = digit;
    waitForSecondValue = false;
  } else {
    currentValue = currentValue === "0" ? digit : currentValue + digit;
  }
  if (currentValue.length > 10) {
    currentValue = currentValue.substring(0, 10);
  }
}

function inputDecimal(dot) {
  if (!currentValue.includes(dot)) {
    currentValue += dot;
  } else {
    if (currentValue[currentValue.length - 1] === dot)
      currentValue = currentValue.substring(0, currentValue.length - 1);
  }
}

function clear() {
  currentValue = "0";
  firstValue = null;
  operator = null;
  waitForSecondValue = false;
}

function toggleSign() {
  currentValue = (parseFloat(currentValue) * -1).toString();
}

function inputPercent() {
  currentValue = (parseFloat(currentValue) / 100).toString();
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentValue);

  if (operator && waitForSecondValue) {
    operator = nextOperator;
    return;
  }

  if (firstValue === null) {
    firstValue = inputValue;
  } else if (operator) {
    const result = calculate(firstValue, inputValue, operator);
    currentValue = `${parseFloat(result.toFixed(7))}`;
    firstValue = result;
  }

  waitForSecondValue = true;
  operator = nextOperator;
}

function calculate(first, second, operator) {
  if (operator === "add") {
    return first + second;
  } else if (operator === "subtract") {
    return first - second;
  } else if (operator === "multiply") {
    return first * second;
  } else if (operator === "divide") {
    return first / second;
  }

  return second;
}

function updateDisplay() {
  display.textContent = currentValue;
}

updateDisplay();

const keys = document.querySelectorAll(".calculator div[data-key]");
keys.forEach((key) => {
  key.addEventListener("mousedown", function (event) {
    event.target.classList.add("pressed");
  });

  key.addEventListener("mouseup", function (event) {
    event.target.classList.remove("pressed");
    const { key } = event.target.dataset;

    if (!isNaN(key)) {
      inputDigit(key);
    } else if (key === "decimal") {
      inputDecimal(".");
    } else if (key === "clear") {
      clear();
    } else if (key === "toggle") {
      toggleSign();
    } else if (key === "percent") {
      inputPercent();
    } else if (key === "equals") {
      handleOperator(operator);
      operator = null;
      waitForSecondValue = true;
    } else {
      handleOperator(key);
    }

    updateDisplay();
  });

  key.addEventListener("mouseleave", function (event) {
    event.target.classList.remove("pressed");
  });
});
