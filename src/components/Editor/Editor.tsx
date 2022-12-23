import { createMemo, createSignal, For, Match, Show, Switch } from "solid-js";
import Resizer from "../Resizer/Resizer";
import { useStore } from "../../storage";
import { Area, ShapeState } from "../../types";
import LineResizer from "../Resizer/LineResizer/LineResizer";
import { TREE_ROOT_ID } from "../../constants";
import {
  calcShapeResize,
  getCenterPoint,
  getPointsFromMatrix,
  getWidthHeight,
  isPointInArea,
  pointSub,
  scaleByOffset,
} from "../../utils";
import Renderer from "./Renderer/Renderer";
import {
  applyToPoint,
  compose,
  identity,
  Matrix,
  translate,
} from "transformation-matrix";

interface DragStartDimension {
  x: number;
  y: number;
}

interface ViewBox {
  prev: Matrix;
  cur: Matrix;
}

const SVG_SIZE = { x: 600, y: 600 };
const SCALE_CONST = 0.03;
const TRANSLATE_CONST = 0.2;

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
  const [isDrag, setDrag] = createSignal<boolean>(false);
  const [viewBox, setViewBox] = createSignal<Matrix>(identity());
  const [selectorDim, setSelectorDim] = createSignal<Area>({
    p1: { x: 0, y: 0 },
    p2: { x: 0, y: 0 },
  });
  const [startDim, setStartDim] = createSignal<DragStartDimension>({
    x: 0,
    y: 0,
  });

  const viewBoxScale = createMemo(
    () => 2 / getWidthHeight(getPointsFromMatrix(viewBox())).w
  );
  const viewBoxPoint = createMemo(() => ({
    p1: applyToPoint(viewBox(), { x: 0, y: 0 }),
    p2: applyToPoint(viewBox(), SVG_SIZE),
  }));

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    const widthHeight = getWidthHeight(getPointsFromMatrix(viewBox()));
    if (e.ctrlKey)
      setViewBox(
        scaleByOffset({
          mat: viewBox(),
          sx: widthHeight.w * Math.sign(e.deltaY) * SCALE_CONST,
          sy: widthHeight.h * Math.sign(e.deltaY) * SCALE_CONST,
          cx: (widthHeight.w * e.offsetX) / SVG_SIZE.x,
          cy: (widthHeight.h * e.offsetY) / SVG_SIZE.y,
        })
      );
    else
      setViewBox(
        compose(
          translate(
            widthHeight.w * e.deltaX * TRANSLATE_CONST,
            widthHeight.h * e.deltaY * TRANSLATE_CONST
          ),
          viewBox()
        )
      );
  };

  const handleMouseDown = (e: MouseEvent) => {
    const $target = e.target as SVGElement;
    if ($target.classList[0] === "shape") setSelectedShapeIds([$target.id]);
    setDrag(true);
    setSelectedElem($target);
    setStartDim({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrag() || !selectedElem()) return;
    const $selectedElem = selectedElem() as SVGElement;
    const diff = {
      x: (e.clientX - startDim().x) / viewBoxScale(),
      y: (e.clientY - startDim().y) / viewBoxScale(),
    };

    if ($selectedElem === svgRef) {
      const boundingRect = svgRef?.getBoundingClientRect() as DOMRect;
      setSelectorDim({
        ...calcShapeResize({
          p1: applyToPoint(
            viewBox(),
            pointSub({
              p1: startDim(),
              p2: { x: boundingRect.left, y: boundingRect.top },
            })
          ),
          p2: applyToPoint(
            viewBox(),
            pointSub({
              p1: startDim(),
              p2: { x: boundingRect.left, y: boundingRect.top },
            })
          ),
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
      const filtered = shapeStates
        .filter((state) =>
          isPointInArea(
            getCenterPoint(getPointsFromMatrix(state.cur)),
            selectorDim()
          )
        )
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
      viewBox={`${viewBoxPoint().p1.x} ${viewBoxPoint().p1.y} ${
        getWidthHeight(viewBoxPoint()).w
      } ${getWidthHeight(viewBoxPoint()).h}`}
      overflow="scroll"
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUp}
      onWheel={handleWheel}
      ontouchmove={console.log}
    >
      <Renderer parentId={TREE_ROOT_ID} getShapeState={getShapeState} />
      <For each={selectedShapeIds}>
        {(id) => (
          <Switch>
            <Match when={getShapeState(id).type === "line"}>
              <LineResizer
                {...(getShapeState(id) as ShapeState)}
                scale={viewBoxScale()}
              />
            </Match>
            <Match when={getShapeState(id).type !== "line"}>
              <Resizer
                {...(getShapeState(id) as ShapeState)}
                scale={viewBoxScale()}
              />
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
      <Show
        when={
          selectedShapeIds[0] &&
          getShapeState(selectedShapeIds[0]).type === "line"
        }
      >
        <path />
      </Show>
    </svg>
  );
};

export default Editor;
