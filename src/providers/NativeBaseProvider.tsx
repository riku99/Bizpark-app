import { NativeBaseProvider, extendTheme } from "native-base";

type Props = {
  children: JSX.Element;
};

const colors = {
  primary: {
    900: "red",
  },
};

const theme = extendTheme({ colors });

export const NativeBaseThemeProvider = ({ children }: Props) => {
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>;
};
