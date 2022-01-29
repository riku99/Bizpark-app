import React, { useState, ComponentProps } from "react";
import { Bubble, IMessage } from "react-native-gifted-chat";
import { Tooltip } from "react-native-elements";
import { useColorModeValue, Text } from "native-base";

type Props = {
  setMessage: (im: IMessage) => void;
} & ComponentProps<typeof Bubble>;

export const CustomBubble = ({ setMessage, ...props }: Props) => {
  const bubbleRight = useColorModeValue("#4463ff", "#4444ff");
  const bubbleLeft = useColorModeValue("#e0e0e0", "#525252");

  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: { backgroundColor: bubbleLeft, paddingVertical: 4 },
        right: { backgroundColor: bubbleRight, paddingVertical: 4 },
      }}
      onLongPress={() => {
        setMessage(props.currentMessage);
      }}
    />
  );
};
