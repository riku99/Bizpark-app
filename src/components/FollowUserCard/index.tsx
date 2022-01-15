import React from "react";
import { HStack, Text, Pressable } from "native-base";
import { useUserCacheFragment } from "src/hooks/users";
import { UserImage } from "src/components/UserImage";
import { FollowButton } from "src/components/FollowButton";
import { RootNavigationProp } from "src/types";
import { useNavigation } from "@react-navigation/native";

type Props = { id: string };

export const FollowUserCard = ({ id }: Props) => {
  const { readUserFragment } = useUserCacheFragment();
  const cacheData = readUserFragment({ id });
  const navigation = useNavigation<RootNavigationProp<any>>();

  if (!cacheData) {
    return null;
  }

  const { name, imageUrl, follow } = cacheData;

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("UserProfile", {
          id,
        });
      }}
    >
      <HStack px="4" py="4" alignItems="center">
        <HStack alignItems="center">
          <UserImage uri={imageUrl} size="10" />
          <Text fontWeight="bold" ml="4">
            {name}
          </Text>
        </HStack>

        <FollowButton userId={id} follow={follow} mt="1" />
      </HStack>
    </Pressable>
  );
};
