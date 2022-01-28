import React, { ComponentProps, useCallback, useState } from "react";
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
import { useColorModeValue, Text, Box } from "native-base";
import { StyleSheet, NativeScrollEvent } from "react-native";
import { Indicator } from "src/components/Indicator";
import { INITIAL_MESSAGE_COUNT } from "src/constants";
import { Overlay } from "react-native-elements";
import { CustomBubble } from "./CustomBubble";
import { BottomContents } from "./BottomContents";

type Props = { infiniteLoad?: () => Promise<void> } & ComponentProps<
  typeof GiftedChat
>;

export const BaseChat = React.memo(({ infiniteLoad, ...props }: Props) => {
  const { bottom } = useSafeAreaInsets();
  const bubbleRight = useColorModeValue("#4444ff", "#4444ff");
  const bubbleLeft = useColorModeValue("#e0e0e0", "#525252");
  const leftTextColor = useColorModeValue("black", "white");
  const inputTextColor = useColorModeValue("black", "white");
  const inputContainerBg = useColorModeValue("#f0f0f0", "#292522");
  const keyboard = useColorModeValue("light", "dark");
  const [infiniteLoading, setInfiniteLoading] = useState(false);

  const [longPressedMessage, setLongPressedMessage] = useState<IMessage | null>(
    null
  );

  const onBubbleLongPress = (im: IMessage) => {
    setLongPressedMessage(im);
  };

  const renderBubble = useCallback(
    (props) => {
      return <CustomBubble setMessage={setLongPressedMessage} {...props} />;
    },
    [bubbleLeft, bubbleRight]
  );

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
    ),
    [inputContainerBg]
  );

  const renderComposer = useCallback(
    (props) => {
      return (
        <Composer
          {...props}
          keyboardAppearance={keyboard}
          textInputStyle={{
            color: inputTextColor,
          }}
        />
      );
    },
    [inputTextColor]
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
        bottomOffset={bottom}
        loadEarlier={infiniteLoading}
        renderTime={() => null}
        renderBubble={renderBubble}
        renderMessageText={renderMessageText}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        renderLoadEarlier={renderLoadEarlier}
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
          onBackdropPress={() => setLongPressedMessage(null)}
          close={() => setLongPressedMessage(null)}
          message={longPressedMessage}
        />
      )}
    </>
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
