import { NativeBaseProvider, extendTheme } from "native-base";

type Props = {
  children: JSX.Element;
};

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

const colors = {
  primary: {
    900: "red",
  },
  dark: {
    500: "gray",
  },
};

const theme = extendTheme({ colors, config });

export const NativeBaseThemeProvider = ({ children }: Props) => {
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>;
};
