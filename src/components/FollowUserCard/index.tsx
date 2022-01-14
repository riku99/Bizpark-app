import React, { useEffect } from "react";
import { Box, HStack, Text } from "native-base";
import { ListItem } from "react-native-elements";
import { useUserCacheFragment } from "src/hooks/users";
import { UserImage } from "src/components/UserImage";
import { FollowButton } from "src/components/FollowButton";

type Props = { id: string };

export const FollowUserCard = ({ id }: Props) => {
  const { readUserFragment } = useUserCacheFragment();
  const cacheData = readUserFragment({ id });

  if (!cacheData) {
    return null;
  }

  const { name, imageUrl, follow } = cacheData;

  return (
    <HStack px="4" alignItems="center" h="16">
      <HStack alignItems="center">
        <UserImage uri={imageUrl} size="10" />
        <Text fontWeight="bold" ml="2">
          {name}
        </Text>
      </HStack>

      <FollowButton userId={id} follow={follow} mt="1" />
    </HStack>
  );
};
