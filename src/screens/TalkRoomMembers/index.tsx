import React, { useLayoutEffect, useCallback } from "react";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetThoughtTalkRoomMembersQuery,
  ThoughtTalkRoomMemberEdge,
  useMeQuery,
  useDeleteThoughtTalkRoomMemberMutation,
  useGetThoughtTalkRoomParentQuery,
} from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";
import { InfiniteFlatList } from "src/components/InfiniteFlatList";
import { btoa } from "react-native-quick-base64";
import { SafeAreaView } from "react-native";
import { MemberListItem } from "../../components/TalkRoomMemberListItem";

type Props = RootNavigationScreenProp<"ThoughtTalkRoomMembers">;

type Item = ThoughtTalkRoomMemberEdge;

export const TalkRoomMembersScreen = ({ navigation, route }: Props) => {
  const { talkRoomId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "メンバー",
    });
  }, [navigation]);

  const {
    data: { me },
  } = useMeQuery();

  const { data: membersData, fetchMore } = useGetThoughtTalkRoomMembersQuery({
    variables: {
      talkRoomId,
    },
    fetchPolicy: "network-only",
  });

  const { data: talkRoomData } = useGetThoughtTalkRoomParentQuery({
    variables: {
      id: talkRoomId,
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: Item }) => {
      if (!item) {
        return null;
      }

      const { user } = item.node;

      const swipeEnabled =
        me.id === talkRoomData?.thoughtTalkRoom.thought.contributor.id &&
        user.id !== me.id;

      return (
        <MemberListItem
          talkRoomId={talkRoomId}
          user={{ id: user.id, name: user.name, imageUrl: user.imageUrl }}
          swipeEnabled={swipeEnabled}
        />
      );
    },
    [me, talkRoomData?.thoughtTalkRoom.thought.contributor.id]
  );

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
        initialNumToRender={15}
      />
    </SafeAreaView>
  );
};
