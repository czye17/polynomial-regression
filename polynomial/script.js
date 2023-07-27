// Global variables
let dataPoints = []; // Array to store the data points (x, y pairs)
let regressionLine = null; // Store the regression line coordinates
let regressionCoefficients = null; // Store the regression coefficients
let degree =1;

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
  const minX = 0 //Math.min(...dataPoints.map((point) => point.x));
  const maxX = 600// Math.max(...dataPoints.map((point) => point.x));
  const step = (maxX - minX) / canvasWidth;

  ctx.strokeStyle = 'green';
  ctx.beginPath();
  for (let x = minX; x <= maxX; x += step) {
    const y = coefficients.reduce((acc, coef, index) => acc + coef * Math.pow(x, index), 0);
    const canvasX = x;
    const canvasY = y; // Invert the y-coordinate for the canvas
    if (x === minX) {
      ctx.moveTo(canvasX, canvasY);
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  ctx.stroke();
  ctx.closePath();
}


// Function to handle adding a new data point
function handleAddDataPoint() {
  const xInput = document.getElementById('xInput');
  const yInput = document.getElementById('yInput');
  const x = parseFloat(xInput.value);
  const y = parseFloat(yInput.value);
  if (!isNaN(x) && !isNaN(y)) {
    dataPoints.push({ x, y });
    xInput.value = '';
    yInput.value = '';
    updatePlot();
  }
}


// ... (other functions remain the same) ...

// Function to update the plot with data points and regression line
function updatePlot() {
  const canvas = document.getElementById('plotCanvas');
  const ctx = canvas.getContext('2d');

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the x and y axes
  const xAxisPosition = canvas.height - 10; // Leave some padding at the bottom
  const yAxisPosition = 10; // Leave some padding at the top
  const minX = 0;
  const maxX = 600;
  const minY = 0;
  const maxY = 400;




  // Draw data points
  for (const point of dataPoints) {
    const canvasX = point.x;
    const canvasY = point.y;
    //const canvasX = yAxisPosition + (point.x / (maxX - minX)) * canvas.width;
    //const canvasY = canvas.height - ((point.y - minY) / (maxY - minY)) * canvas.height;
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  // If we have valid coefficients from multivariate regression, plot regression line
  if (regressionCoefficients) {
    //const degree = regressionCoefficients.length - 1;
    plotPolynomialRegression(regressionCoefficients);
  }
}

// Rest of the code remains the same...



// Function to update the coefficients display
function updateCoefficientsDisplay(coefficients) {
  if (coefficients) {
    const coefficientsValue = document.getElementById('coefficientsValue');
    //const degree = coefficients.length - 1;
    const coefficientsString = coefficients
      .map((coefficients, index) => `Coefficient for x^${index}: ${coefficients}`)
      .join('<br>');
    coefficientsValue.innerHTML = `Degree: ${degree}<br>${coefficientsString}`;
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
  const mouseY = event.clientY - rect.top;

  // Add the clicked point to the 'dataPoints' array
  dataPoints.push({ x: mouseX, y: mouseY });

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
}

// Call the initialization function when the page loads
window.onload = init;
