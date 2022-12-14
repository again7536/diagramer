import createPos from "../../hooks/createPos";
import { RectState } from "../../types";
import { For, Show } from "solid-js";

interface RectProps extends RectState {
  setState: (next: RectState) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const CIRCLE_POS = [
  [0, 0],
  [0.5, 0],
  [1, 0],
  [1, 0.5],
  [1, 1],
  [0.5, 1],
  [0, 1],
  [0, 0.5],
];

const Rect = (props: RectProps) => {
  const { pos, handleDragStart, handleDrag, handleDragStop } = createPos({
    x: props.x,
    y: props.y,
    setPos: (next) => props.setState({ ...props, ...next }),
  });

  return (
    <>
      <rect
        width={props.width}
        height={props.height}
        transform={`translate(${pos().x}, ${pos().y})`}
        onmousedown={(e) => {
          handleDragStart(e);
          props.onSelect(props.id);
        }}
        onmousemove={handleDrag}
        onmouseup={handleDragStop}
      />
      <Show when={props.isSelected}>
        <g transform={`translate(${pos().x}, ${pos().y})`}>
          <For each={Array.from({ length: 8 }, (v, i) => i)}>
            {(i) => (
              <circle
                cx={props.width * CIRCLE_POS[i][0]}
                cy={props.height * CIRCLE_POS[i][1]}
                r={3}
                fill="blue"
                stroke="skyblue"
                stroke-width={3}
              />
            )}
          </For>
        </g>
      </Show>
    </>
  );
};

export default Rect;
