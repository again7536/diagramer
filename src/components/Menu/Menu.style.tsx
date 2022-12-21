import { styled } from "solid-styled-components";

const MenuContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px 0;

  height: 100%;
  padding: 5px 10px;

  background-color: ${({ theme }) => theme?.colors.background};
`;

const MenuSubheader = styled("h5")`
  font-size: ${({ theme }) => theme?.fonts.size[2]};
  color: ${({ theme }) => theme?.colors.black};
  margin: 5px;
  text-transform: uppercase;
`;

export { MenuContainer, MenuSubheader };
