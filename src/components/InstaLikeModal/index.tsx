import React from "react";
import { View, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Box, useColorModeValue, Pressable, Text, Divider } from "native-base";

export type ListItem = {
  title: string;
  color?: string;
  onPress: () => void;
};

type Props = {
  list: ListItem[];
  onCancel: () => void;
  isVisible: boolean;
  onBackdropPress: () => void;
};

export const InstaLikeModal = React.memo(
  ({ onCancel, list, isVisible, onBackdropPress }: Props) => {
    const pressedColor = useColorModeValue("lt.pressed", "dt.pressed");

    return (
      <Modal
        isVisible={isVisible}
        backdropOpacity={0.25}
        style={{ justifyContent: "flex-end", marginBottom: 20 }}
        onBackdropPress={onBackdropPress}
      >
        <Box
          style={styles.itemsContainer}
          bg={useColorModeValue("white", "dt.darkGray")}
        >
          {list.map((l, idx) => (
            <View key={idx}>
              {idx !== 0 && (
                <Divider
                  style={{ width: "100%" }}
                  bg={useColorModeValue("#e6e6e6", "#333333")}
                />
              )}
              <Pressable
                style={styles.item}
                onPress={l.onPress}
                _pressed={{
                  bg: pressedColor,
                }}
              >
                <Text
                  style={[styles.itemTitle]}
                  color={
                    l.color
                      ? l.color
                      : useColorModeValue("textBlack", "textWhite")
                  }
                >
                  {l.title}
                </Text>
              </Pressable>
            </View>
          ))}
        </Box>
        <Pressable
          style={[styles.cancelContainer, styles.item]}
          onPress={onCancel}
          bg={useColorModeValue("white", "dt.darkGray")}
          _pressed={{ bg: pressedColor }}
        >
          <Text style={styles.itemTitle}>キャンセル</Text>
        </Pressable>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  itemsContainer: {
    borderRadius: 15,
    overflow: "hidden",
  },
  item: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
  },
  cancelContainer: {
    marginTop: 20,
    borderRadius: 15,
  },
});
