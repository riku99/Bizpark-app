import React, { ComponentProps } from "react";
import { Pressable } from "native-base";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  size: number;
  iconSize?: number;
} & ComponentProps<typeof Pressable>;

export const CloseButton = ({ size, ...props }: Props) => {
  const iconSize = props.iconSize ? props.iconSize : size * 3;

  return (
    <Pressable
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      h={size}
      w={size}
      bg="darkGray"
      {...props}
    >
      <AntDesign name="close" size={iconSize} color="white" />
    </Pressable>
  );
};
