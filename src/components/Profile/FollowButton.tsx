import React from "react";
import { Pressable, Text, useColorModeValue } from "native-base";
import { useFollowMutation } from "src/generated/graphql";

type Props = {
  userId: string;
  follow?: boolean;
};

export const FollowButton = ({ userId, follow }: Props) => {
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
      right="3"
      borderWidth={follow ? "1" : "0"}
      borderColor={
        follow ? useColorModeValue("textBlack", "textWhite") : undefined
      }
      bg={follow ? undefined : "pink"}
      px="2"
      py="1"
      borderRadius="2xl"
      onPress={onPress}
    >
      <Text
        fontWeight="bold"
        color={follow ? undefined : "textWhite"}
        fontSize="13"
      >
        {follow ? "フォロー中" : "フォローする"}
      </Text>
    </Pressable>
  );
};
