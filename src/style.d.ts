// import original module declarations
import "solid-styled-components";

// and extend them!
declare module "solid-styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      black: string;
      shadow: string;
      background: string;
    };
    fonts: {
      size: {
        1: string;
        2: string;
        3: string;
        4: string;
      };
    };
  }
}
