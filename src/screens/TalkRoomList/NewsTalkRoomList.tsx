import React, { useCallback } from "react";
import { Box, FlatList } from "native-base";
import {
  useGetNewsTalkRoomsQuery,
  GetNewsTalkRoomsQueryResult,
} from "src/generated/graphql";
import { TalkRoomListItem } from "src/components/TalkRoomListItem";

type Item = GetNewsTalkRoomsQueryResult["data"]["newsTalkRooms"][number];

export const NewsTalkRoomList = React.memo(() => {
  const { data: talkRoomData } = useGetNewsTalkRoomsQuery();

  const renderItem = useCallback(({ item }: { item: Item }) => {
    let userImageUrls: string[] = [];

    const { edges } = item.messages;

    for (let i = 0; i <= 7; i++) {
      const member = item.members.edges[i];
      if (member) {
        userImageUrls.push(member.node.user.imageUrl);
      }
    }

    const title = item.news.title;
    const text = edges.length ? edges[0].node.text : "";
    const allMessageSeen = item.allMessageSeen;

    const onPress = () => {};

    const onLongPress = () => {};

    return (
      <TalkRoomListItem
        title={title}
        text={text}
        allMessageSeen={allMessageSeen}
        onPress={onPress}
        onLongPress={onLongPress}
        userImageUrls={userImageUrls}
      />
    );
  }, []);

  return (
    <Box flex={1}>
      <FlatList
        data={talkRoomData.newsTalkRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
});
