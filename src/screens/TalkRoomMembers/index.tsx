import React, { useLayoutEffect, useCallback } from "react";
import { Box, Pressable, Text } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetThoughtTalkRoomMembersQuery,
  ThoughtTalkRoomMemberEdge,
  useMeQuery,
} from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";
import { InfiniteFlatList } from "src/components/InfiniteFlatList";
import { btoa } from "react-native-quick-base64";
import { SafeAreaView, StyleSheet } from "react-native";
import { useThoughtTalkRoomReadFragment } from "src/hooks/thoughtTalkRoom";
import { MemberListItem } from "./MemberListItem";

type Props = RootNavigationScreenProp<"TalkRoomMembers">;

type Item = ThoughtTalkRoomMemberEdge;

export const TalkRoomMembersScreen = ({ navigation, route }: Props) => {
  const { talkRoomId } = route.params;
  const {
    data: { me },
  } = useMeQuery();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "参加しているメンバー",
    });
  }, [navigation]);

  const { data: membersData, fetchMore } = useGetThoughtTalkRoomMembersQuery({
    variables: {
      talkRoomId,
    },
    fetchPolicy: "network-only",
  });

  const renderItem = useCallback(({ item }: { item: Item }) => {
    return <MemberListItem item={item} talkRoomId={talkRoomId} />;
  }, []);

  const infiniteLoad = async () => {
    if (membersData) {
      const { pageInfo } = membersData.thoughtTalkRoom.members;

      if (pageInfo.hasNextPage) {
        const { endCursor } = pageInfo;

        await fetchMore({
          variables: {
            after: endCursor ? btoa(endCursor) : null,
          },
        });
      }
    }
  };

  if (!membersData) {
    return <Indicator style={{ marginTop: 10 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <InfiniteFlatList<Item>
        data={membersData.thoughtTalkRoom.members.edges}
        renderItem={renderItem}
        infiniteLoad={infiniteLoad}
        keyExtractor={(item) => item.node.id.toString()}
      />
    </SafeAreaView>
  );
};

const LIST_ITEM_LEFT_WIDTH = 40;

const styles = StyleSheet.create({});
