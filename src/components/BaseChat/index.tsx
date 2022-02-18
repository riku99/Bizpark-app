import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  GiftedChat,
  IMessage,
  MessageText,
  Composer,
  Send,
  InputToolbar,
} from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorModeValue, Text, Box, HStack } from 'native-base';
import {
  StyleSheet,
  NativeScrollEvent,
  Dimensions,
  Keyboard,
} from 'react-native';
import { Indicator } from 'src/components/Indicator';
import { INITIAL_MESSAGE_COUNT } from 'src/constants';
import { CustomBubble } from './CustomBubble';
import { BubbleActions } from './BubbleActions';
import { ReplyMessage, REPLY_MESSAGE_CONTAINER_HEIGHT } from './ReplyMessage';
import { useHeaderHeight } from '@react-navigation/elements';
import { useIsMe } from 'src/hooks/me';

type Props = {
  infiniteLoad?: () => Promise<void>;
  replyMessage: IMessage | null;
  setReplyMessage: (data: IMessage | null) => void;
} & ComponentProps<typeof GiftedChat>;

export const BaseChat = React.memo(
  ({ infiniteLoad, replyMessage, setReplyMessage, ...props }: Props) => {
    const { bottom } = useSafeAreaInsets();
    const leftTextColor = useColorModeValue('black', 'white');
    const inputTextColor = useColorModeValue('black', 'white');
    const keyboard = useColorModeValue('light', 'dark');
    const inputContainerBg = useColorModeValue('#f0f0f0', '#292522');
    const leftReplyMesageTextColor = useColorModeValue('#4d4d4d', '#d1d1d1');
    const rightReplyMessageTextColor = useColorModeValue('#e3e3e3', '#d1d1d1');
    const [infiniteLoading, setInfiniteLoading] = useState(false);

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    useEffect(() => {
      const willShowListnener = Keyboard.addListener(
        'keyboardWillShow',
        (e) => {
          setKeyboardHeight(e.endCoordinates.height);
        }
      );

      const willHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
        setKeyboardHeight(0);
      });

      return () => {
        willShowListnener.remove();
        willHideListener.remove();
      };
    }, []);

    const isInitialMount = useRef(true);

    useEffect(() => {
      isInitialMount.current = false;
    }, []);

    const { isMe } = useIsMe();

    const [longPressedMessage, setLongPressedMessage] =
      useState<IMessage | null>(null);

    const [messageContainerHeight, setMessageContainerHeight] = useState<
      number | null
    >(null);

    // GftedChatから渡されるheight
    const [giftedChatMessageHeight, setGiftedChatMessageHeight] = useState<
      number | null
    >(null);

    const headerH = useHeaderHeight();

    const MAX_MESSAGE_HEIGHT =
      SCREEN_HEIGHT - INPUT_CONTAINER_HEIGHT - headerH - bottom;

    useEffect(() => {
      if (giftedChatMessageHeight) {
        if (!replyMessage) {
          setMessageContainerHeight(giftedChatMessageHeight);
        } else {
          setMessageContainerHeight(
            giftedChatMessageHeight - REPLY_MESSAGE_CONTAINER_HEIGHT
          );
        }
      }
    }, [giftedChatMessageHeight, messageContainerHeight, replyMessage]);

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
              right: { color: 'white' },
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
                width: '94%',
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
      return (
        <Indicator style={{ marginTop: 10, marginBottom: 10, height: 30 }} />
      );
    }, []);

    const renderCustomView = useCallback(
      (props) => {
        const replyMessage = props.currentMessage.replyMessage;

        if (!replyMessage) {
          return null;
        }

        const isMySendData = isMe({ userId: props.currentMessage.user._id });

        const textColor = isMySendData
          ? rightReplyMessageTextColor
          : leftReplyMesageTextColor;

        return (
          <HStack px="2" pt="2" mb="1">
            {/* 引用ラベル */}
            <Box
              bg="lightGray"
              style={{
                width: 5,
                borderRadius: 10,
                height: '100%',
                marginRight: 8,
              }}
            />

            <Box>
              <Text color={textColor}>{replyMessage.user.name}</Text>
              <Text color={textColor} mt="1">
                {replyMessage.text}
              </Text>
            </Box>
          </HStack>
        );
      },
      [rightReplyMessageTextColor, leftReplyMesageTextColor]
    );

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

    const getMessageContainerHeight = (h: number) => {
      setGiftedChatMessageHeight(h);
    };

    return (
      <>
        <GiftedChat
          keyboardShouldPersistTaps="handled"
          getMessagesContainerHeight={getMessageContainerHeight}
          messagesContainerStyle={{
            height:
              messageContainerHeight &&
              messageContainerHeight <= MAX_MESSAGE_HEIGHT
                ? messageContainerHeight
                : MAX_MESSAGE_HEIGHT,
          }}
          locale="jp"
          alignTop
          placeholder="メッセージを入力"
          bottomOffset={bottom - PADDING_BOTTOM_FROM_KEYBOARD}
          loadEarlier={infiniteLoading}
          renderTime={() => null}
          renderBubble={renderBubble}
          renderMessageText={renderMessageText}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderLoadEarlier={renderLoadEarlier}
          renderCustomView={renderCustomView}
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
          <BubbleActions
            close={() => setLongPressedMessage(null)}
            message={longPressedMessage}
            setReplyMessage={setReplyMessage}
            keyboardHeight={keyboardHeight}
          />
        )}
      </>
    );
  }
);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const INPUT_PADDING_X = SCREEN_WIDTH * 0.03;
const PADDING_BOTTOM_FROM_KEYBOARD = 5;
const INPUT_CONTAINER_HEIGHT = 45;

const styles = StyleSheet.create({
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sendButtonTitile: {
    color: '#4444ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
