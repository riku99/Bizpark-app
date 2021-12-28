import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useTheme, useColorModeValue } from "native-base";

type Props = {
  children: JSX.Element;
};

// ColorModeの変更でここも再レンダリングされるのでパフォーマンス悪くなるかも
export const NavigationProvider = ({ children }: Props) => {
  const { colors } = useTheme();

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: useColorModeValue(colors.textBlack, colors.textWhite),
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {children}
    </NavigationContainer>
  );
};
