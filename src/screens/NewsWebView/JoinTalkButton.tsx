import React from "react";
import { Box, Button } from "native-base";
import { CloseButton } from "src/components/CloseButton";
import { StyleSheet } from "react-native";

type Props = {
  onCloseButtonPress: () => void;
};

export const JoinTalkButton = ({ onCloseButtonPress }: Props) => {
  return (
    <Box
      position="absolute"
      w="90%"
      alignItems="center"
      alignSelf="center"
      bottom={4}
    >
      <CloseButton
        size={7}
        style={styles.closeButton}
        onPress={onCloseButtonPress}
      />
      <Button w="100%" _text={{ fontSize: 16 }}>
        このニュースについてトークする
      </Button>
    </Box>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: "flex-end",
    transform: [{ translateY: -15 }],
  },
});
