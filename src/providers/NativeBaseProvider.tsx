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
  },
  lt: {
    bg: "#FFFFFF",
  },
  pink: "#e68c8c",
  purple: "#4444ff",
  bluePurple: "#4a7dff",
  textBlack: "#333333",
  textWhite: "white",
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
