import React, { ComponentProps } from "react";
import { ActivityIndicator } from "react-native";
import { useColorMode } from "native-base";

type Props = ComponentProps<typeof ActivityIndicator>;

export const Indicator = ({ ...props }: Props) => {
  const { colorMode } = useColorMode();

  return (
    <ActivityIndicator
      color={colorMode === "dark" ? "white" : undefined}
      {...props}
    />
  );
};
