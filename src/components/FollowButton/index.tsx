import React, { useState, ComponentProps, useEffect } from "react";
import { Pressable, Text, useColorModeValue } from "native-base";
import { useFollow, useUnfollow } from "src/hooks/users";

type Props = {
  userId: string;
  follow?: boolean;
} & ComponentProps<typeof Pressable>;

export const FollowButton = ({ userId, follow, ...props }: Props) => {
  const [followMutation] = useFollow({ followeeId: userId });
  const [unfollowMutation] = useUnfollow({ followeeId: userId });
  const [isFollowing, setIsFollowing] = useState<boolean>(follow);
  useEffect(() => {
    setIsFollowing(follow);
  }, [follow]);

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
    } catch (e) {
      setIsFollowing((c) => !c);
    }
  };

  return (
    <Pressable
      position="absolute"
      top="4"
      right="3"
      borderWidth={isFollowing ? "1" : "0"}
      borderColor={
        isFollowing ? useColorModeValue("textBlack", "textWhite") : undefined
      }
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
