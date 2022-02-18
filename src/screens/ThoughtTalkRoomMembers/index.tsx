import React, { useLayoutEffect, useCallback } from 'react';
import { RootNavigationScreenProp } from 'src/types';
import {
  useGetThoughtTalkRoomMembersQuery,
  ThoughtTalkRoomMemberEdge,
  useGetThoughtTalkRoomParentQuery,
} from 'src/generated/graphql';
import { Indicator } from 'src/components/Indicator';
import { InfiniteFlatList } from 'src/components/InfiniteFlatList';
import { btoa } from 'react-native-quick-base64';
import { SafeAreaView } from 'react-native';
import { MemberListItem } from './MemberListItem';
import { useMyId } from 'src/hooks/me';
import { StyleSheet } from 'react-native';

type Props = RootNavigationScreenProp<'ThoughtTalkRoomMembers'>;

type Item = ThoughtTalkRoomMemberEdge;

export const TalkRoomMembersScreen = ({ navigation, route }: Props) => {
  const { talkRoomId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'メンバー',
    });
  }, [navigation]);

  const myId = useMyId();

  const { data: membersData, fetchMore } = useGetThoughtTalkRoomMembersQuery({
    variables: {
      talkRoomId,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
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
        myId === talkRoomData?.thoughtTalkRoom.thought.contributor.id &&
        user.id !== myId;

      return (
        <MemberListItem
          talkRoomId={talkRoomId}
          user={{ id: user.id, name: user.name, imageUrl: user.imageUrl }}
          swipeEnabled={swipeEnabled}
        />
      );
    },
    [talkRoomId, myId, talkRoomData?.thoughtTalkRoom.thought.contributor.id]
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
    return <Indicator style={styles.indicator} />;
  }

  return (
    <SafeAreaView style={styles.container}>
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

const styles = StyleSheet.create({
  indicator: {
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
});
