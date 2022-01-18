import React, { ComponentProps } from "react";
import {
  GiftedChat,
  IMessage,
  Bubble,
  MessageText,
  InputToolbar,
  Composer,
  Send,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorModeValue, Text } from "native-base";
import { StyleSheet } from "react-native";

type Props = {} & ComponentProps<typeof GiftedChat>;

export const BaseChat = React.memo(({ ...props }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const bubbleRight = useColorModeValue("#4444ff", "#4444ff");
  const bubbleLeft = useColorModeValue("#e0e0e0", "#525252");
  const leftTextColor = useColorModeValue("black", "white");
  const inputTextColor = useColorModeValue("black", "white");
  const inputContainerBg = useColorModeValue("#f0f0f0", "#292522");
  const keyboard = useColorModeValue("light", "dark");

  return (
    <GiftedChat
      alignTop
      placeholder="メッセージを入力"
      bottomOffset={bottom}
      renderTime={() => null}
      renderBubble={(props) => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: bubbleLeft, paddingVertical: 4 },
              right: { backgroundColor: bubbleRight, paddingVertical: 4 },
            }}
          />
        );
      }}
      renderMessageText={(props) => {
        return (
          <MessageText
            {...props}
            textStyle={{
              left: {
                color: leftTextColor,
              },
              right: { color: "white" },
            }}
          />
        );
      }}
      renderInputToolbar={(props) => (
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: inputContainerBg,
            borderTopWidth: 0,
            borderRadius: 20,
            width: "90%",
            marginLeft: 20,
          }}
        />
      )}
      renderComposer={(props) => {
        return (
          <Composer
            {...props}
            keyboardAppearance={keyboard}
            textInputStyle={{
              color: inputTextColor,
            }}
          />
        );
      }}
      renderSend={(props) => {
        return (
          <Send {...props} containerStyle={styles.sendContainer}>
            <Text style={styles.sendButtonTitile}>送信</Text>
          </Send>
        );
      }}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 15,
  },
  sendButtonTitile: {
    color: "#4444ff",
    fontWeight: "bold",
    fontSize: 16,
  },
});