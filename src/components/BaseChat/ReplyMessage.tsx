import React from "react";
import { Box, HStack, Text } from "native-base";
import { IMessage } from "react-native-gifted-chat";
import { StyleSheet } from "react-native";

type Props = { replyMessage: IMessage | null };

export const ReplyMessage = ({ replyMessage }: Props) => {
  if (!replyMessage) {
    return null;
  }

  return (
    <HStack style={styles.container}>
      <Box>
        <Text>{replyMessage.user.name}さんに返信</Text>
        <Text>{replyMessage.text}</Text>
      </Box>

      {/* close */}
    </HStack>
  );
};

export const REPLY_MESSAGE_CONTAINER_HEIGHT = 50;

const styles = StyleSheet.create({
  container: {
    height: REPLY_MESSAGE_CONTAINER_HEIGHT,
    backgroundColor: "red",
    marginBottom: 120,
  },
});
