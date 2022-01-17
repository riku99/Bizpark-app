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
import { RootNavigationProp } from "src/types";
import { useNavigation } from "@react-navigation/native";

type Item = GetThoughtTalkRoomsQueryResult["data"]["thoughtTalkRooms"][number];

export const ThoughtTalkRoomList = React.memo(() => {
  const { data } = useGetThoughtTalkRoomsQuery();
  const pressedColor = useColorModeValue("lt.pressed", "dt.pressed");
  const textGray = useColorModeValue("lt.textGray", "dt.textGray");
  const navigation = useNavigation<RootNavigationProp<"Tab">>();

  const renderItem = useCallback(({ item }: { item: Item }) => {
    let images: string[] = [];

    for (let i = 0; i <= 7; i++) {
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
        onPress={() => {
          navigation.navigate("TalkRoom", {
            id: item.id,
          });
        }}
      >
        <HStack alignItems="center" py="4" justifyContent="space-between">
          <Box w="76%">
            <Text h="7" fontWeight="bold" fontSize="14">
              {item.thought.title ? item.thought.title : item.thought.text}
            </Text>

            <Text color={textGray} h="7">
              {item.messages.length ? item.messages[0].text : ""}
            </Text>
            <UserImages data={images} imageSize="8" mt="1" />
          </Box>

          {/* バッジ */}
          <Box bg="pink" w="3" h="3" borderRadius="full" />
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
