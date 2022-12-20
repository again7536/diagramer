import { createSignal, JSXElement, Match, Show, Switch } from "solid-js";
import * as S from "./Drawer.style";

interface DrawerProps {
  header?: JSXElement;
  children: JSXElement | JSXElement[];
  ref?: HTMLDivElement;
}

const Drawer = (props: DrawerProps) => {
  const [open, setOpen] = createSignal<boolean>(false);
  const handleClickHeader = () => setOpen((prev) => !prev);
  return (
    <S.DrawerContainer ref={props.ref}>
      <Show when={props.header}>
        <S.DrawerHeader onclick={handleClickHeader}>
          <Switch>
            <Match when={open()}>
              <i class="fa-solid fa-caret-right" />
            </Match>
            <Match when={!open()}>
              <i class="fa-solid fa-caret-down" />
            </Match>
          </Switch>
          {props.header}
        </S.DrawerHeader>
      </Show>
      <S.ChildrenContainer>
        <Show when={open()}>{props.children}</Show>
      </S.ChildrenContainer>
    </S.DrawerContainer>
  );
};

export { Drawer };
