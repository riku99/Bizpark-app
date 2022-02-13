import React, { ComponentProps } from 'react';
import { HStack, Box, Text, useColorModeValue } from 'native-base';
import { InputToolbar, IMessage } from 'react-native-gifted-chat';

type Props = {
  replyMessage: IMessage | null;
} & ComponentProps<typeof InputToolbar>;

export const CustomInput = ({ replyMessage, ...props }: Props) => {
  const inputContainerBg = useColorModeValue('#f0f0f0', '#292522');

  return (
    <>
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: inputContainerBg,
          borderTopWidth: 0,
          borderRadius: 20,
          width: '90%',
          marginLeft: 20,
        }}
      />
    </>
  );
};
