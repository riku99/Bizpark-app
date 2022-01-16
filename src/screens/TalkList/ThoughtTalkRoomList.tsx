import React, { useCallback } from "react";
import { Box, FlatList, HStack, Pressable } from "native-base";
import {
  useGetThoughtTalkRoomsQuery,
  ThoughtTalkRoom,
  GetThoughtTalkRoomsQueryResult,
} from "src/generated/graphql";
import { UserImages } from "src/components/UserImages";

type Item = GetThoughtTalkRoomsQueryResult["data"]["thoughtTalkRooms"][number];

export const ThoughtTalkRoomList = React.memo(() => {
  const { data } = useGetThoughtTalkRoomsQuery();

  const renderItem = useCallback(({ item }: { item: Item }) => {
    let images: string[] = [];

    for (let i = 0; i <= 5; i++) {
      const member = item.members[i];
      if (member) {
        images.push(member.user.imageUrl);
      }
    }

    return (
      <Pressable>
        <HStack py="4" px="4" alignItems="center">
          <UserImages data={images} imageSize="8" />
        </HStack>
      </Pressable>
    );
  }, []);

  if (!data) {
    return <></>;
  }

  return (
    <Box flex={1}>
      <FlatList
        data={data.thoughtTalkRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
});
