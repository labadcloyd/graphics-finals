// Developed by Parker Manalaysay
function midpointEllipse(rx, ry, xc, yc) {
  const points = [];

  let x = 0;
  let y = ry;

  let rxSq = rx * rx;
  let rySq = ry * ry;
  let twoRxSq = 2 * rxSq;
  let twoRySq = 2 * rySq;

  let p1 = rySq - rxSq * ry + 0.25 * rxSq;
  let dx = twoRySq * x;
  let dy = twoRxSq * y;

  while (dx < dy) {
    plotEllipsePoints(points, xc, yc, x, y);

    if (p1 < 0) {
      x++;
      dx += twoRySq;
      p1 += dx + rySq;
    } else {
      x++;
      y--;
      dx += twoRySq;
      dy -= twoRxSq;
      p1 += dx - dy + rySq;
    }
  }

  let p2 =
    rySq * (x + 0.5) * (x + 0.5) + rxSq * (y - 1) * (y - 1) - rxSq * rySq;

  while (y >= 0) {
    plotEllipsePoints(points, xc, yc, x, y);

    if (p2 > 0) {
      y--;
      dy -= twoRxSq;
      p2 += rxSq - dy;
    } else {
      y--;
      x++;
      dx += twoRySq;
      dy -= twoRxSq;
      p2 += dx - dy + rxSq;
    }
  }

  return points;
}

function plotEllipsePoints(points, xc, yc, x, y) {
  points.push([xc + x, yc + y]);
  points.push([xc - x, yc + y]);
  points.push([xc + x, yc - y]);
  points.push([xc - x, yc - y]);
}

export default midpointEllipse;
