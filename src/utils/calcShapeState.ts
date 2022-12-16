interface CalcShapeStateParams {
  diffX: number;
  diffY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  dwidth: number;
  dheight: number;
}

const calcShapeState = ({
  diffX,
  diffY,
  x,
  y,
  width,
  height,
  dx,
  dy,
  dwidth,
  dheight,
}: CalcShapeStateParams) => {
  let nextX = dx * diffX + x;
  let nextY = dy * diffY + y;
  let nextWidth = dwidth * diffX + width;
  let nextHeight = dheight * diffY + height;
  if (nextWidth < 0) {
    nextWidth = -nextWidth;
    nextX = nextX - nextWidth;
  }
  if (nextHeight < 0) {
    nextHeight = -nextHeight;
    nextY = nextY - nextHeight;
  }
  return { x: nextX, y: nextY, width: nextWidth, height: nextHeight };
};

export { calcShapeState };
