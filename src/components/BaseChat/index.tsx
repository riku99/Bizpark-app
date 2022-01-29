import React, { ComponentProps, useCallback, useEffect, useState } from "react";
import {
  GiftedChat,
  IMessage,
  MessageText,
  Composer,
  Send,
  InputToolbar,
  Message,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorModeValue, Text, Box, Input } from "native-base";
import {
  StyleSheet,
  NativeScrollEvent,
  Dimensions,
  Keyboard,
} from "react-native";
import { Indicator } from "src/components/Indicator";
import { INITIAL_MESSAGE_COUNT } from "src/constants";
import { CustomBubble } from "./CustomBubble";
import { BottomContents } from "./BottomContents";
import { ReplyMessage, REPLY_MESSAGE_CONTAINER_HEIGHT } from "./ReplyMessage";

type Props = { infiniteLoad?: () => Promise<void> } & ComponentProps<
  typeof GiftedChat
>;

export const BaseChat = React.memo(({ infiniteLoad, ...props }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const bubbleRight = useColorModeValue("#4444ff", "#4444ff");
  const bubbleLeft = useColorModeValue("#e0e0e0", "#525252");
  const leftTextColor = useColorModeValue("black", "white");
  const inputTextColor = useColorModeValue("black", "white");
  const keyboard = useColorModeValue("light", "dark");
  const inputContainerBg = useColorModeValue("#f0f0f0", "#292522");
  const bg = useColorModeValue("lt.bg", "dt.bg");
  const [infiniteLoading, setInfiniteLoading] = useState(false);

  const [longPressedMessage, setLongPressedMessage] = useState<IMessage | null>(
    null
  );
  const [replyMessage, setReplyMessage] = useState<IMessage | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const willShowListener = Keyboard.addListener("keyboardWillShow", () => {
      setIsKeyboardVisible(true);
      console.log("show");
    });

    const willHideListener = Keyboard.addListener("keyboardWillHide", () => {
      setIsKeyboardVisible(false);
      console.log("hide");
    });

    return () => {
      willShowListener.remove();
      willHideListener.remove();
    };
  }, []);

  const renderBubble = useCallback((props) => {
    return <CustomBubble setMessage={setLongPressedMessage} {...props} />;
  }, []);

  const renderMessageText = useCallback(
    (props) => {
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
    },
    [leftTextColor]
  );

  const renderInputToolbar = useCallback(
    (props) => (
      <Box flex={1}>
        {replyMessage && (
          <Box
            style={{
              height: REPLY_MESSAGE_CONTAINER_HEIGHT,
              transform: [
                {
                  translateY: isKeyboardVisible
                    ? 0
                    : -REPLY_MESSAGE_CONTAINER_HEIGHT,
                },
              ],
            }}
            bg="emerald.300"
          />
        )}

        <InputToolbar
          {...props}
          containerStyle={{
            borderTopWidth: 0,
            paddingHorizontal: 4,
            backgroundColor: inputContainerBg,
            borderRadius: 20,
            width: "94%",
            marginLeft: "3%",
          }}
        />
      </Box>
    ),
    [replyMessage, inputContainerBg, isKeyboardVisible]
  );

  const renderComposer = useCallback(
    (props) => {
      return (
        <Composer
          {...props}
          keyboardAppearance={keyboard}
          textInputStyle={{
            color: inputTextColor,
            borderTopWidth: 0,
          }}
        />
      );
    },
    [inputTextColor, inputContainerBg]
  );

  const renderSend = useCallback((props) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <Text style={styles.sendButtonTitile}>送信</Text>
      </Send>
    );
  }, []);

  const renderLoadEarlier = useCallback(() => {
    return <Indicator style={{ marginTop: 10, marginBottom: 10 }} />;
  }, []);

  // リプライ用のコンテンツにメッセージが隠れてしまうのでその分スクロールできるようにする
  const renderFooter = useCallback(() => {
    if (!replyMessage || isKeyboardVisible) {
      return null;
    }

    return (
      <Box
        style={{
          height: REPLY_MESSAGE_CONTAINER_HEIGHT,
        }}
      />
    );
  }, [replyMessage, isKeyboardVisible]);

  const closeToTop = useCallback((nativeEvent: NativeScrollEvent) => {
    return (
      nativeEvent.contentSize.height -
        nativeEvent.layoutMeasurement.height -
        100 <=
      nativeEvent.contentOffset.y
    );
  }, []);

  const onCloseToTop = useCallback(async () => {
    if (!infiniteLoading && infiniteLoad) {
      setInfiniteLoading(true);
      await infiniteLoad();
      setInfiniteLoading(false);
    }
  }, [infiniteLoading, infiniteLoad]);

  return (
    <>
      <GiftedChat
        alignTop
        placeholder="メッセージを入力"
        bottomOffset={
          bottom - (replyMessage ? REPLY_MESSAGE_CONTAINER_HEIGHT + 5 : 5)
        }
        loadEarlier={infiniteLoading}
        renderTime={() => null}
        renderBubble={renderBubble}
        renderMessageText={renderMessageText}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        renderLoadEarlier={renderLoadEarlier}
        renderFooter={renderFooter}
        listViewProps={{
          scrollEventThrottle: 400,
          onScroll: ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
            if (
              props.messages.length >= INITIAL_MESSAGE_COUNT &&
              closeToTop(nativeEvent)
            ) {
              onCloseToTop();
            }
          },
        }}
        {...props}
      />

      {!!longPressedMessage && (
        <BottomContents
          close={() => setLongPressedMessage(null)}
          message={longPressedMessage}
          setReplyMessage={setReplyMessage}
        />
      )}
    </>
  );
});

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

const styles = StyleSheet.create({
  sendContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sendButtonTitile: {
    color: "#4444ff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
