import { styled } from "solid-styled-components";

const MenuContainer = styled("div")`
  display: flex;
  flex-direction: column;

  height: 100%;

  background-color: ${({ theme }) => theme?.colors.background};
`;

const MenuSubheader = styled("h5")`
  font-size: ${({ theme }) => theme?.fonts.size[2]};
  color: ${({ theme }) => theme?.colors.black};
  margin: 5px;
  text-transform: uppercase;
`;

export { MenuContainer, MenuSubheader };
