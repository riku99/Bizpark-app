import React, { ComponentProps } from "react";
import { Pressable, Text, useColorModeValue } from "native-base";

type Props = {} & ComponentProps<typeof Pressable>;

export const SendMessageButton = ({ ...props }: Props) => {
  const borderColor = useColorModeValue("textBlack", "textWhite");

  return (
    <Pressable
      px="2"
      py="1"
      borderRadius="2xl"
      borderWidth="1"
      borderColor={borderColor}
      {...props}
    >
      <Text fontWeight="bold" fontSize="13">
        メッセージを送る
      </Text>
    </Pressable>
  );
};
