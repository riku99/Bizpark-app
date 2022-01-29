import React, { ComponentProps } from "react";
import {
  Box,
  HStack,
  Text,
  useColorModeValue,
  Pressable,
  useTheme,
} from "native-base";
import { MotiView } from "moti";
import { Overlay } from "src/components/Overlay";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { IMessage } from "react-native-gifted-chat";

type Props = {
  message: IMessage;
  close: () => void;
  setReplyMessage: (message: IMessage) => void;
} & ComponentProps<typeof Box>;

export const BottomContents = ({
  message,
  close,
  setReplyMessage,
  ...props
}: Props) => {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useTheme();

  const bg = useColorModeValue(colors.lt.bg, colors.dt.bg);

  const onCopyPress = () => {
    Clipboard.setString(message.text);
    close();
  };

  const onReplyPress = () => {
    setReplyMessage(message);
    close();
  };

  return (
    <Overlay onBackdropPress={close}>
      <MotiView
        style={[
          styles.bottomContents,
          { height: 60 + bottom, backgroundColor: bg },
        ]}
        from={{ translateY: 60 + bottom }}
        animate={{ translateY: 0 }}
        transition={{ type: "timing", duration: 200 }}
      >
        <Pressable
          flex={1}
          justifyContent="center"
          alignItems="center"
          onPress={onReplyPress}
        >
          {(props) => (
            <Text
              fontWeight="bold"
              fontSize="16"
              opacity={props.isPressed ? 0.8 : 1}
              style={{ marginBottom: bottom }}
            >
              返信する
            </Text>
          )}
        </Pressable>

        <Pressable
          flex={1}
          justifyContent="center"
          alignItems="center"
          onPress={onCopyPress}
        >
          {(props) => (
            <Text
              fontWeight="bold"
              fontSize="16"
              opacity={props.isPressed ? 0.8 : 1}
              style={{ marginBottom: bottom }}
            >
              コピー
            </Text>
          )}
        </Pressable>
      </MotiView>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  bottomContents: {
    width: "100%",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    zIndex: 10,
  },
});
