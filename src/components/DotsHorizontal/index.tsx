import React, { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorModeValue, useTheme } from "native-base";

type Props = {} & Partial<ComponentProps<typeof MaterialCommunityIcons>>;

export const DotsHorizontal = ({ ...props }: Props) => {
  const { colors } = useTheme();
  const iconColor = useColorModeValue(colors.textBlack, colors.textWhite);

  return (
    <MaterialCommunityIcons
      name="dots-horizontal"
      color={iconColor}
      size={24}
      {...props}
    />
  );
};
