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
import Rect from "../Shapes/Rect/Rect";
import Resizer from "../Resizer/Resizer";
import { CIRCLE_CONFIG } from "../../constants";
import { useStore } from "../../storage";
import Line from "../Shapes/Line/Line";
import Circle from "../Shapes/Circle/Circle";
import { calcShapeState } from "../../utils/calcShapeState";

interface DragPos {
  startX: number;
  startY: number;
  initX: number;
  initY: number;
  initWidth: number;
  initHeight: number;
}

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
    const shapeState = shapeStates[selectedShapeIdx()];

    setDrag(true);
    setSelected($target);
    setStartDim({
      startX: e.clientX,
      startY: e.clientY,
      initX: shapeState?.x ?? 0,
      initY: shapeState?.y ?? 0,
      initWidth: shapeState?.width ?? 0,
      initHeight: shapeState?.height ?? 0,
    });

    if ($target.classList[0] === "shape") setSelectedShape($target);
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
            <Match when={state().type === "circle"}>
              <Circle {...state()} />
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
