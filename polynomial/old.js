// Function to calculate the regression line
function calculateRegressionLine() {
  if (dataPoints.length < 2) {
    regressionLine = null; // Not enough data points for regression
    return;
  }

  // Calculate the mean of x and y values
  const sumX = dataPoints.reduce((acc, point) => acc + point.x, 0);
  const sumY = dataPoints.reduce((acc, point) => acc + point.y, 0);
  const meanX = sumX / dataPoints.length;
  const meanY = sumY / dataPoints.length;

  // Calculate the slope (m) and y-intercept (b) of the regression line
  let numerator = 0;
  let denominator = 0;
  for (const point of dataPoints) {
    numerator += (point.x - meanX) * (point.y - meanY);
    denominator += (point.x - meanX) ** 2;
  }
  const slope = numerator / denominator;
  const yIntercept = meanY - slope * meanX;

  // Calculate the start and end points of the regression line to reach the ends of the canvas
  const minX = Math.min(...dataPoints.map((point) => point.x));
  const maxX = Math.max(...dataPoints.map((point) => point.x));
  const minY = slope * minX + yIntercept;
  const maxY = slope * maxX + yIntercept;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Calculate the coordinates of the start and end points within the canvas
  const startX = 0;
  const endX = canvasWidth;
  const startY = maxY < 0 ? 0 : (maxY > canvasHeight ? canvasHeight : maxY);
  const endY = minY < 0 ? 0 : (minY > canvasHeight ? canvasHeight : minY);

  regressionLine = [{ x: startX, y: startY }, { x: endX, y: endY }];
}