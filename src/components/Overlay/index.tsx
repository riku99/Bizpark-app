import React from "react";
import { Pressable, useColorModeValue } from "native-base";
import { StyleSheet } from "react-native";

type Props = { children: JSX.Element; onBackdropPress?: () => void };

export const Overlay = ({ children, onBackdropPress }: Props) => {
  return (
    <Pressable style={styles.container} onPress={onBackdropPress}>
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
    zIndex: 1,
  },
  pressable: {
    width: "100%",
    height: "100%",
  },
});
