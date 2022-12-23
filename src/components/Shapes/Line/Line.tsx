import { applyToPoint } from "transformation-matrix";
import { DIR } from "../../../constants";
import { ShapeState } from "../../../types";

interface LineProps extends ShapeState {}

const Line = (props: LineProps) => {
  return (
    <line
      id={props.id}
      x1={applyToPoint(props.cur, DIR.TOP_LEFT).x}
      y1={applyToPoint(props.cur, DIR.TOP_LEFT).y}
      x2={applyToPoint(props.cur, DIR.BOTTOM_RIGHT).x}
      y2={applyToPoint(props.cur, DIR.BOTTOM_RIGHT).y}
      class="shape"
      stroke="black"
      style={props.css}
    />
  );
};

export default Line;
