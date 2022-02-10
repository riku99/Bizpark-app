import React, { ComponentProps } from "react";
import { Pressable, Text, useColorModeValue } from "native-base";
import { useCreateOneOnOneTalkRoomMutation } from "src/generated/graphql";
import { spinnerVisibleVar } from "src/stores/spinner";

type Props = {
  userId?: string;
} & ComponentProps<typeof Pressable>;

export const SendMessageButton = ({ userId, ...props }: Props) => {
  const borderColor = useColorModeValue("textBlack", "textWhite");

  const [createTalkRoomMutation] = useCreateOneOnOneTalkRoomMutation();

  const onPress = async () => {
    // まずローカルでチェック

    try {
      spinnerVisibleVar(true);

      const { data } = await createTalkRoomMutation({
        variables: {
          input: {
            recipientId: userId,
          },
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
      spinnerVisibleVar(false);
    }
  };

  return (
    <Pressable
      px="2"
      py="1"
      borderRadius="2xl"
      borderWidth="1"
      borderColor={borderColor}
      onPress={onPress}
      {...props}
    >
      <Text fontWeight="bold" fontSize="13">
        メッセージを送る
      </Text>
    </Pressable>
  );
};
