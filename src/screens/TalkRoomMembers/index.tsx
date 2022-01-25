import React, { useLayoutEffect, useCallback } from "react";
import { Box, Pressable, Text } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetThoughtTalkRoomMembersQuery,
  ThoughtTalkRoomMemberEdge,
} from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";
import { InfiniteFlatList } from "src/components/InfiniteFlatList";
import { ListItem } from "src/components/ListItem";
import { UserImage } from "src/components/UserImage";

type Props = RootNavigationScreenProp<"TalkRoomMembers">;

type Item = ThoughtTalkRoomMemberEdge;

export const TalkRoomMembersScreen = ({ navigation, route }: Props) => {
  const { talkRoomId } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "メンバー",
      headerRight: () => (
        <Pressable>
          <Text fontWeight="bold">編集</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const { data, fetchMore } = useGetThoughtTalkRoomMembersQuery({
    variables: {
      talkRoomId,
    },
    fetchPolicy: "network-only",
  });

  const renderItem = useCallback(({ item }: { item: Item }) => {
    const { user } = item.node;
    return (
      <ListItem
        title={user.name}
        ItemLeft={<UserImage uri={user.imageUrl} size="8" />}
        py="3"
      />
    );
  }, []);

  const infiniteLoad = async () => {};

  if (!data) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <Box flex={1}>
      <InfiniteFlatList<Item>
        data={data.thoughtTalkRoom.members.edges}
        renderItem={renderItem}
        infiniteLoad={infiniteLoad}
        keyExtractor={(item) => item.node.id.toString()}
      />
    </Box>
  );
};
