import {
  createMemo,
  createSignal,
  For,
  Index,
  Match,
  Setter,
  Show,
  Switch,
} from "solid-js";
import Rect from "../Rect/Rect";
import Resizer from "../Resizer/Resizer";
import { CIRCLE_CONFIG } from "../../constants";
import { useStore } from "../../storage";
import Line from "../Line/Line";

interface DragPos {
  startX: number;
  startY: number;
  initX: number;
  initY: number;
  initWidth: number;
  initHeight: number;
}

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

const Editor = () => {
  let svgRef: SVGSVGElement | undefined;
  /*
    selectedShape : most recently selected shape
    selected: most recently selected "SVGElement"
  */
  const {
    shapeStates,
    selectedShape,
    selected,
    setSelectedShape,
    setSelected,
    setShapeOf,
  } = useStore().shape;
  const [isDrag, setDrag] = createSignal<boolean>(false);
  const [startDim, setStartDim] = createSignal<DragPos>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    initWidth: 0,
    initHeight: 0,
  });
  const selectedShapeIdx = createMemo(() =>
    shapeStates.findIndex((s) => s.id === selectedShape()?.id)
  );

  const handleMouseDown = (e: MouseEvent) => {
    const $target = e.target as SVGElement;

    setDrag(true);
    setSelected($target);
    if ($target.classList[0] === "shape") setSelectedShape($target);

    const shapeState = shapeStates[selectedShapeIdx()];
    setStartDim({
      startX: e.clientX,
      startY: e.clientY,
      initX: shapeState?.x ?? 0,
      initY: shapeState?.y ?? 0,
      initWidth: shapeState?.width ?? 0,
      initHeight: shapeState?.height ?? 0,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrag() || !selected()) return;
    const $selected = selected() as SVGElement;
    const diffX = e.clientX - startDim().startX;
    const diffY = e.clientY - startDim().startY;
    const selectedShapeState = shapeStates[selectedShapeIdx()];

    if ($selected.classList[0].startsWith("resizer")) {
      const resizerIdx = +$selected.classList[0].split("-")[1];
      setShapeOf(selectedShapeIdx(), {
        ...selectedShapeState,
        ...calcShapeState({
          ...startDim(),
          ...CIRCLE_CONFIG[resizerIdx].resize,
          diffX,
          diffY,
        }),
      });
      return;
    }

    if ($selected.classList[0] === "shape") {
      setShapeOf(selectedShapeIdx(), {
        ...selectedShapeState,
        x: diffX + startDim().initX,
        y: diffY + startDim().initY,
      });
      return;
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    setDrag(false);

    const $target = e.target as SVGElement;
    if ($target === svgRef) {
      setSelected(undefined);
      setSelectedShape(undefined);
    }
    if ($target.classList[0] === "shape") {
    }
  };

  return (
    <svg
      ref={svgRef}
      width="600"
      height="600"
      viewBox="0 0 600 600"
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUp}
    >
      <Index each={shapeStates}>
        {(state) => (
          <Switch>
            <Match when={state().type === "rect"}>
              <Rect {...state()} />
            </Match>
            <Match when={state().type === "line"}>
              <Line {...state()} />
            </Match>
          </Switch>
        )}
      </Index>
      <Show when={selectedShape()}>
        <Resizer {...shapeStates[selectedShapeIdx()]} />
      </Show>
    </svg>
  );
};

export default Editor;
