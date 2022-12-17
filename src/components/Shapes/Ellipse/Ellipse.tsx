import { ShapeState } from "../../../types";

interface EllipseProps extends ShapeState {}

const Ellipse = (props: EllipseProps) => {
  return (
    <ellipse
      id={props.id}
      class="shape"
      style={props.css}
      cx={props.cur.x + props.cur.width / 2}
      cy={props.cur.y + props.cur.height / 2}
      rx={props.cur.width / 2}
      ry={props.cur.height / 2}
    />
  );
};

export default Ellipse;
