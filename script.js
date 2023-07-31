// Global variables
let dataPoints = []; // Array to store the data points (x, y pairs)
let regressionLine = null; // Store the regression line coordinates
let regressionCoefficients = null; // Store the regression coefficients
let degree =1;

const xRange = 20;
const yRange = 16;

// Get canvas element and context
const canvas = document.getElementById('plotCanvas');
const ctx = canvas.getContext('2d');

function powersOfX(x, d) {
  const powers = [];
  for (let i = 0; i <= d; i++) {
    powers.push(Math.pow(x, i));
  }
  return powers;
}

function calculatePolynomialRegression() {
  if (dataPoints.length <= degree) {
    regressionCoefficients = null; // Not enough data points for regression
    return;
  }

  // Create matrices for the independent variables (X) and the dependent variable (Y)
  const X = dataPoints.map((point) => powersOfX(point.x, degree)); // Add 1 as the first column for the intercept term
  const Y = dataPoints.map((point) => [point.y]);

  // Calculate the regression coefficients using matrix operations
  const XTranspose = math.transpose(X);
  const XtX = math.multiply(XTranspose, X);
  const XtXInverse = math.inv(XtX);
  const XtY = math.multiply(XTranspose, Y);
  regressionCoefficients = math.multiply(XtXInverse, XtY);
}


// Function to plot a polynomial regression on the canvas given the coefficients
function plotPolynomialRegression(coefficients) {
  if (!coefficients || coefficients.length !== degree + 1) {
    return; // Invalid coefficients or degree
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate the start and end points of the polynomial regression line to reach the ends of the canvas
  const minX = - xRange / 2;
  const maxX = xRange / 2;
  const step = (maxX - minX) / canvasWidth;

  ctx.lineWidth = 1.2;
  ctx.strokeStyle = 'green';
  ctx.beginPath();
  for (let x = minX; x <= maxX; x += step) {
    const y = coefficients.reduce((acc, coef, index) => acc + coef * Math.pow(x, index), 0);
    const canvasX = xValueToPixel(x);
    const canvasY = canvasHeight - yValueToPixel(y); // Invert the y-coordinate for the canvas
    if (x === minX) {
      ctx.moveTo(canvasX, canvasY);
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  ctx.stroke();
  ctx.closePath();
}

// Function to draw axis labels and ticks
function drawAxisLabelsAndTicks() {
  const canvas = document.getElementById('plotCanvas');
  const ctx = canvas.getContext('2d');
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const minX = 0; // X-axis starts at 0
  const maxX = canvasWidth;
  const minY = 0; // Y-axis starts at 0
  const maxY = canvasHeight;

  // Draw X-axis labels and ticks
  const xTicksCount = xRange / 2;
  const xTickInterval = (maxX - minX) / xTicksCount;
  for (let i = 1; i <= xTicksCount; i++) {
    const xValue = i * xTickInterval;
    const xPixel = xValue; // Leave some space for labels
    ctx.beginPath();
    if (i === 5) {
      ctx.lineWidth = 1;
    } else {
      ctx.lineWidth = 0.5;
    }
    ctx.strokeStyle = "gray";
    ctx.moveTo(xPixel, 0);
    ctx.lineTo(xPixel, parseInt(canvasHeight));
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText(- xTicksCount + 2*i, xPixel + 5, parseInt(canvasHeight) - 5);
  }

  // Draw Y-axis labels and ticks
  const yTicksCount = yRange / 2;
  const yTickInterval = maxY / yTicksCount;
  for (let i = 1; i <= yTicksCount; i++) {
    const yValue = i * yTickInterval;
    const yPixel = canvasHeight - yValue; // Leave some space for labels
    ctx.beginPath();
    ctx.beginPath();
    if (i === 4) {
      ctx.lineWidth = 1;
    } else {
      ctx.lineWidth = 0.5;
    }
    ctx.strokeStyle = "gray";
    ctx.moveTo(0, yPixel);
    ctx.lineTo(canvasWidth, yPixel);
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fillText(2 * i - yTicksCount, 5, yPixel - 5); // Adjust the y position for better visibility
  }
}

// Function to update the plot
function updatePlot() {
  const canvas = document.getElementById('plotCanvas');
  const canvasHeight = canvas.height;
  const ctx = canvas.getContext('2d');

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw axis labels and ticks
  drawAxisLabelsAndTicks();

  // Draw data points
  dataPoints.forEach((point) => {
    const canvasX = xValueToPixel(point.x);
    const canvasY = canvasHeight - yValueToPixel(point.y);
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });

  // Draw regression line (if available)
  if (regressionCoefficients) {
    plotPolynomialRegression(regressionCoefficients);
  }
}

function xPixelToValue(x) {
  const canvas = document.getElementById('plotCanvas');
  const canvasWidth = canvas.width;
  
  return (x - (canvasWidth / 2)) / (canvasWidth / xRange);
}

function yPixelToValue(y) {
  const canvas = document.getElementById('plotCanvas');
  const canvasHeight = canvas.height;
  
  return (y - (canvasHeight / 2)) / (canvasHeight / yRange);
}

function xValueToPixel(x) {
  const canvas = document.getElementById('plotCanvas');
  const canvasWidth = canvas.width;
  
  return ((canvasWidth / xRange) * x) + (canvasWidth / 2);
}

function yValueToPixel(y) {
  const canvas = document.getElementById('plotCanvas');
  const canvasHeight = canvas.height;

  return ((canvasHeight / yRange) * y) + (canvasHeight / 2);
}

function floatToLatex(float) {
  let coeffString = float.toString();
  if (coeffString.indexOf('e') >= 0) {
    const [coefficient, exponent] = coeffString.split("e");
    // Format the LaTeX representation
    const latexRepresentation = `${coefficient} \\times 10^{${exponent}}`;
    return latexRepresentation;
  } else {
    return coeffString;
  }
}

function displayCoefficient(coeff, index) {
  let roundCoeff = coeff[0].toPrecision(3);
  let latexString = floatToLatex(roundCoeff);
  
  if (index === 0) {
    return `${latexString}`;
  } else if (index === 1) {
    let sign = roundCoeff >= 0 ? `+` : ``;
    return `${sign}${latexString}x`;
  } else {
    let sign = roundCoeff >= 0 ? `+` : ``;
    return `${sign}${latexString}x^{${index}}`;
  }
}

// Function to update the coefficients display
function updateCoefficientsDisplay(coefficients) {
  if (coefficients) {
    const coefficientsValue = document.getElementById('coefficientsValue');
    const equationString = coefficients
      .map((coeff, index) => displayCoefficient(coeff, index))
      .join('');

    coefficientsValue.innerHTML = `$$y = ${equationString}$$`;
    MathJax.typeset();
  }
}

// Function to handle polynomial regression button click
function handlePolynomialRegression() {
  degreeInput = document.getElementById('degreeInput');
  degree = parseInt(degreeInput.value, 10);
  calculatePolynomialRegression();
  updateCoefficientsDisplay(regressionCoefficients);
  updatePlot();
}

// Add event listener for polynomial regression button click
document.getElementById('runPolynomialBtn').addEventListener('click', handlePolynomialRegression);

// Function to handle user clicks on the canvas
function handleCanvasClick(event) {
  // Get the mouse coordinates relative to the canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = rect.bottom - event.clientY;

  // Add the clicked point to the 'dataPoints' array
  dataPoints.push({ x: xPixelToValue(mouseX), y: yPixelToValue(mouseY) });

  // Recalculate and update the regression line
  calculatePolynomialRegression();

  // Update the plot
  updatePlot();
}

// Add event listener for canvas clicks
canvas.addEventListener('click', handleCanvasClick);

// Initialization function to set up the canvas and other elements
function init() {
  // Implement canvas setup and other initializations here
  // This function will be called when the page loads.
  drawAxisLabelsAndTicks();
}

// Call the initialization function when the page loads
window.onload = init;
