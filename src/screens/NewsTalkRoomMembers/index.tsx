import React, { useLayoutEffect, useCallback } from "react";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetNewsTalkRoomMembersQuery,
  NewsTalkRoomMemberEdge,
  useMeQuery,
} from "src/generated/graphql";
import { MemberListItem } from "./MemberListItem";
import { InfiniteFlatList } from "src/components/InfiniteFlatList";
import { SafeAreaView } from "react-native";
import { Indicator } from "src/components/Indicator";
import { btoa } from "react-native-quick-base64";

type Props = RootNavigationScreenProp<"NewsTalkRoomMembers">;

type Item = NewsTalkRoomMemberEdge;

export const NewsTalkRoomMembersScreen = ({ navigation, route }: Props) => {
  const { talkRoomId } = route.params;

  const {
    data: { me },
  } = useMeQuery();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "メンバー",
    });
  }, [navigation]);

  const { data: membersData, fetchMore } = useGetNewsTalkRoomMembersQuery({
    variables: {
      talkRoomId,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const renderItem = useCallback(({ item }: { item: Item }) => {
    const { user } = item.node;

    const swipeEnabled = user.id !== me.id;

    return (
      <MemberListItem
        user={{ id: user.id, name: user.name, imageUrl: user.imageUrl }}
        talkRoomId={talkRoomId}
        swipeEnabled={swipeEnabled}
      />
    );
  }, []);

  const inifiniteLoad = async () => {
    if (membersData) {
      const { pageInfo } = membersData.newsTalkRoom.members;

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
      <InfiniteFlatList
        data={membersData.newsTalkRoom.members.edges}
        renderItem={renderItem}
        keyExtractor={(item) => item.node.id.toString()}
        initialNumToRender={15}
        infiniteLoad={inifiniteLoad}
      />
    </SafeAreaView>
  );
};
