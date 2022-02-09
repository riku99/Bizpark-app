import React, { ComponentProps } from "react";
import { Pressable, Text } from "native-base";

type Props = {} & ComponentProps<typeof Pressable>;

export const SendMessageButton = ({ ...props }: Props) => {
  return (
    <Pressable bg="red" px="2" py="1" borderRadius="2xl" {...props}>
      <Text fontWeight="bold" fontSize="13">
        メッセージを送る
      </Text>
    </Pressable>
  );
};
