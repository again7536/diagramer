import { createSignal, For, Index, Match, Show, Switch } from "solid-js";
import Rect from "../Shapes/Rect/Rect";
import Resizer from "../Resizer/Resizer";
import {
  LINE_RESIZE_CIRCLE_CONFIG,
  RESIZE_CIRCLE_CONFIG,
} from "../../constants";
import { useStore } from "../../storage";
import Line from "../Shapes/Line/Line";
import Circle from "../Shapes/Circle/Circle";
import { calcShapeState } from "../../utils/calcShapeState";
import { Dimension } from "../../types";
import LineResizer from "../Resizer/LineResizer/LineResizer";

interface DragStartDimension {
  startX: number;
  startY: number;
}

const Editor = () => {
  let svgRef: SVGSVGElement | undefined;
  /*
    selectedShapeIds : most recently selected shape
    selectedElem: most recently selected "SVGElement"
  */
  const {
    shapeStates,
    selectedShapeIds,
    selectedElem,
    getShapeState,
    setSelectedShapeIds,
    setSelectedElem,
    setShapeOf,
    resizeShapes,
    moveShapes,
  } = useStore().shape;
  const [isDrag, setDrag] = createSignal<boolean>(false);
  const [selectorDim, setSelectorDim] = createSignal<Dimension>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [startDim, setStartDim] = createSignal<DragStartDimension>({
    startX: 0,
    startY: 0,
  });

  const handleMouseDown = (e: MouseEvent) => {
    const $target = e.target as SVGElement;
    if ($target.classList[0] === "shape") setSelectedShapeIds([$target.id]);
    setDrag(true);
    setSelectedElem($target);
    setStartDim({
      startX: e.clientX,
      startY: e.clientY,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrag() || !selectedElem()) return;
    const $selectedElem = selectedElem() as SVGElement;
    const diffX = e.clientX - startDim().startX;
    const diffY = e.clientY - startDim().startY;

    if ($selectedElem === svgRef) {
      setSelectorDim({
        width: diffX,
        height: diffY,
        x: startDim().startX - (svgRef?.getBoundingClientRect().left ?? 0),
        y: startDim().startY - (svgRef?.getBoundingClientRect().top ?? 0),
      });
      return;
    }
    if ($selectedElem.classList[0].startsWith("resizer"))
      resizeShapes({ diffX, diffY });
    if ($selectedElem.classList[0] === "shape") moveShapes({ diffX, diffY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    const $selected = selectedElem() as SVGElement;

    setDrag(false);

    if ($selected === svgRef) {
      const filtered = shapeStates
        .filter((state) => {
          const cx = state.cur.x + state.cur.width / 2;
          const cy = state.cur.y + state.cur.height / 2;
          if (
            cx > selectorDim().x &&
            cx < selectorDim().x + selectorDim().width &&
            cy > selectorDim().y &&
            cy < selectorDim().y + selectorDim().height
          )
            return state;
        })
        .map((f) => f.id);

      setSelectedElem(
        $selected.querySelector<SVGElement>(`[id='${filtered[0]}']`) ??
          undefined
      );
      setSelectedShapeIds(filtered);
      setSelectorDim({ width: 0, height: 0, x: 0, y: 0 });
      return;
    }

    selectedShapeIds.forEach((id) => {
      const state = getShapeState(id);
      setShapeOf(id, {
        ...state,
        prev: {
          ...state.cur,
        },
      });
    });
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
      <For each={selectedShapeIds}>
        {(id) => (
          <Switch>
            <Match when={getShapeState(id).type === "line"}>
              <LineResizer {...getShapeState(id)} />
            </Match>
            <Match when={getShapeState(id).type !== "line"}>
              <Resizer {...getShapeState(id)} />
            </Match>
          </Switch>
        )}
      </For>
      <Show when={selectedElem() === svgRef}>
        <rect {...selectorDim()} fill="#0000ff30" />
      </Show>
    </svg>
  );
};

export default Editor;
