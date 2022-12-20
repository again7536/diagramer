import { JSX } from "solid-js/jsx-runtime";
import { StyledInput } from "./Input.style";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps) => {
  return <StyledInput {...props}></StyledInput>;
};

export default Input;
