import React, { ComponentProps } from "react";
import { RefreshControl as R } from "react-native";
import { useColorModeValue, useTheme } from "native-base";

type Props = ComponentProps<typeof R>;

export const RefreshControl = ({ ...props }: Props) => {
  const { colors } = useTheme();
  return (
    <R tintColor={useColorModeValue(undefined, colors.lightGray)} {...props} />
  );
};
