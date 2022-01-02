import { NativeBaseProvider, extendTheme } from "native-base";
import React from "react";

type Props = {
  children: JSX.Element;
};

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

export const colors = {
  dt: {
    bg: "#1c1917",
    darkGray: "#292524",
  },
  lt: {
    bg: "#fff",
  },
  pink: "#ff937d",
  purple: "#4444ff",
  bluePurple: "#4a7dff",
  textBlack: "#333333",
  textWhite: "white",
  lightGray: "#c2c2c2",
};

const components = {
  Text: {
    baseStyle: ({ colorMode }) => ({
      color: colorMode === "dark" ? "textWhite" : "textBlack",
    }),
  },
  Button: {
    baseStyle: {
      rounded: "sm",
      _text: {
        color: "textWhite",
      },
    },
    defaultProps: {
      h: 10,
      bg: "pink",
      _pressed: {
        bg: "pink",
      },
    },
  },
};

const theme = extendTheme({
  colors,
  config,
  components,
});

type CustomThemeType = typeof theme;

declare module "native-base" {
  interface ICustomTheme extends CustomThemeType {}
}

export const NativeBaseThemeProvider = ({ children }: Props) => {
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>;
};
