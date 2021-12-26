import { NativeBaseProvider, extendTheme } from "native-base";
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
};

const theme = extendTheme({ colors, config });

type CustomThemeType = typeof theme;

declare module "native-base" {
  interface ICustomTheme extends CustomThemeType {}
}

export const NativeBaseThemeProvider = ({ children }: Props) => {
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>;
};
