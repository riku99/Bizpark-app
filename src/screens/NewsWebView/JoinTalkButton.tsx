import React from "react";
import { Box, Button } from "native-base";
import { CloseButton } from "src/components/CloseButton";
import { StyleSheet } from "react-native";
import { useJoinNewsTalkRoomMutation } from "src/generated/graphql";

type Props = {
  onCloseButtonPress: () => void;
  newsId: number;
};

export const JoinTalkButton = ({ onCloseButtonPress, newsId }: Props) => {
  const [joinNewsTalkRoomMutation] = useJoinNewsTalkRoomMutation();

  const onJoinPress = async () => {
    try {
      const { data } = await joinNewsTalkRoomMutation({
        variables: {
          input: {
            newsId,
          },
        },
      });

      if (data) {
        console.log(data.joinNewsTalkRoom);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
      <Button w="100%" _text={{ fontSize: 16 }} onPress={onJoinPress}>
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
