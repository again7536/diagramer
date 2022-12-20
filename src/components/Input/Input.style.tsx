import { styled } from "solid-styled-components";

const StyledInput = styled("input")`
  border: 2px solid ${({ theme }) => theme?.colors.shadow};
  outline: none;

  transition: 0.2s;
  &:focus {
    border: 2px solid ${({ theme }) => theme?.colors.primary};
  }
`;

export { StyledInput };
