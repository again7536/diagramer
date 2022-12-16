interface CalcShapeStateParams {
  diffX: number;
  diffY: number;
  initX: number;
  initY: number;
  initWidth: number;
  initHeight: number;
  dx: number;
  dy: number;
  dwidth: number;
  dheight: number;
}

const calcShapeState = ({
  diffX,
  diffY,
  initX,
  initY,
  initWidth,
  initHeight,
  dx,
  dy,
  dwidth,
  dheight,
}: CalcShapeStateParams) => {
  let x = dx * diffX + initX;
  let y = dy * diffY + initY;
  let width = dwidth * diffX + initWidth;
  let height = dheight * diffY + initHeight;
  if (width < 0) {
    width = -width;
    x = x - width;
  }
  if (height < 0) {
    height = -height;
    y = y - height;
  }
  return { x, y, width, height };
};

export { calcShapeState };
