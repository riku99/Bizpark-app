import React, { useState, ComponentProps, useEffect } from "react";
import { Pressable, Text, useColorModeValue } from "native-base";
import {
  CustomErrorResponseCode,
  useFollowMutation,
  useUnfollowMutation,
} from "src/generated/graphql";
import { useToast } from "react-native-toast-notifications";
import { getGraphQLErrorCode } from "src/utils";

type Props = {
  userId: string;
  follow?: boolean;
} & ComponentProps<typeof Pressable>;

export const FollowButton = ({ userId, follow, ...props }: Props) => {
  const toast = useToast();
  const [followMutation] = useFollowMutation();
  const [unfollowMutation] = useUnfollowMutation();
  const [isFollowing, setIsFollowing] = useState<boolean>(follow);
  useEffect(() => {
    setIsFollowing(follow);
  }, [follow]);
  const borderColor = useColorModeValue("textBlack", "textWhite");

  const onPress = async () => {
    try {
      if (!isFollowing) {
        setIsFollowing(true);
        await followMutation({
          variables: {
            followeeId: userId,
          },
        });
      } else {
        setIsFollowing(false);
        await unfollowMutation({
          variables: {
            followeeId: userId,
          },
        });
      }
    } catch (error) {
      setIsFollowing((c) => !c);
      const code = getGraphQLErrorCode(error);
      if (code === CustomErrorResponseCode.InvalidRequest) {
        toast.show("ブロックを解除してください", {
          type: "danger",
        });
      }
    }
  };

  return (
    <Pressable
      position="absolute"
      top="4"
      right="3"
      borderWidth={isFollowing ? "1" : "0"}
      borderColor={isFollowing ? borderColor : undefined}
      bg={isFollowing ? undefined : "pink"}
      px="2"
      py="1"
      borderRadius="2xl"
      onPress={onPress}
      {...props}
    >
      <Text
        fontWeight="bold"
        color={isFollowing ? undefined : "textWhite"}
        fontSize="13"
      >
        {isFollowing ? "フォロー中" : "フォローする"}
      </Text>
    </Pressable>
  );
};
