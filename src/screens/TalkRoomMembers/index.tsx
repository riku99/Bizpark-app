import React, { useLayoutEffect, useCallback } from "react";
import { Box, Pressable, Text, HStack } from "native-base";
import { RootNavigationScreenProp } from "src/types";
import {
  useGetThoughtTalkRoomMembersQuery,
  ThoughtTalkRoomMemberEdge,
  useMeQuery,
} from "src/generated/graphql";
import { Indicator } from "src/components/Indicator";
import { InfiniteFlatList } from "src/components/InfiniteFlatList";
import { ListItem } from "src/components/ListItem";
import { UserImage } from "src/components/UserImage";
import { btoa } from "react-native-quick-base64";
import { SafeAreaView, StyleSheet } from "react-native";
import { useThoughtTalkRoomReadFragment } from "src/hooks/thoughtTalkRoom";
import { MotiView } from "moti";

type Props = RootNavigationScreenProp<"TalkRoomMembers">;

type Item = ThoughtTalkRoomMemberEdge;

export const TalkRoomMembersScreen = ({ navigation, route }: Props) => {
  const { talkRoomId } = route.params;
  const fragmentCacheData = useThoughtTalkRoomReadFragment({ id: talkRoomId });
  const {
    data: { me },
  } = useMeQuery();
  const myData = fragmentCacheData.thought.contributor.id === me.id;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "参加したメンバー",
      headerRight: () => {
        if (!myData) {
          return null;
        }

        return (
          <Pressable>
            <Text>編集</Text>
          </Pressable>
        );
      },
    });
  }, [navigation]);

  const { data: membersData, fetchMore } = useGetThoughtTalkRoomMembersQuery({
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
        onPress={() => {
          navigation.navigate("UserProfile", {
            id: item.node.user.id,
          });
        }}
      />
    );
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

const styles = StyleSheet.create({
  listItemContainerLeft: {
    width: LIST_ITEM_LEFT_WIDTH,
    backgroundColor: "red",
  },
  listItemContainer: {
    transform: [{ translateX: -LIST_ITEM_LEFT_WIDTH }],
  },
});
