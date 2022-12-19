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
  pointAdd,
  pointMul,
  pointSub,
} from "../../utils";

interface DragStartDimension {
  x: number;
  y: number;
}

const SVG_SIZE = { x: 600, y: 600 };

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
    confirmShapes,
    resizeShapes,
    moveShapes,
  } = useStore().shape;
  const [isPan, setPan] = createSignal<boolean>(true);
  const [isDrag, setDrag] = createSignal<boolean>(false);
  const [viewBox, setViewBox] = createSignal<{ prev: Area; cur: Area }>({
    cur: { p1: { x: 0, y: 0 }, p2: SVG_SIZE },
    prev: { p1: { x: 0, y: 0 }, p2: SVG_SIZE },
  });
  const [selectorDim, setSelectorDim] = createSignal<Area>({
    p1: { x: 0, y: 0 },
    p2: { x: 0, y: 0 },
  });
  const [startDim, setStartDim] = createSignal<DragStartDimension>({
    x: 0,
    y: 0,
  });

  const scale = () => SVG_SIZE.x / getWidthHeight(viewBox().cur).w;

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const diff = {
      x: getWidthHeight(viewBox().cur).w * Math.sign(e.deltaY) * 0.05,
      y: getWidthHeight(viewBox().cur).h * Math.sign(e.deltaY) * 0.05,
    };
    const ratio = {
      x: e.offsetX / SVG_SIZE.x,
      y: e.offsetY / SVG_SIZE.y,
    };
    const nextViewBox = {
      p1: pointAdd({
        p1: viewBox().cur.p1,
        p2: pointMul({ p1: diff, p2: ratio }),
      }),
      p2: pointSub({
        p1: viewBox().cur.p2,
        p2: pointMul({
          p1: diff,
          p2: pointSub({ p1: { x: 1, y: 1 }, p2: ratio }),
        }),
      }),
    };
    setViewBox({ cur: nextViewBox, prev: nextViewBox });
  };

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
    const diff = {
      x: (e.clientX - startDim().x) / scale(),
      y: (e.clientY - startDim().y) / scale(),
    };

    if ($selectedElem === svgRef) {
      if (isPan()) {
        setViewBox({
          ...viewBox(),
          cur: {
            p1: pointAdd({ p1: viewBox().prev.p1, p2: diff }),
            p2: pointAdd({ p1: viewBox().prev.p2, p2: diff }),
          },
        });
        return;
      }
      const boundingRect = svgRef?.getBoundingClientRect() as DOMRect;
      setSelectorDim({
        ...calcShapeResize({
          p1: pointSub({ p1: startDim(), p2: boundingRect }),
          p2: pointSub({ p1: startDim(), p2: boundingRect }),
          diff,
          dir: { p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } },
        }),
      });
    }
    if ($selectedElem.classList[0]?.startsWith("resizer")) resizeShapes(diff);
    if ($selectedElem.classList[0] === "shape") moveShapes(diff);
  };

  const handleMouseUp = (e: MouseEvent) => {
    const $selected = selectedElem() as SVGElement;
    setDrag(false);

    if ($selected === svgRef) {
      if (isPan()) setViewBox({ ...viewBox(), prev: viewBox().cur });

      const filtered = shapeStates
        .filter((state) => {
          const { x: cx, y: cy } = getCenterPoint(state.cur);
          if (
            cx > selectorDim().p1.x &&
            cx < selectorDim().p2.x &&
            cy > selectorDim().p1.y &&
            cy < selectorDim().p2.y
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
    confirmShapes();
  };

  return (
    <svg
      ref={svgRef}
      width={SVG_SIZE.x}
      height={SVG_SIZE.y}
      viewBox={`${viewBox().cur.p1.x} ${viewBox().cur.p1.y} ${
        getWidthHeight(viewBox().cur).w
      } ${getWidthHeight(viewBox().cur).h}`}
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUp}
      onWheel={handleWheel}
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
              <LineResizer
                {...(getShapeState(id) as ShapeState)}
                scale={scale()}
              />
            </Match>
            <Match when={getShapeState(id)?.type !== "line"}>
              <Resizer {...(getShapeState(id) as ShapeState)} scale={scale()} />
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
