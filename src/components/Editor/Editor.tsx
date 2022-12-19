import { createSignal, For, Index, Match, Show, Switch } from "solid-js";
import Rect from "../Shapes/Rect/Rect";
import Resizer from "../Resizer/Resizer";
import { useStore } from "../../storage";
import Line from "../Shapes/Line/Line";
import Ellipse from "../Shapes/Ellipse/Ellipse";
import { Area, ShapeState } from "../../types";
import LineResizer from "../Resizer/LineResizer/LineResizer";
import { SHAPE_TYPES } from "../../constants";
import {
  calcShapeResize,
  getCenterPoint,
  getWidthHeight,
  pointSub,
} from "../../utils";

interface DragStartDimension {
  x: number;
  y: number;
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
  const [selectorDim, setSelectorDim] = createSignal<Area>({
    p1: { x: 0, y: 0 },
    p2: { x: 0, y: 0 },
  });
  const [startDim, setStartDim] = createSignal<DragStartDimension>({
    x: 0,
    y: 0,
  });

  const handleMouseDown = (e: MouseEvent) => {
    const $target = e.target as SVGElement;
    if ($target.classList[0] === "shape") setSelectedShapeIds([$target.id]);
    setDrag(true);
    setSelectedElem($target);
    setStartDim({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrag() || !selectedElem()) return;
    const $selectedElem = selectedElem() as SVGElement;
    const diffX = e.clientX - startDim().x;
    const diffY = e.clientY - startDim().y;

    const boundingRect = svgRef?.getBoundingClientRect() as DOMRect;
    if ($selectedElem === svgRef)
      setSelectorDim({
        ...calcShapeResize({
          p1: pointSub({ p1: startDim(), p2: boundingRect }),
          p2: pointSub({ p1: startDim(), p2: boundingRect }),
          diff: { x: diffX, y: diffY },
          dir: { p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } },
        }),
      });
    if ($selectedElem.classList[0]?.startsWith("resizer"))
      resizeShapes({ x: diffX, y: diffY });
    if ($selectedElem.classList[0] === "shape")
      moveShapes({ x: diffX, y: diffY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    const $selected = selectedElem() as SVGElement;

    setDrag(false);

    if ($selected === svgRef) {
      const filtered = shapeStates
        .filter((state) => {
          const { x: cx, y: cy } = getCenterPoint(state.cur);
          if (
            cx > selectorDim().p1.x &&
            cx < selectorDim().p1.x + selectorDim().p2.x &&
            cy > selectorDim().p1.y &&
            cy < selectorDim().p1.y + selectorDim().p2.y
          )
            return state;
        })
        .map((f) => f.id);

      setSelectedElem(
        $selected.querySelector<SVGElement>(`[id='${filtered[0]}']`) ??
          undefined
      );
      setSelectedShapeIds(filtered);
      setSelectorDim({ p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 } });
      return;
    }

    selectedShapeIds.forEach((id) => {
      const state = getShapeState(id);
      if (!state) return;

      // confirm snapped line start
      Object.entries(state.snapped).forEach(([snapId, snapResizerIdx]) => {
        const snapState = getShapeState(snapId);
        if (!snapState) return;
        setShapeOf(snapId, {
          ...snapState,
          prev: {
            ...snapState.cur,
          },
        });
      });
      // confirm snapped line end

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
            <Match when={state().type === SHAPE_TYPES.RECT}>
              <Rect {...state()} />
            </Match>
            <Match when={state().type === SHAPE_TYPES.LINE}>
              <Line {...state()} />
            </Match>
            <Match when={state().type === SHAPE_TYPES.ELLIPSE}>
              <Ellipse {...state()} />
            </Match>
          </Switch>
        )}
      </Index>
      <For each={selectedShapeIds}>
        {(id) => (
          <Switch>
            <Match when={getShapeState(id)?.type === "line"}>
              <LineResizer {...(getShapeState(id) as ShapeState)} />
            </Match>
            <Match when={getShapeState(id)?.type !== "line"}>
              <Resizer {...(getShapeState(id) as ShapeState)} />
            </Match>
          </Switch>
        )}
      </For>
      <Show when={selectedElem() === svgRef}>
        <rect
          x={selectorDim().p1.x}
          y={selectorDim().p1.y}
          width={getWidthHeight(selectorDim()).w}
          height={getWidthHeight(selectorDim()).h}
          fill="#0000ff30"
        />
      </Show>
      <Show when={getShapeState(selectedShapeIds[0])?.type === "line"}>
        <path />
      </Show>
    </svg>
  );
};

export default Editor;
