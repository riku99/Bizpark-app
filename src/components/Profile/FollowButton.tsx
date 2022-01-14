import React from "react";
import { Pressable, Text, useColorModeValue } from "native-base";
import { useFollowMutation } from "src/generated/graphql";

type Props = {
  userId: string;
};

export const FollowButton = ({ userId }: Props) => {
  const [followMutation] = useFollowMutation();

  const onPress = async () => {
    await followMutation({
      variables: {
        followeeId: userId,
      },
    });
  };

  return (
    <Pressable
      position="absolute"
      top="4"
      right="4"
      borderWidth="1"
      borderColor={useColorModeValue("textBlack", "textWhite")}
      p="2"
      borderRadius="2xl"
      onPress={onPress}
    >
      <Text fontWeight="bold">フォロー</Text>
    </Pressable>
  );
};
