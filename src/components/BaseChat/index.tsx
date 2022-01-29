import React, { ComponentProps, useCallback, useEffect, useState } from "react";
import {
  GiftedChat,
  IMessage,
  MessageText,
  Composer,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorModeValue, Text, Box } from "native-base";
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
import { useHeaderHeight } from "@react-navigation/elements";

type Props = {
  infiniteLoad?: () => Promise<void>;
  replyMessage: IMessage | null;
  setReplyMessage: (data: IMessage | null) => void;
} & ComponentProps<typeof GiftedChat>;

export const BaseChat = React.memo(
  ({ infiniteLoad, replyMessage, setReplyMessage, ...props }: Props) => {
    const { bottom } = useSafeAreaInsets();
    const leftTextColor = useColorModeValue("black", "white");
    const inputTextColor = useColorModeValue("black", "white");
    const keyboard = useColorModeValue("light", "dark");
    const inputContainerBg = useColorModeValue("#f0f0f0", "#292522");
    const [infiniteLoading, setInfiniteLoading] = useState(false);

    const [
      longPressedMessage,
      setLongPressedMessage,
    ] = useState<IMessage | null>(null);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
      const willShowListener = Keyboard.addListener("keyboardWillShow", (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      });

      const willHideListener = Keyboard.addListener("keyboardWillHide", () => {
        setKeyboardHeight(0);
      });

      return () => {
        willShowListener.remove();
        willHideListener.remove();
      };
    }, []);

    const [messageContainerHeight, setMessageContainerHeight] = useState<
      number | null
    >(null);

    const headerH = useHeaderHeight();
    useEffect(() => {
      const commonMessageHeight =
        SCREEN_HEIGHT - INPUT_CONTAINER_HEIGHT - headerH;
      if (!replyMessage) {
        if (!keyboardHeight) {
          const _h = commonMessageHeight - bottom;
          setMessageContainerHeight(_h);
        } else {
          const _h =
            commonMessageHeight - keyboardHeight - PADDING_BOTTOM_FROM_KEYBOARD;
          setMessageContainerHeight(_h);
        }
      } else {
        if (!keyboardHeight) {
          const _h =
            commonMessageHeight - bottom - REPLY_MESSAGE_CONTAINER_HEIGHT;
          setMessageContainerHeight(_h);
        } else {
          const _h =
            commonMessageHeight -
            keyboardHeight -
            REPLY_MESSAGE_CONTAINER_HEIGHT -
            PADDING_BOTTOM_FROM_KEYBOARD;
          setMessageContainerHeight(_h);
        }
      }
    }, [replyMessage, keyboardHeight]);

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
      (props) => {
        return (
          <Box flex={1}>
            {replyMessage && (
              <ReplyMessage
                replyMessage={replyMessage}
                deleteReplyMessage={() => {
                  setReplyMessage(null);
                }}
                style={{
                  paddingHorizontal: INPUT_PADDING_X,
                }}
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
                marginLeft: INPUT_PADDING_X,
              }}
            />
          </Box>
        );
      },
      [replyMessage, inputContainerBg]
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
          messagesContainerStyle={{
            height: messageContainerHeight ?? undefined,
          }}
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
            close={() => setLongPressedMessage(null)}
            message={longPressedMessage}
            setReplyMessage={setReplyMessage}
          />
        )}
      </>
    );
  }
);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const INPUT_PADDING_X = SCREEN_WIDTH * 0.03;
const PADDING_BOTTOM_FROM_KEYBOARD = 5;
const INPUT_CONTAINER_HEIGHT = 45;

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
