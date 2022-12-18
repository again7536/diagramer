import { ShapeState } from "../../../types";

interface LineProps extends ShapeState {}

const Line = (props: LineProps) => {
  return (
    <line
      id={props.id}
      x1={props.cur.p1.x}
      y1={props.cur.p1.y}
      x2={props.cur.p2.x}
      y2={props.cur.p2.y}
      class="shape"
      stroke="black"
      style={props.css}
    />
  );
};

export default Line;
