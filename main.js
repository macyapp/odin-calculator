// Get display element
const display = document.querySelector('[data-key="display"]');

// Initialize variables
let curVal = "0"; // Current value displayed
let firstVal = null; // First value in an operation
let op = null; // Current operator
let waitForSecondVal = false; // Flag to check if waiting for second value

// Handle digit input
function inputDigit(digit) {
  // If waiting for the second value, replace current value with digit
  if (waitForSecondVal) {
    curVal = digit;
    waitForSecondVal = false;
  } else {
    // Otherwise, append digit to current value or replace if it's zero
    curVal = curVal === "0" ? digit : curVal + digit;
  }
  // Limit display to 10 characters
  if (curVal.length > 10) {
    curVal = curVal.substring(0, 10);
  }
}

// Handle decimal input
function inputDecimal(dot) {
  // Add decimal point if it doesn't already exist
  if (!curVal.includes(dot)) {
    curVal += dot;
  } else {
    // Prevent multiple decimal points
    if (curVal[curVal.length - 1] === dot) {
      curVal = curVal.substring(0, curVal.length - 1);
    }
  }
}

// Clear calculator to initial state
function clearCalculator() {
  curVal = "0";
  firstVal = null;
  op = null;
  waitForSecondVal = false;
}

// Toggle sign of current value
function toggleSign() {
  curVal = (parseFloat(curVal) * -1).toString();
}

// Convert current value to percentage
function inputPercent() {
  curVal = (parseFloat(curVal) / 100).toString();
}

// Handle operator input
function handleOperator(nextOperator) {
  const inputValue = parseFloat(curVal);

  // If there's an operator and waiting for second value, update the operator
  if (op && waitForSecondVal) {
    op = nextOperator;
    return;
  }

  // If first value is null, store current input as first value
  if (firstVal === null) {
    firstVal = inputValue;
  } else if (op) {
    // If operator exists, perform calculation
    const result = calculate(firstVal, inputValue, op);
    curVal = `${parseFloat(result.toFixed(7))}`;
    firstVal = result;
  }

  // Set flag to wait for second value and update operator
  waitForSecondVal = true;
  op = nextOperator;
}

// Perform calculation based on operator
function calculate(first, second, operator) {
  switch (operator) {
    case "add":
      return first + second;
    case "subtract":
      return first - second;
    case "multiply":
      return first * second;
    case "divide":
      return first / second;
    default:
      return second;
  }
}

// Update display with current value
function updateDisplay() {
  display.textContent = curVal;
}

// Initialize display
updateDisplay();

// Get all calculator keys
const keys = document.querySelectorAll(".calculator div[data-key]");

// Add event listeners to keys
keys.forEach((key) => {
  // Add pressed class on mousedown
  key.addEventListener("mousedown", function (event) {
    event.target.classList.add("pressed");
  });

  // Handle key press on mouseup
  key.addEventListener("mouseup", function (event) {
    event.target.classList.remove("pressed");
    const { key: keyValue } = event.target.dataset;

    // Handle digit input
    if (!isNaN(keyValue)) {
      inputDigit(keyValue);
    } else if (keyValue === "decimal") {
      // Handle decimal input
      inputDecimal(".");
    } else if (keyValue === "clear") {
      // Handle clear action
      clearCalculator();
    } else if (keyValue === "toggle") {
      // Handle sign toggle
      toggleSign();
    } else if (keyValue === "percent") {
      // Handle percent conversion
      inputPercent();
    } else if (keyValue === "equals") {
      // Handle equals action, finalize calculation
      handleOperator(op);
      op = null;
      waitForSecondVal = true;
    } else {
      // Handle operator input
      handleOperator(keyValue);
    }

    // Update display with new value
    updateDisplay();
  });

  // Remove pressed class on mouseleave
  key.addEventListener("mouseleave", function (event) {
    event.target.classList.remove("pressed");
  });
});
