import React, { ComponentProps } from "react";
import { Box, HStack, Text, useColorModeValue, Pressable } from "native-base";
import { MotiView } from "moti";
import { Overlay } from "src/components/Overlay";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Button, Overlay, Icon } from "react-native-elements";

type Props = {
  onBackdropPress: () => void;
} & ComponentProps<typeof Box>;

export const BottomContents = ({ onBackdropPress, ...props }: Props) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <Overlay onBackdropPress={onBackdropPress}>
      <MotiView>
        <Box style={[styles.bottomContents, { height: 60 + bottom }]}></Box>
      </MotiView>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  bottomContents: {
    width: "100%",
    backgroundColor: "blue",
    position: "absolute",
    bottom: 0,
    zIndex: 10,
  },
});
