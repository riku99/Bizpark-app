import React, { ComponentProps } from 'react';
import { Box, HStack, Text, ScrollView } from 'native-base';
import { IMessage } from 'react-native-gifted-chat';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type Props = {
  replyMessage: IMessage | null;
  deleteReplyMessage: () => void;
} & ComponentProps<typeof HStack>;

export const ReplyMessage = ({
  replyMessage,
  deleteReplyMessage,
  ...props
}: Props) => {
  const { style, ...restProps } = props;

  if (!replyMessage) {
    return null;
  }

  return (
    <HStack
      alignItems="center"
      justifyContent="space-between"
      borderTopWidth="0.3"
      borderTopColor="lightGray"
      py="2"
      style={[styles.container, style]}
      {...restProps}
    >
      <Box w="84%">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text>{replyMessage.user.name}さんに返信</Text>
          <Text>{replyMessage.text}</Text>
        </ScrollView>
      </Box>

      {/* close */}
      <AntDesign
        name="close"
        size={22}
        color="gray"
        onPress={deleteReplyMessage}
      />
    </HStack>
  );
};

export const REPLY_MESSAGE_CONTAINER_HEIGHT = 60;

const styles = StyleSheet.create({
  container: {
    height: REPLY_MESSAGE_CONTAINER_HEIGHT,
  },
});
