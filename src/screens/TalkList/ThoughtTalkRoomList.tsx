import React, { useCallback } from "react";
import {
  Box,
  FlatList,
  HStack,
  Pressable,
  Text,
  Divider,
  useColorModeValue,
} from "native-base";
import {
  useGetThoughtTalkRoomsQuery,
  GetThoughtTalkRoomsQueryResult,
} from "src/generated/graphql";
import { UserImages } from "src/components/UserImages";

type Item = GetThoughtTalkRoomsQueryResult["data"]["thoughtTalkRooms"][number];

export const ThoughtTalkRoomList = React.memo(() => {
  const { data } = useGetThoughtTalkRoomsQuery();
  const pressedColor = useColorModeValue("lt.pressed", "dt.pressed");

  const renderItem = useCallback(({ item }: { item: Item }) => {
    let images: string[] = [];

    for (let i = 0; i <= 5; i++) {
      const member = item.members[i];
      if (member) {
        images.push(member.user.imageUrl);
      }
    }

    return (
      <Pressable
        px="4"
        _pressed={{
          bg: pressedColor,
        }}
      >
        <HStack alignItems="center" py="4">
          <Box w="76%">
            <Text h="7" fontWeight="bold" fontSize="14">
              {item.thought.title ? item.thought.title : item.thought.text}
            </Text>

            <Text>textextextextテキスト</Text>
            <UserImages data={images} imageSize="8" mt="2" />
          </Box>
          {/* バッジ */}
        </HStack>

        <Divider />
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
